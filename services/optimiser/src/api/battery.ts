import got from 'got';
import config from '../config';

export type Throughput = {exportMwh: number; importMwh: number};

console.log(config.batteryApi);
const batteryService = got.extend({prefixUrl: config.batteryApi});

export const getThroughputBetween = async (
  from: Date,
  to: Date,
): Promise<Throughput> => {
  return batteryService
    .get('throughput', {
      searchParams: {from: from.toISOString(), to: to.toISOString()},
    })
    .json();
};

export const charge = async (mwh: number, period: Date): Promise<void> => {
  await batteryService.post('charge', {json: {volumeMwh: mwh, time: period}});
};

export const discharge = async (mwh: number, period: Date): Promise<void> => {
  await batteryService.post('discharge', {
    json: {volumeMwh: mwh, time: period},
  });
};

export const getSoc = async (): Promise<number> => {
  return batteryService
    .get('soc')
    .json<{socMwh: number}>()
    .then(({socMwh}) => socMwh);
};
