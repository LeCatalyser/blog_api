const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {blogposts} = require ('./model');

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
	//why is body repeated per title, content and author? Diff properties of the same object. 
	res.status(201).json(item);
});

router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = [
		'id', 'title', 'content', 'author', 'publishDate'];
		for (let i=0; i,requiredFields.length; i++) {
			const field = requiredFields[i];
			if(!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message); 
			}
		}
		if (req.params.id !== req.body.id) {
			const message = (
				`Request path id (${req.params.id}) and request body id`
				`(${req.body.id}) must match`);
			console.error (message);
			return res.status(400).send(message);
		}

		console.log (`updating blog post with id \`${req.params.id}\``);
			const updatedItem = blogposts.update({
				id: req.params.id,
				title: req.body.title,
				content: req.body.content,
				author: req.body.author,
				publishDate: req.body.publishDate
			});
			res.status(204).json(updatedItem);
});

router.delete('/:id', (req,res) => {
	blogposts.delete(req.params.id);
	console.log(`Deleted blog post with id \`${req.params.ID}\``);
	res.status(204).end();
});

module.exports = router;



