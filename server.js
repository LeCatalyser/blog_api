const express = require("express");
const morgan = require("morgan");
const blogposts = require("./blogposts");
const bodyParser = require("body-parser");

const app = express();

app.use(morgan("dev"));
app.use("/blog-posts", blogposts);

let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app
      .listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve(server);
      })
      .on("error", err => {
        reject(err);
      });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log("Closing server");
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
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
