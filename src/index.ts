import NodeCache from 'node-cache';
import { createServer, IncomingMessage, ServerResponse } from "http";
import { Sequelize } from 'sequelize';

import { database } from './database';

const MAX_CACHE = 0.1; // 100ms
const CHECK_PERIOD = 0.2;

const databaseCache = new NodeCache({
  stdTTL: MAX_CACHE,
  checkperiod: CHECK_PERIOD
});

async function run(request: IncomingMessage, response: ServerResponse) {
  const query = 'SELECT email as repeatedTimes, COUNT(email) FROM ENTRY GROUP BY email';
  const Entry = await database();

  if (databaseCache.has(query)) {
    const dbGet = databaseCache.get(query);
    response.end(JSON.stringify(dbGet));

    return;
  }

  const entry = await Entry.findAll({
    group: ['email'],
    attributes: ['email', [Sequelize.fn('COUNT', 'email'), 'repeatedTimes']],
  });

  const success = databaseCache.set(query, entry, MAX_CACHE);

  if (success) {
    response.writeHead(200, 'Success');
    response.end(JSON.stringify(entry));

    return;
  }

  response.writeHead(500, 'Operation failed');
  response.end();
}

createServer(run).listen(3333, () => console.log('Server running on port 3333'));