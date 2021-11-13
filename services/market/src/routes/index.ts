import process from 'process';
import {Router as router} from 'express';

const route = router();

route.put('/settlement-period', async (request, response) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Settlement period submitted', request.body);
  }

  // 80% chance of success
  response.send({success: Math.random() * 100 > 20});
});

export default route;
