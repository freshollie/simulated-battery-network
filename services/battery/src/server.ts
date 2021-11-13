import app from './app';

const server = app.listen(4000, () => {
  console.log('Battery running on port 4000');
});
export default server;
