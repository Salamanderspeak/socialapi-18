const { ObjectId } = require("mongoose").Types;
const { User, Thought } = require("../models");

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then(async (users) => {
        const userObj = {
          users,
        };
        return res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ userId: req.params._id })
      .select("-__v")
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json({
              user,
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  updateUser(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body }, { runValidators: true, new: true })
      .then((user) => (!user ? res.status(404).json({ message: "no user found" }) : res.json(user)))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Delete a student and remove them from the course
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) => (!user ? res.status(404).json({ message: "No such user exists" }) : Thought.findOneAndUpdate({ users: req.params.id }, { $pull: { users: req.params.id } }, { new: true })))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      })
      .then((thought) => (!thought ? res.status(404).json({ message: "User deleted, but no thoughts found" }) : res.json({ message: "User successfully deleted" })))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Add an assignment to a student
  createFriend(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { new: true })
      .then((user) => (!user ? res.status(404).json({ message: "No user found with that ID :(" }) : res.json(user)))
      .catch((err) => res.status(500).json(err));
  },
  // Remove assignment from a student
  removeFriend(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { runValidators: true, new: true })
      .then((user) => (!user ? res.status(404).json({ message: "No user found with that ID :(" }) : res.json(user)))
      .catch((err) => res.status(500).json(err));
  },
};
