import { User } from './db';
import { client } from '../index';
import bcrypt from 'bcrypt'

export const resolvers = {
  Query: {
    async getUser(root, {id}, context, info) {
      const userDoc = await User.findById(id);
      return userDoc;
    }
  },
  Mutation: {
    async createUser(root, { input }, context, { connection }) {
      try {
        const saltRounds = 10;
        input.password = bcrypt.hashSync(input.password, saltRounds);
        const userExists = await User.findOne({ email: input.email });
        if (userExists) throw new Error('User with email exists');
        const savedUser = new User(input)
        savedUser.id = savedUser._id;
        await savedUser.save();
        return savedUser;
      } catch (ex) {
        throw new Error(ex);
      }
    },

    async updateUser(root, { input }) {
      await User.update(
        { _id: input.id }, 
        input, 
        { new: true }
      );
      return 'Updated Successfully';
    },

    async deleteUser(root, { id }) {
      await User.remove({ _id: id });
      return 'Deleted Successfully'
    },
    
    async loginUser(root, {input}, { connection }, info) {
      const ipAddress = connection.remoteAddress;
      const result = await client.getAsync(ipAddress);
      const waitTime = await client.ttlAsync(ipAddress);
      const cycleExists = await client.ttlAsync(`ttc:${ipAddress}`);
      if (result !== true && Number(result)) {
        // return error if waitTime exists
        if (waitTime > 0) {
          throw new Error(`You cannot sign in until after ${waitTime} seconds`);
        }
        // return user if authenticated
        const isAuth = await User.verify(input.username, input.password);
        if (isAuth) {
          client.set(ipAddress, 0);
          client.set(`ttc:${ipAddress}`, 0);
          return isAuth
        };
        // add expiry to ipAddress if trial === 3 and return error
        if (result == 3) {
          client.expire(ipAddress, 1200);
          throw new Error(`Invalid Credentials; Try again after ${await client.ttlAsync(ipAddress)}`);
        }
        // increment cycle if cycle has started
        if(cycleExists > 0) {
          client.incr(ipAddress);
        } else {
          // set ipAddress count to 0
          client.set(ipAddress, 0);
        }
        throw new Error(`Invalid Credentiails. Attempts would be stopped temporarily after ${3 - result} trials`);
      }
      // return user if authenticated
      const isAuth = await User.verify(input.username, input.password);
      if (isAuth) {
        client.set(ipAddress, 0);
        client.set(`ttc:${ipAddress}`, 0);
        return isAuth
      };
      client.set(`ttc:${ipAddress}`, 1); //time to live
      client.expire(`ttc:${ipAddress}`, 60);
      client.set(ipAddress, 1);
      throw new Error('Invalid Credentials');
    }
  }
}
