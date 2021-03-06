import { resolvers } from './resolvers';
import { makeExecutableSchema } from 'graphql-tools';
import { client } from '../index'

const typeDefs = `
  type User {
    id: ID
    firstName: String
    lastName: String
    gender: Gender
    password: String
    age: Int
    language: String
    email: String
    contacts: [Contact]
  }
  type Contact {
    name: String
    phone: Int
  }
  enum Gender {
    MALE
    FEMALE
    OTHER
  }
  type Query {
    getUser(id: ID): User
  }
  input userInput {
    id: ID
    firstName: String
    lastName: String
    age: Int
    language: String
    password: String  
    email: String
  }
  input loginInput {
    username: String
    password: String
  }
  type Mutation {
    createUser(input: userInput): User
    updateUser(id: ID): String
    deleteUser(id: ID): String
    loginUser(input: loginInput): User
  }
`;

const schema = makeExecutableSchema( {typeDefs, resolvers} );

export { schema };

