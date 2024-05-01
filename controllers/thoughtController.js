const { User, Thought } = require('../models')

module.exports = {
    //Get all thoughts
    getThought(req, res) {
        Thought.find({ })
        .then((thought) =>
            res.json(thought))
        .catch((err) =>
            res.status(500).json(err))
    },

    //Get single thought
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .select(("-__v"))
        .then((thought) =>
        !thought
            ? res.status(404).json({ message: "No thought found with this ID"})
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },

    //Create a thought and associate a thought with a user
    createThought(req, res) {
        Thought.create( req.body )
        .then(({ _id}) => {
    return User.findOneAndUpdate(
        { _id: req.body.userId},
        { $push: { thoughts: _id }},
        { new: true }
            )
        })
        .then((thought) =>
        !thought
            ? res.status(404).json({ message: "No thought found with this ID"})
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },

    //Update a thought
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, New: true }
        )
        .then((thought) =>
        !thought
            ? res.status(404).json({ message: "No thought found with this ID"})
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    }
}