import app from './app';

const server = app.listen(5000, () => {
  console.log('Market running on port 5000');
});
export default server;
