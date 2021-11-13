import supertest from 'supertest';
import app from '../src/app';
import {reset} from '../src/devices/battery';

const server = supertest(app);

afterEach(() => {
  reset();
});

describe('Battery api', () => {
  describe('GET /soc', () => {
    it('should return the soc of the battery', async () => {
      const response = await server.get('/soc');

      expect(response.error).toBeFalsy();
      // Initial soc
      expect(response.body).toEqual({socMwh: 5});
    });
  });

  describe('POST /charge', () => {
    it('should charge the battery by the desired amount', async () => {
      const response = await server.post('/charge').send({volumeMwh: 3.4});

      expect(response.error).toBeFalsy();
      expect(response.body).toEqual({success: true});

      const socResponse = await server.get('/soc');
      expect(socResponse.body).toEqual({socMwh: 8.4});
    });
  });

  describe('POST /discharge', () => {
    it('should discharge the battery by the desired amount', async () => {
      const response = await server.post('/discharge').send({volumeMwh: 4.5});

      expect(response.error).toBeFalsy();
      expect(response.body).toEqual({success: true});

      const socResponse = await server.get('/soc');
      expect(socResponse.body).toEqual({socMwh: 0.5});
    });
  });

  describe('GET /throughput', () => {
    it('should return the through put between the 2 dates', async () => {
      await server
        .post('/charge')
        .send({volumeMwh: 3.4, time: new Date('2021-10-10')});
      await server
        .post('/discharge')
        .send({volumeMwh: 4.5, time: new Date('2021-10-10')});
      await server
        .post('/charge')
        .send({volumeMwh: 5, time: new Date('2021-10-12')});

      const response = await server.get('/throughput').query({
        from: new Date('2021-10-10').toISOString(),
        to: new Date('2021-10-11').toISOString(),
      });

      expect(response.error).toBeFalsy();
      expect(response.body).toEqual({importMwh: 3.4, exportMwh: 4.5});
    });
  });
});
