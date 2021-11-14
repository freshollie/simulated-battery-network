import {
  getNextObligations,
  getObligation,
  recordObligation,
} from './obligations';

describe('Obligations DB', () => {
  it('should return any recorded obligations for the given settlement period', async () => {
    await recordObligation(new Date(1), {type: 'charge', volume: 5});

    await expect(getObligation(new Date(1))).resolves.toEqual({
      type: 'charge',
      volume: 5,
    });

    await expect(getObligation(new Date(2))).resolves.toEqual(undefined);
  });

  it('should return the future obligations given the current settlement period', async () => {
    await recordObligation(new Date(3), {type: 'charge', volume: 3.4});
    await recordObligation(new Date(4), {type: 'charge', volume: 5});
    await recordObligation(new Date(5), {type: 'discharge', volume: 10});

    await expect(getNextObligations(new Date(3))).resolves.toEqual([
      {type: 'charge', volume: 5},
      {type: 'discharge', volume: 10},
    ]);
  });
});
