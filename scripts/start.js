const fs = require('fs');
const path = require('path');
const concurrently = require('concurrently');

const colors = ['blue', 'green', 'yellow', 'red'];

const workspaces = fs.readdirSync(path.join(__dirname, '../services'));
const workspacesData = workspaces
  .map((workspace) => {
    try {
      return JSON.parse(
        fs.readFileSync(
          path.join(__dirname, '../services', workspace, 'package.json'),
        ),
      );
    } catch {
      return undefined;
    }
  })
  .filter(Boolean);

const requiredWorkspaces = workspacesData.filter((workspace) =>
  Boolean(workspace.scripts && workspace.scripts.start),
);

concurrently(
  requiredWorkspaces.map((workspace, i) => ({
    command: `yarn workspace ${workspace.name} start`,
    name: workspace.name,
    prefixColor: colors[i],
  })),
);
