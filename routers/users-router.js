const express = require("express");
const Users = require("../data/helpers/userDb");
const router = express.Router();

function upperCase(req, res, next) {
  if (!req.body.name) {
    res.status(400).json({ message: "Can't find a name" });
  } else {
    req.body.name = req.body.name.toUpperCase();
  }
  next();
}

router.get("/", (req, res) => {
  Users.get()
    .then(user => res.status(200).json(user))
    .catch(() => res.status(500).json({ message: "Error fetching users." }));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Users.getById(id)
    .then(user => {
      if (!user) {
        res
          .status(404)
          .json({ message: "Can't find the user, ID doesn't match." });
      } else {
        res.status(200).json({ user });
      }
    })
    .catch(() =>
      res.status(500).json({ message: "There was an error fetching the ID" })
    );
});

router.get("/:id/posts", (req, res) => {
  const { id } = req.params;
  Users.getUserPosts(id)
    .then(posts => {
      if (posts.length === 0) {
        res.status(404).json({ message: "This ID has no posts to show" });
      } else {
        res.status(200).json(posts);
      }
    })
    .catch(() =>
      res.status(500).json({
        message: "There was an error getting the posts for that user."
      })
    );
});

router.post("/", upperCase, (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ message: "Please enter a name" });
  } else {
    Users.insert({ name })
      .then(user => {
        res.status(201).json(user);
      })
      .catch(() =>
        res
          .status(500)
          .json({ message: "There was an error adding a new user" })
      );
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Users.removeAllPosts(id)
    .then(() => {
      Users.remove(id).then(user => {
        if (!user) {
          res.status(404).json({ message: "Can't find the user with that ID" });
        } else {
          res
            .status(200)
            .json({ message: "The user was successfully deleted." });
        }
      });
    })
    .catch(() =>
      res.status(500).json({ message: "There was an error deleting the user." })
    );
});

router.put("/:id", upperCase, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ message: "Please enter a name" });
  } else {
    Users.update(id, { name })
      .then(user => {
        if (!user) {
          res.status(404).json({ message: "There is no user with that ID" });
        } else {
          res.status(200).json(user);
        }
      })
      .catch(() =>
        res
          .status(500)
          .json({ message: "There was an error updating the user." })
      );
  }
});
module.exports = router;
