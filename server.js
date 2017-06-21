const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require("./config.js");
const { BlogPosts } = require("./model");

const app = express();

app.use(morgan("dev"));
//app.use(morgan "common"));
app.use(bodyParser.json());

app.get("/blog-posts", (req, res) => {
  BlogPosts.find()
    .exec()
    .then(posts => {
      res.json(posts.map(post => post.apiRepr()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went terribly wrong" });
    });
});

app.get("/blog-posts", (req, res) => {
  BlogPosts.findById(req.params.id)
    .exec()
    .then(post => res.json(post.map(post => post.apiRepr())))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went terribly wrong" });
    });
});

app.post("/blog-posts", (req, res) => {
  const requiredFields = ["title", "content", "author"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  BlogPosts.create({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  })
    .then(BlogPost => res.status(201).json(BlogPost.apiRepr()))
    //mongoose convention to provide the data sutable for an api
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
});

app.delete("/blog-posts/:id", (req, res) => {
  //two deletes?
  BlogPost.findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
      res.status(204).json({ message: "success" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went terribly wrong" });
    });
});

app.put("/blog-posts/:id", (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: "Request path id and request body id values must match"
    });
  }

  const updated = {};
  const updateableFields = ["title", "content", "author"];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  BlogPost.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .exec()
    .then(updatedPost => res.status(201).json(updatedPost.apiRepr()))
    .catch(err => res.status(500).json({ message: "Something went wrong" }));
});

app.delete("/blog-posts/:id", (req, res) => {
  BlogPosts.findByIdAndRemove(req.params.id).exec().then(() => {
    console.log(`Deleted blog post with id \`${req.params.ID}\``);
    res.status(204).end();
  });
});

app.use("*", function(req, res) {
  res.status(404).json({ message: "Not Found" });
});

let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on("error", err => {
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };

//app.listen(process.env.PORT || 8080, () => {
// console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
//});
