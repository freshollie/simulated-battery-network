import {addHours, endOfDay, isBefore, startOfDay} from 'date-fns';
import * as battery from './api/battery';
import * as market from './api/market';
import * as predictions from './api/predictions';
import logger from './logger';

import * as obligationsDb from './db/obligations';

// eslint-disable-next-line @typescript-eslint/naming-convention
const MAX_CHARGE = 10;
// eslint-disable-next-line @typescript-eslint/naming-convention
const MAX_DAILY_THROUGHPUT = 20;
// eslint-disable-next-line @typescript-eslint/naming-convention
const MAX_RATE = 5;

export const step = async (simStart: Date, time: Date) => {
  // It may be that the battery itself looks at the market
  // to determine when to dispatch obligations
  // that mechanism doesn't matter here, we are just assuming
  // the optimiser dispatches obligations at the given timestamp
  await dispatchObligations(time);

  const batterySoc = await battery.getSoc();

  const predictedPrices = await predictions.getPredictedPrices(time);

  if (!predictedPrices) {
    logger.warn('Found no predictions for time period', {time});
    return;
  }

  const nextPeriod = addHours(time, 1);
  const nextPeriodPrices = predictedPrices[nextPeriod.toISOString()]!;

  const throughputForPeriodDay = await battery.getThroughputBetween(
    startOfDay(nextPeriod),
    nextPeriod,
  );

  const futureObligations = await obligationsDb.getNextObligations(time);
  const obligatedSoc = calcFutureBatteryState(batterySoc, futureObligations);
  const obligatedThroughput = calcObglibatedThroughput(
    throughputForPeriodDay,
    futureObligations,
  );

  const nextCharge = calculateDesiredVolumeChangeForPeriod(
    nextPeriod,
    obligatedSoc,
    predictedPrices,
    nextPeriodPrices,
    obligatedThroughput,
  );

  const offer =
    nextCharge < 0
      ? {
          volume: Math.abs(nextCharge),
          price: nextPeriodPrices.offer,
        }
      : {
          volume: 0,
          price: 999,
        };
  const bid =
    nextCharge > 0
      ? {
          volume: nextCharge,
          price: nextPeriodPrices.offer,
        }
      : {
          volume: 0,
          price: -999,
        };

  const {success: succesfulSubmission} = await market.submitSettlementPeriod({
    settlementPeriodStartTime: nextPeriod,
    submissionTime: time,
    offer,
    bid,
  });

  if (succesfulSubmission) {
    await obligationsDb.recordObligation(nextPeriod, {
      type: nextCharge > 0 ? 'charge' : 'discharge',
      volume: Math.abs(nextCharge),
    });
  }

  const [throughputToday, throughputAllTime] = await Promise.all([
    battery.getThroughputBetween(startOfDay(time), time),
    battery.getThroughputBetween(simStart, time),
  ]);

  logger.info('Step', {
    time,
    currentSoc: batterySoc,
    predictedPrices,
    throughputToday,
    throughputAllTime,
    nextCharge,
    offer,
    bid,
    offerResult: {...offer, successful: succesfulSubmission},
    bidResult: {...bid, successful: succesfulSubmission},
  });
};

const dispatchObligations = async (settlementPeriod: Date) => {
  const obligation = await obligationsDb.getObligation(settlementPeriod);

  if (obligation?.type === 'charge') {
    await battery.charge(obligation.volume, settlementPeriod);
  } else if (obligation?.type === 'discharge') {
    await battery.discharge(obligation.volume, settlementPeriod);
  }
};

const calcFutureBatteryState = (
  currentSoc: number,
  obligations: obligationsDb.Obligation[],
): number => {
  return obligations.reduce((soc, obligation) => {
    switch (obligation.type) {
      case 'charge':
        return soc + obligation.volume;
      case 'discharge':
        return soc - obligation.volume;
    }

    return soc;
  }, currentSoc);
};

const calcObglibatedThroughput = (
  currentThroughput: battery.Throughput,
  obligations: obligationsDb.Obligation[],
): battery.Throughput => {
  return {
    exportMwh: obligations
      .filter((obligation) => obligation.type === 'discharge')
      .reduce(
        (value, obligation) => value + obligation.volume,
        currentThroughput.exportMwh,
      ),
    importMwh: obligations
      .filter((obligation) => obligation.type === 'charge')
      .reduce(
        (value, obligation) => value + obligation.volume,
        currentThroughput.importMwh,
      ),
  };
};

/**
 * Not a great algorithm, but very basically does the job.
 *
 * Use the current period, and the simulated prices
 * to work out if the period we are about to bid on
 * is best to buy or sell.
 *
 * As the state of charge approaches the limits, we
 * asymptotically decrease our changes to prevent
 * the battery from going over the max charge based
 * off our future obligations.
 *
 * This also make sure we don't go over our cycle
 * budget by again asymptotically decreasing the likelihood
 * of a buy or sell based off the obligated throughput up of
 * the day up to the given period
 *
 * A negative output = sell and a positive output = buy
 *
 * This could be improved by using the predictions to look
 * into the future at oportunities to maximise buys and sells.
 *
 * For example, if there is a large increase in the export price coming up,
 * we should charge to a max ready for that point.
 *
 */
const calculateDesiredVolumeChangeForPeriod = (
  period: Date,
  obligatedSoc: number,
  predictions: predictions.PredictedPrices,
  nextPrices: {offer: number; bid: number},
  obligatedDayThroughputUpToPeriod: battery.Throughput,
): number => {
  const endOfCurrentDay = endOfDay(period);
  const todaysPredictions = Object.entries(predictions)
    .filter(([time]) => isBefore(new Date(time), endOfCurrentDay))
    .map(([, prediction]) => prediction);

  const bidPrices = todaysPredictions.map(({bid}) => bid);
  const offerPrices = todaysPredictions.map(({offer}) => offer);
  const maxCost = Math.max(...bidPrices);
  const minCost = Math.min(...bidPrices);
  const maxOffer = Math.max(...offerPrices);
  const minOffer = Math.min(...offerPrices);

  const buyFactor =
    ((nextPrices.bid - minCost) / (maxCost - minCost)) *
    ((MAX_DAILY_THROUGHPUT - obligatedDayThroughputUpToPeriod.importMwh) /
      MAX_DAILY_THROUGHPUT);
  const sellFactor =
    ((nextPrices.offer - minOffer) / (maxOffer - minOffer)) *
    ((MAX_DAILY_THROUGHPUT - obligatedDayThroughputUpToPeriod.exportMwh) /
      MAX_DAILY_THROUGHPUT);

  logger.debug('Calculate strategy', {
    maxCost,
    minCost,
    maxOffer,
    minOffer,
    nextBuyPrice: nextPrices.bid,
    nextSellPrice: nextPrices.offer,
    buyFactor,
    sellFactor,
  });

  const factor = buyFactor - sellFactor;

  if (factor > 0) {
    return Math.min((MAX_CHARGE - obligatedSoc) * factor, MAX_RATE);
  }

  return Math.max(obligatedSoc * factor, -MAX_RATE);
};
