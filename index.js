import express from 'express';
import graphqlHTTP from 'express-graphql';
import { schema } from './data/schema';
const Promise = require('bluebird');

import redis from 'redis';

export const client = Promise.promisifyAll(redis.createClient());

client.on('error', function(err){
  console.log('Something went wrong ', err)
});

// client.set('my test key', 'my test value', redis.print);
// client.get('my test key', function(error, result) {
//   if (error) throw error;
//   console.log('GET result ->', result)
// });

const app = express();

const PORT = 3030 || process.env.PORT;
console.log(process.env.PORT, 'hello')

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}));

app.use('/', (req, res) => {
  return res.send('hello gabby my guy')
});

app.listen(PORT, (err) => {
  if (err) throw new Error(err);
  return console.log('server listening on ' + PORT)
});