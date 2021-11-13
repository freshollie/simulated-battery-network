/**
 * TODO: In real life this file would actually be interacting with a relational DB. Postgres/MySQL etc.
 * For this test, we are going to pretend that the functions are calling to a DB, hence their asynchronous nature.
 **/

// We are going to assume it's not possible for us to both charge and discharge in a given period
export type Obligation = {type: 'charge' | 'discharge'; volume: number};

const obligations: Array<{period: Date; obligation: Obligation | undefined}> =
  [];

export const recordObligation = async (
  settlementPeriodStartDate: Date,
  obligation: Obligation,
): Promise<void> => {
  obligations.push({period: settlementPeriodStartDate, obligation});
};

export const getObligation = async (
  settlementPeriodStartDate: Date,
): Promise<Obligation | undefined> => {
  return obligations.find(
    ({period}) => period.getTime() === settlementPeriodStartDate.getTime(),
  )?.obligation;
};

export const getNextObligations = async (from: Date): Promise<Obligation[]> => {
  return obligations
    .filter(
      ({period, obligation}) => obligation && period.getTime() > from.getTime(),
    )
    .map(({obligation}) => obligation) as Obligation[];
};
