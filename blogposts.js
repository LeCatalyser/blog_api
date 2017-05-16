const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
  res.json(blogposts.get());
  console.log("I did a post");
});

module.exports = router;

(req.body.name