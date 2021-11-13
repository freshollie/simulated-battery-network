import {isValid} from 'date-fns';
import {Router as router} from 'express';
import * as battery from '../devices/battery';

const route = router();

route.get('/soc', async (_, response) => {
  response.send({socMwh: await battery.getSoc()});
});

route.post('/charge', async (request, response) => {
  const volumeMwh = request.body.volumeMwh as number;
  const time = (request.body.time as string | undefined)
    ? new Date(request.body.time)
    : undefined;

  if (Number.isNaN(volumeMwh) || (time !== undefined && !isValid(time))) {
    return response.sendStatus(400);
  }

  await battery.charge(volumeMwh, time);

  return response.send({success: true});
});

route.post('/discharge', async (request, response) => {
  const volumeMwh = request.body.volumeMwh as number;
  const time = (request.body.time as string | undefined)
    ? new Date(request.body.time)
    : undefined;

  if (Number.isNaN(volumeMwh) || (time !== undefined && !isValid(time))) {
    return response.sendStatus(400);
  }

  await battery.discharge(volumeMwh, time);

  return response.send({success: true});
});

route.get('/throughput', async (request, response) => {
  const from = new Date(request.query.from as string);
  const to = new Date(request.query.to as string);

  if (!isValid(from) || !isValid(to)) {
    return response.sendStatus(400);
  }

  return response.send(await battery.getThroughputBetween(from, to));
});

export default route;
