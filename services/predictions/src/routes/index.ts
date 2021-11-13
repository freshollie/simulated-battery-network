import {isValid} from 'date-fns';
import {Router as router} from 'express';
import {getPredictions} from '../data';

const route = router();

route.get('/', async (request, response) => {
  const at = request.query.at;
  if (typeof at !== 'string') {
    return response.sendStatus(400);
  }

  const atDate = new Date(at);
  if (!isValid(atDate)) {
    return response.sendStatus(400);
  }

  const predictions = await getPredictions(atDate);

  if (!predictions) {
    return response.sendStatus(404);
  }

  return response.send(predictions);
});

export default route;
