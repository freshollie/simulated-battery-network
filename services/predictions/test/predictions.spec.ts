import supertest from 'supertest';
import app from '../src/app';

const server = supertest(app);

describe('Predictions api', () => {
  describe('/prices', () => {
    it('should return the predictions for the given time', async () => {
      const response = await server
        .get('/prices')
        .query({from: new Date('2021-10-04T01:00:00').toISOString()});

      expect(response.error).toBeFalsy();

      expect(response.body).toMatchInlineSnapshot(`
      Object {
        "2021-10-04T00:30:00.000Z": Object {
          "bid": 39.3535313160044,
          "offer": 255.56808158997706,
        },
        "2021-10-04T01:00:00.000Z": Object {
          "bid": 30.71154628501926,
          "offer": 256.6414381638551,
        },
        "2021-10-04T01:30:00.000Z": Object {
          "bid": 29.036367050192563,
          "offer": 257.9539739206304,
        },
        "2021-10-04T02:00:00.000Z": Object {
          "bid": 46.19231293089045,
          "offer": 260.2423770342576,
        },
        "2021-10-04T02:30:00.000Z": Object {
          "bid": 44.09431369388996,
          "offer": 264.2484329996642,
        },
        "2021-10-04T03:00:00.000Z": Object {
          "bid": 95.96610583167606,
          "offer": 264.13517476500454,
        },
        "2021-10-04T03:30:00.000Z": Object {
          "bid": 116.70086491901998,
          "offer": 255.24430385656098,
        },
        "2021-10-04T04:00:00.000Z": Object {
          "bid": 96.0330412096682,
          "offer": 248.129673757578,
        },
        "2021-10-04T04:30:00.000Z": Object {
          "bid": 94.85075116590706,
          "offer": 256.7926811196175,
        },
        "2021-10-04T05:00:00.000Z": Object {
          "bid": 64.423109507302,
          "offer": 233.97646040726195,
        },
        "2021-10-04T05:30:00.000Z": Object {
          "bid": 81.3670398201475,
          "offer": 236.99416296705863,
        },
        "2021-10-04T06:00:00.000Z": Object {
          "bid": 80.5663416089683,
          "offer": 238.63091432157185,
        },
        "2021-10-04T06:30:00.000Z": Object {
          "bid": 68.11238328101093,
          "offer": 236.62520910728247,
        },
        "2021-10-04T07:00:00.000Z": Object {
          "bid": 85.19993485430075,
          "offer": 226.82319092835183,
        },
        "2021-10-04T07:30:00.000Z": Object {
          "bid": 83.04123196718837,
          "offer": 228.4939912024734,
        },
        "2021-10-04T08:00:00.000Z": Object {
          "bid": 83.1642477938283,
          "offer": 221.1975996237682,
        },
        "2021-10-04T08:30:00.000Z": Object {
          "bid": 88.60716641610388,
          "offer": 225.3672271828594,
        },
        "2021-10-04T09:00:00.000Z": Object {
          "bid": 89.20133961538755,
          "offer": 227.5780457244321,
        },
        "2021-10-04T09:30:00.000Z": Object {
          "bid": 85.28987126347054,
          "offer": 221.46660212634313,
        },
        "2021-10-04T10:00:00.000Z": Object {
          "bid": 86.53090292615941,
          "offer": 220.64351916726412,
        },
        "2021-10-04T10:30:00.000Z": Object {
          "bid": 87.10774935548629,
          "offer": 226.60155980460723,
        },
        "2021-10-04T11:00:00.000Z": Object {
          "bid": 82.52974945320751,
          "offer": 220.9057239726395,
        },
        "2021-10-04T11:30:00.000Z": Object {
          "bid": 90.30819744286899,
          "offer": 227.91096708757934,
        },
        "2021-10-04T12:00:00.000Z": Object {
          "bid": 86.70286247329881,
          "offer": 221.43589314082297,
        },
        "2021-10-04T12:30:00.000Z": Object {
          "bid": 77.91396899208938,
          "offer": 224.8564215803532,
        },
        "2021-10-04T13:00:00.000Z": Object {
          "bid": 86.77968974518268,
          "offer": 231.21051753057887,
        },
        "2021-10-04T13:30:00.000Z": Object {
          "bid": 81.7857062801913,
          "offer": 231.27735883675132,
        },
        "2021-10-04T14:00:00.000Z": Object {
          "bid": 88.63075994049281,
          "offer": 236.24033632274353,
        },
        "2021-10-04T14:30:00.000Z": Object {
          "bid": 86.64588378497939,
          "offer": 239.04028336053682,
        },
        "2021-10-04T15:00:00.000Z": Object {
          "bid": 90.0953993753334,
          "offer": 254.36891895755264,
        },
        "2021-10-04T15:30:00.000Z": Object {
          "bid": 84.60467682454791,
          "offer": 254.3897685513176,
        },
        "2021-10-04T16:00:00.000Z": Object {
          "bid": 88.29121555906927,
          "offer": 249.741214710485,
        },
        "2021-10-04T16:30:00.000Z": Object {
          "bid": 83.14880191601294,
          "offer": 247.92382132061005,
        },
        "2021-10-04T17:00:00.000Z": Object {
          "bid": 74.17489554890614,
          "offer": 247.23928097592997,
        },
        "2021-10-04T17:30:00.000Z": Object {
          "bid": 87.08197558402533,
          "offer": 255.84557857752588,
        },
        "2021-10-04T18:00:00.000Z": Object {
          "bid": 91.53572444416288,
          "offer": 246.68840873473215,
        },
        "2021-10-04T18:30:00.000Z": Object {
          "bid": 87.55055522932287,
          "offer": 253.62568020786227,
        },
        "2021-10-04T19:00:00.000Z": Object {
          "bid": 90.8994810463015,
          "offer": 244.53100976463094,
        },
        "2021-10-04T19:30:00.000Z": Object {
          "bid": 84.10066549950315,
          "offer": 236.76253484459093,
        },
        "2021-10-04T20:00:00.000Z": Object {
          "bid": 100.54894162700252,
          "offer": 240.78305214918163,
        },
        "2021-10-04T20:30:00.000Z": Object {
          "bid": 88.3747663325541,
          "offer": 241.26901443976976,
        },
        "2021-10-04T21:00:00.000Z": Object {
          "bid": 93.00218851899717,
          "offer": 235.74613044192202,
        },
        "2021-10-04T21:30:00.000Z": Object {
          "bid": 99.31149247730573,
          "offer": 246.90984037570882,
        },
        "2021-10-04T22:00:00.000Z": Object {
          "bid": 92.52581815444135,
          "offer": 250.3526589130081,
        },
        "2021-10-04T22:30:00.000Z": Object {
          "bid": 80.9671328331463,
          "offer": 247.96305560406094,
        },
        "2021-10-04T23:00:00.000Z": Object {
          "bid": 82.58720849880497,
          "offer": 249.21229015998836,
        },
        "2021-10-04T23:30:00.000Z": Object {
          "bid": 66.61953936320027,
          "offer": 257.3371956959406,
        },
        "2021-10-05T00:00:00.000Z": Object {
          "bid": 56.50662840941586,
          "offer": 257.36001016658247,
        },
      }
    `);
    });
  });
});