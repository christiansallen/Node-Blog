const express = require("express");
const Posts = require("../data/helpers/postDb");
const router = express.Router();

router.get("/", (req, res) => {
  Posts.get()
    .then(post => res.status(200).json(post))
    .catch(() => res.status(500).json({ message: "Couldn't fetch the posts" }));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Posts.getById(id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "The message with the specified ID was not found."
        });
      }
    })
    .catch(() => res.status(500).json({ message: "Error connecting to post" }));
});

router.post("/", (req, res) => {
  const { user_id, text } = req.body;
  if (!user_id || !text) {
    res.status(404).json({ message: "Please insert title and content" });
  }
  Posts.insert({ user_id, text })
    .then(post => res.status(201).json(post))
    .catch(() =>
      res.status(500).json({ message: "There was an error adding your post." })
    );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Posts.remove(id)
    .then(post => {
      if (!post) {
        res
          .status(404)
          .json({ message: "Cannot delete a message that doesn't exist..." });
      } else {
        res.status(200).json({ message: "The post was successfully deleted." });
      }
    })
    .catch(() =>
      res
        .status(500)
        .json({ message: "There was an error deleting your post." })
    );
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { user_id, text } = req.body;

  Posts.update(id, { user_id, text })
    .then(post => {
      if (!user_id || !text) {
        res.status(400).json({ message: "Please enter a user_id and text." });
      } else if (!post) {
        res
          .status(404)
          .json({ message: "Can't edit a post that doesn't exist." });
      } else {
        res.status(200).json(post);
      }
    })
    .catch(() =>
      res
        .status(500)
        .json({ message: "There was an error updating your post." })
    );
});

module.exports = router;
