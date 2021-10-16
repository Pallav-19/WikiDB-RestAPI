const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const Article = mongoose.model("Article", articleSchema);
// Getting all the Articles
app
  .route("/articles")

  .get((req, res) => {
    Article.find({}, (err, foundArticles) => {
      if (!err) {
        res.send(foundArticles);
      }
    });
  })

  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save((err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully added a new article");
      }
    });
  })

  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Deleted articles");
      } else {
        res.send(err);
      }
    });
  });
//  Getting Particular Articles
app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("Article not found");
      }
    });
  })
  .put((req, res) => {
    Article.replaceOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },

      (err) => {
        if (!err) {
          res.send("Success updating");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch((req, res) => {
    Article.updateOne(
      {
        title: req.params.articleTitle,
      },
      { $set: req.body },
      (err) => {
        if (!err) {
          res.send("successfully updated field in a particular article ");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne(
      {
        title: req.params.articleTitle,
      },
      (err) => {
        if (!err) {
          res.send("successfully deleted a item");
        } else {
          res.send(err);
        }
      }
    );
  });

app.listen(3000, () => {
  console.log("server started at 3000");
});
