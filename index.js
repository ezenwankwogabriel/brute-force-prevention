import express from 'express';
import graphqlHTTP from 'express-graphql';
import { schema } from './schema';

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