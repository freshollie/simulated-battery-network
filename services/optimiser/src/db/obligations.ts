/**
 * TODO: In real life this file would actually be interacting with a relational DB. Postgres/MySQL etc.
 * For this test, we are going to pretend that the functions are calling to a DB, hence their asynchronous nature.
 **/

// We are going to assume it's not possible for us to both charge and discharge in a given period
export type Obligation = {
  settlementPeriodStartDate: Date;
  type: 'charge' | 'discharge';
  volume: number;
};

const obligations: Obligation[] = [];

export const recordObligation = async (
  obligation: Obligation,
): Promise<void> => {
  obligations.push(obligation);
};

export const getObligation = async (
  settlementPeriodStartDate: Date,
): Promise<Obligation | undefined> => {
  return obligations.find(
    (obligation) =>
      obligation.settlementPeriodStartDate.getTime() ===
      settlementPeriodStartDate.getTime(),
  );
};

export const getFutureObligations = async (
  from: Date,
): Promise<Obligation[]> => {
  return obligations.filter(
    (obligation) =>
      obligation.settlementPeriodStartDate.getTime() > from.getTime(),
  );
};
