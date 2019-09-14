import User from './db';

export const resolvers = {
  Query: {
    async getUser(root, {
      id
    }) {
      const userDoc = await User.findById(id);
      return userDoc;
    }
  },
  Mutation: {
    async createUser(root, {
      input
    }) {
      const savedUser = await new User(input).save();
      return savedUser;
    },
    async updateUser(root, {
      input
    }) {
      await User.update({
        _id: input.id
      }, input, {
        new: true
      });
      return 'Updated Successfully';
    },
    async deleteUser(root, {
      id
    }) {
      await User.remove({
        _id: id
      });
      return 'Deleted Successfully'
    }
  }
}