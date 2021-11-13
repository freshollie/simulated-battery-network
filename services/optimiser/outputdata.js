// Just used to visualise data on a graph
const fs = require('fs');

const data = fs
  .readFileSync(__dirname + '/output.log')
  .toString()
  .split('\n')
  .filter(Boolean)
  .map((row) => JSON.parse(row));

fs.writeFileSync(
  __dirname + '/graph.csv',
  data.map((row) => `${row.currentSoc},${row.time}`).join('\n'),
);
