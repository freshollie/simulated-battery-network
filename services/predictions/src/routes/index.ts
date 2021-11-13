import {isValid} from 'date-fns';
import {Router as router} from 'express';
import {getPredictions} from '../data';

const route = router();

route.get('/prices', async (request, response) => {
  const from = request.query.from;
  if (typeof from !== 'string') {
    return response.sendStatus(400);
  }

  const fromDate = new Date(from);
  if (!isValid(fromDate)) {
    return response.sendStatus(400);
  }

  const predictions = await getPredictions(fromDate);

  if (!predictions) {
    return response.sendStatus(404);
  }

  return response.send(predictions);
});

export default route;
