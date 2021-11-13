import got, {HTTPError} from 'got';
import config from '../config';

const predictionsService = got.extend({prefixUrl: config.predictionsApi});

export type PredictedPrices = Record<string, {offer: number; bid: number}>;

export const getPredictedPrices = async (
  from: Date,
): Promise<PredictedPrices | undefined> => {
  return predictionsService
    .get('prices', {
      searchParams: {from: from.toISOString()},
    })
    .json<PredictedPrices>()
    .catch((error: HTTPError) => {
      if (error.response.statusCode === 404) {
        return undefined;
      }

      throw error;
    });
};
