const { User, user } = require('../models')

module.exports = {
    //Get all users
    getUser(req, res) {
        User.find({ })
        .then((user) =>
            res.json(user))
        .catch((err) =>
            res.status(500).json(err))
    },

    //Get single user
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
        .populate('thoughts')
        .populate('freinds')
        .selete('-__v')
        .then((user) =>
        !user
            ? res.status(404).json({ message: "No user found with this ID"})
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },

    //Create a user
    createUser(req, res) {
        User.create( req.body )
        .then((user) =>  res.json(user))
        .catch((err) =>  {
            console.log(err)
            return res.status(500).json(err)
        });
    },

    //Update a user
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, New: true }
        )
        .then((user) =>
        !user
            ? res.status(404).json({ message: "No user found with this ID"})
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },

    //Delete a user
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
          .then((user) =>
            !user
              ? res.status(404).json({ message: "No user find with this ID!" })
              : Thought.deleteMany(
                  { _id: { $in: user.thought }}
                )
          )
          .then(() =>
            res.json({ message: 'User and thought deleted'}))
          .catch((err) => res.status(500).json(err));
      },

    //Add friend
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, New: true }
        )
        .then((user) =>
        !user
            ? res.status(404).json({ message: "No user found with this ID"})
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    
    //Delete friend
    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, New: true }
        )
        .then((user) =>
        !user
            ? res.status(404).json({ message: "No user found with this ID"})
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
}