const uuid = require('uuid');

function StorageException(message) {
	this.message = message;
	this.name ="StorageException";
}

const blogPosts ={
	create: function(title, content, author, publishDate) {
		const post =  {
			id: uuid.v4(),
			title: title,
			content: content,
			author: author,
			publishDate: publishDate || Date.now()
		};
		
		this. posts. push(post);
		return post;
	},
	get: function(id=null) {
		if (id !== null) {
			return this. posts.find(post => post.id === id);
		}
		return this.posts.sort(function(a,b){
		return b.publishDate - a.publishDate
	});
},
delete: function(id) {
	const postIndex= this.posts.findIndex(
		post => post.id ===id);
	if (postIndex > -1) {
		this.posts.splice(postIndex, 1);
	}
},

update: function(updatePost) {
	const {id} = updatePost;
	const postIndex = this.posts.findIndex(
		post => post.id === updatePost.id);
	if (postIndex === -1) {
		throw StorageException (
			`Can't update item \`${id}\` because doesn't exist.`)
	}
	this. post[postIndex] = Object.assign(
		this.posts[postIndex], updatePost);
	return this.posts[postIndex];
	}
};

function createBlogPostModel() {
	const storage = Object.create(blogPosts);
	storage.posts =[];
	return storage ;
}

module.exports = {blogposts : createBlogPostModel()};