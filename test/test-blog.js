const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");

const should = chai.should();

chai.use(chaiHttp);

describe("blog", function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it("should add an item on POST", function() {
    const newPost = {
      title: "try again",
      content: "how to persevere when discouraged",
      author: { firstName: "Luisa", lastName: "Salcedo" }
    };
    const expectedKeys = ["id", "created"].concat(Object.keys(newPost));

    return chai
      .request(app)
      .post("/blog-posts")
      .send(newPost)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.have.all.keys(expectedKeys);
        res.body.title.should.eql(newPost.title);
        res.body.content.should.eql(newPost.content);
        res.body.author.should.eql("Luisa Salcedo"); //fix line to check first and last name
      });
  });

  it("should error if POST missing expected values", function() {
    const badRequestData = {};
    return chai
      .request(app)
      .post("/blog-posts")
      .send(badRequestData)
      .catch(function(res) {
        res.should.have.status(400);
      });
  });

  it("should lit items on GET", function() {
    return chai.request(app).get("/blog-posts").then(function(res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a("array");

      res.body.length.should.be.above(0);
      res.body.forEach(function(item) {
        item.should.be.a("object");
        item.should.have.all.keys(
          "id",
          "title",
          "content",
          "author",
          "created"
        );
      });
    });
  });

  it("should update blog posts on PUT", function() {
    return chai.request(app).get("/blog-posts").then(function(res) {
      const updatedPost = Object.assign(res.body[0], {
        title: "you will eventually enjoy the process",
        content: "how to not quit in the next 90 days"
      });
      return chai
        .request(app)
        .put(`/blog-posts/${res.body[0].id}`)
        .send(updatedPost)
        .then(function(res) {
          res.should.have.status(201);
        });
    });
  });

  it("should delete posts on DELETE", function() {
    return chai.request(app).get("/blog-posts").then(function(res) {
      return chai
        .request(app)
        .delete(`/blog-posts/${res.body[0].id}`)
        .then(function(res) {
          res.should.have.status(204);
        });
    });
  });
});
