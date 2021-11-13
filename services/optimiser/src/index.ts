import {addDays, addMinutes, isBefore} from 'date-fns';
import logger from './logger';
import {step} from './logic';

const sleep = async (time: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

const simulate = async (simulationStartDate: Date, days: number) => {
  logger.debug('Starting optimiser simulation');
  let currentPeriod = simulationStartDate;
  // Run a step of the simulation and then advance
  // to the next period
  while (isBefore(currentPeriod, addDays(simulationStartDate, days))) {
    // eslint-disable-next-line no-await-in-loop
    const success = await step(simulationStartDate, currentPeriod)
      .then(() => true)
      .catch((error) => {
        logger.error(error);
        return false;
      });

    if (success) {
      currentPeriod = addMinutes(currentPeriod, 30);
    } else {
      logger.error('Step failed, retrying');
    }

    // eslint-disable-next-line no-await-in-loop
    await sleep(100);
  }
};

void simulate(new Date('2021-10-04 00:00:00'), 7);
