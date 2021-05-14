const mongoose = require("mongoose");

const postShema = new mongoose.Schema({
  title: {
    type: String,
    require: [true, "Post must have title"],
  },
  body: {
    type: String,
    require: [true, "post must have body"],
  },
});

const Post = mongoose.model("Post", postShema);

module.exports = Post;
