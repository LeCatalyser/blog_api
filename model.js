const uuid = require("uuid"); //mongo
const mongoose = require("mongoose");

// [front-end (chrome, jQuery)] <-- blogposts.js --> [back-end (node, express)] <-- model.js --> [database(mongo)]

const blogPostSchema = mongoose.Schema({
  author: {
    firstName: String,
    lastName: String
  },
  title: { type: String, required: true },
  content: { type: String },
  created: { type: Date, default: Date.now }
});
blogPostSchema.virtual("authorName").get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.apiRepr = function() {
  return {
    title: this.title,
    content: this.content,
    author: this.authorName,
    created: this.created,
    id: this._id
  };
};

const BlogPosts = mongoose.model("blogPosts", blogPostSchema);
module.exports = { BlogPosts };
