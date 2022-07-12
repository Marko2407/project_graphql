const User = require('../models/User');

const userResolvers = {
    Query: {
        getUser: async () => {
            const user = await User.find();
            return user;
          },
    },

    Mutation: {
        createUser: async (_parent, args, _context, _info) => {
            console.log(args)
            const { firstName, lastName, weight, height } = args;
            const user = new User({
              firstName: firstName,
              lastName: lastName,
              weight: weight,
              height: height
            });
            await user.save();
            return user;
          },
          deleteUser:async(_parent, args, _context, _info)=>{
            const { id } = args;
            await User.findByIdAndDelete(id);
            return true;
          },
          updateUser:async(_parent, args, _context, _info)=>{
            const { id } = args;
            const { firstName } = args;
            const {lastName } = args;
            const { weight } = args;
            const { height } = args;
            const updates = {};
            if (firstName !== undefined) {
              updates.firstName = firstName;
            }
            if (lastName !== undefined) {
              updates.lastName = lastName;
            }
            if (weight !== undefined) {
              updates.weight = weight;
            }
            if (height !== undefined) {
                updates.height = height;
              }
      
            const user = await User.findByIdAndUpdate(id, updates, {
              new: true,
            });
            return user;
        }
    },
};

module.exports = userResolvers;