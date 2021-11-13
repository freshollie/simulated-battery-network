// Just used to visualise data on a graph
const fs = require('fs');
const path = require('path');

const data = fs
  .readFileSync(path.join(__dirname, '/output.log'))
  .toString()
  .split('\n')
  .filter(Boolean)
  .map((row) => JSON.parse(row));

fs.writeFileSync(
  path.join(__dirname, '/graph.csv'),
  data
    .map(
      (row) =>
        `${row.currentSoc},${row.bid.price > 0 ? row.bid.price : ''}, ${
          row.offer.price < 999 ? row.offer.price : ''
        },${row.time}`,
    )
    .join('\n'),
);
