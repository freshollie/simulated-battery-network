import {
  getFutureObligations,
  getObligation,
  recordObligation,
} from './obligations';

describe('Obligations DB', () => {
  it('should return any recorded obligations for the given settlement period', async () => {
    await recordObligation({
      settlementPeriodStartDate: new Date(1),
      type: 'charge',
      volume: 5,
    });

    await expect(getObligation(new Date(1))).resolves.toEqual({
      settlementPeriodStartDate: new Date(1),
      type: 'charge',
      volume: 5,
    });

    await expect(getObligation(new Date(2))).resolves.toEqual(undefined);
  });

  it('should return the future obligations given the current settlement period', async () => {
    await recordObligation({
      settlementPeriodStartDate: new Date(3),
      type: 'charge',
      volume: 3.4,
    });
    await recordObligation({
      settlementPeriodStartDate: new Date(4),
      type: 'charge',
      volume: 5,
    });
    await recordObligation({
      settlementPeriodStartDate: new Date(5),
      type: 'discharge',
      volume: 10,
    });

    await expect(getFutureObligations(new Date(3))).resolves.toEqual([
      {settlementPeriodStartDate: new Date(4), type: 'charge', volume: 5},
      {settlementPeriodStartDate: new Date(5), type: 'discharge', volume: 10},
    ]);
  });
});
