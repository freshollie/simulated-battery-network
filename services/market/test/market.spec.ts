import supertest from 'supertest';
import app from '../src/app';

const server = supertest(app);

describe('Market api', () => {
  describe('PUT /settlement-period', () => {
    it('should return the success with 80% chance', async () => {
      const numberSuccessful = (
        await Promise.all(
          Array.from({length: 100})
            .fill(1)
            .map(async () => {
              const response = await server.put('/settlement-period').send({
                submissionTime: '2021-10-04T16:00:00',
                settlementPeriodStartTime: '2021-10-04T17:00:00',
                offerPrice: 100,
                offerVolume: 10,
                bidPrice: -9999,
                bidVolume: 0,
              });

              expect(response.error).toBeFalsy();
              return response.body.success as boolean;
            }),
        )
      ).filter(Boolean).length;

      expect(numberSuccessful).toBeLessThan(90);
      expect(numberSuccessful).toBeGreaterThan(70);
    });
  });
});
