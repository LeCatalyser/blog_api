const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {blogposts} = require ('/models');

blogposts.create(
	'how to not loose your mind as a coder', 'coding', 'Luisa S.');
blogposts.create(
	'10 ways to succeed as a coder', 'writting', 'Luisa S.');

router.get('/', (req, res) => {
  res.json(blogposts.get());
  console.log("I did a post");
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields [i]; 
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
	console.error(message);
	return res.status(400).send(message);
		}
}
	const item = blogposts.create(
		req.body.title, req.body.content, req.body.author);
	res.status(201).json(item);
});



