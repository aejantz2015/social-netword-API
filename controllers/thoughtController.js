const { User, Thought } = require('../models');

module.exports = {
    // Get all thoughts
    getThoughts(req, res) {
        Thought.find({})
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },

    // Get single thought
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then((thought) => {
                if (!thought) {
                    return res.status(404).json({ message: "No thought found with this ID" });
                }
                res.json(thought);
            })
            .catch((err) => res.status(500).json(err));
    },

    // Create a thought and associate it with a user
    createThought(req, res) {
        Thought.create(req.body)
            .then((createdThought) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $push: { thoughts: createdThought._id } },
                    { new: true }
                );
            })
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },

    // Update a thought
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((thought) => {
                if (!thought) {
                    return res.status(404).json({ message: "No thought found with this ID" });
                }
                res.json(thought);
            })
            .catch((err) => res.status(500).json(err));
    },

    // Delete a thought
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((thought) => {
                if (!thought) {
                    return res.status(404).json({ message: "No thought found with this ID" });
                }
                return User.findOneAndUpdate(
                    { thoughts: req.params.thoughtId },
                    { $pull: { thoughts: req.params.thoughtId } },
                    { new: true }
                );
            })
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: 'Thought deleted, but no user found' });
                }
                res.json({ message: 'Thought successfully deleted' });
            })
            .catch((err) => res.status(500).json(err));
    },

    // Create a reaction
    createReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((thought) => {
                if (!thought) {
                    return res.status(404).json({ message: "No thought found with this ID" });
                }
                res.json(thought);
            })
            .catch((err) => res.status(500).json(err));
    },

    // Delete a reaction
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then((thought) => {
                if (!thought) {
                    return res.status(404).json({ message: "No thought found with this ID" });
                }
                res.json(thought);
            })
            .catch((err) => res.status(500).json(err));
    }
};