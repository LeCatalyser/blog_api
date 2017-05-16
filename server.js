const express = require("express");
const morgan	= require("morgan");
const blogposts = require("./blogposts");
const bodyParser = require('body-parser');

const app = express();

app.use(morgan("dev"));
app.use("/blog-posts", blogposts);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
