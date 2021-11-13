import {format} from 'date-fns';
import got from 'got';
import config from '../config';
import logger from '../logger';

export type Settlement = {
  submissionTime: Date;
  settlementPeriodStartTime: Date;
  offer: {
    price: number;
    volume: number;
  };
  bid: {
    price: number;
    volume: number;
  };
};

const marketService = got.extend({prefixUrl: config.marketApi});

const dateFormat = "yyyy-MM-dd'T'HH:mm:ss";

export const submitSettlementPeriod = async (
  settlement: Settlement,
): Promise<{success: boolean}> => {
  logger.debug('Submitting for settlement period', settlement);
  return marketService
    .put('settlement-period', {
      json: {
        submissionTime: format(settlement.submissionTime, dateFormat),
        settlementPeriodStartTime: format(
          settlement.settlementPeriodStartTime,
          dateFormat,
        ),
        offerPrice: settlement.offer.price,
        offerVolume: settlement.offer.volume,
        bidPrice: settlement.bid.price,
        bidVolume: settlement.bid.volume,
      },
    })
    .json();
};
