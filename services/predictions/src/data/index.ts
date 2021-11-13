import {format, getMinutes, setMinutes, startOfMinute} from 'date-fns';
import bidPrices from './bid_price_predictions.json';
import offerPrices from './offer_price_predictions.json';

type Prediction = {
  bid: number;
  offer: number;
};

// Assuming we are getting these values from a DB, hence promise
export const getPredictions = async (
  at: Date,
): Promise<Record<string, Prediction> | undefined> => {
  const interval = roundToNearestMinutes(at, 30);

  const [bids, offers] = await Promise.all([
    bidPredictions(interval),
    offerPredictions(interval),
  ]);

  if (!offers || !bids) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(bids).map(([time, bidPrice]) => [
      new Date(time).toISOString(),
      {bid: bidPrice, offer: offers[time]!},
    ]),
  );
};

const keyFormat = "yyyy-MM-dd'T'HH:mm:ss";

const bidPredictions = async (interval: Date) => {
  const key = format(interval, keyFormat);
  console.log(key);
  const bids: Record<string, number> | undefined =
    bidPrices[key as keyof typeof bidPrices];

  return Promise.resolve(bids);
};

const offerPredictions = async (interval: Date) => {
  const key = format(interval, keyFormat);
  const offers: Record<string, number> | undefined =
    offerPrices[key as keyof typeof bidPrices];

  return Promise.resolve(offers);
};

const roundToNearestMinutes = (date: Date, interval: number): Date => {
  const roundedMinutes = Math.floor(getMinutes(date) / interval) * interval;
  return setMinutes(startOfMinute(date), roundedMinutes);
};
