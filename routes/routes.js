//routes.js serves as our controller/router
//we combined API and HTML routes in one file as 

// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var handlebars = require("handlebars");
var path = require("path");
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");
var router = express.Router();
var articles = require("../models/index.js");
// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Routes
// =============================================================
module.exports = function(app) {


        //Display scraped articles on index// Routes
        // ========("/=====================================================




        // A GET route for scraping the swift website
        app.get("/scrape", function(req, res) {
            // First, we grab the body of the html with request
            axios.get("http://www.skift.com/rooms/hotels/")
                .then(function(response) {

                    // Then, we load that into cheerio and save it to $ for a shorthand selector
                    var $ = cheerio.load(response.data);


                    var collectedArticlesCounter = 0;
                    var retreivedArticles = $(".story").length
                    // Now, we grab every story within an article tag, and do the following:
                    $(".story").each(function(i, element) {

                        // Save an empty result object
                        var result = {};

                        //Add the text and href of every link, and save them as properties of the result object
                        result.link = $(this)
                            .children("a")
                            .attr("href");

                        result.headline = $(this)
                            .children("a")
                            .children(".story-thumb-container")
                            .children(".headline")
                            .children("h2")
                            .text();

                        result.summary = $(this)
                            .children("a")
                            .children(".story-thumb-container")
                            .children(".headline")
                            .children("p")
                            .text();

                        //check to see if there is content in the link, headline and summary fields, go to the next one
                        if (result.link.length === 0 || result.headline.length === 0 || result.summary.length === 0) {
                            return;
                        }

                        db.Article.remove({})
                            .then(function(response) {

                                // Create a new Article using the `result` object built from scraping
                                db.Article.create(result)
                                    .then(function(dbArticle) {
                                        // View the added result in the console
                                        console.log(dbArticle);
                                        collectedArticlesCounter++;

                                        if (retreivedArticles === collectedArticlesCounter) {
                                            res.redirect("/articles")
                                        }

                                    })
                                    .catch(function(err) {
                                        // If an error occurred, send it to the client
                                        console.log(err);
                                        return res.json(err);

                                    });

                            })



                    });

                })

                .catch(function(error) {
                    console.log(error);
                })
        })


        // Route for getting all Articles from the db
        app.get("/articles", function(req, res) {
            // Grab every document in the Articles collection
            db.Article.find({})
                .then(function(dbArticles) {
                    // If we were able to successfully find Articles, send them back to the client
                    console.log(dbArticles);
                    return res.render("index", { dbArticles });
                })
                .catch(function(err) {
                    // If an error occurred, send it to the client
                    res.json(err);
                });
        });
        // Route for changing status of an article to saved
        app.post("/saved", function(req, res) {

            // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
            db.Article.findByIdAndUpdate(req.body._id, { $set: { "saved": true } }, { new: true })

                .then(function(dbArticle) {
                    // If we were able to successfully find an Article with the given id, send it back to the client
                    console.log(dbArticle)
                    res.json(dbArticle);
                })
                .catch(function(err) {
                    // If an error occurred, send it to the client
                    res.json(err);
                });
        });


        // Route for getting all saved Articles from the db
        app.get("/saved", function(req, res) {
            // Grab every document in the Articles collection with save set to true
            db.Article.find({ saved: true })
                .then(function(dbArticles) {
                    console.log(dbArticles)
                    // If we were able to successfully find Articles, send them back to the client
                    return res.render("saved", { dbArticles });
                })
                .catch(function(err) {
                    // If an error occurred, send it to the client
                    res.json(err);
                });
        });
        // // Route for grabbing a specific Article by id, populate it with it's note
        app.get("/saved/:id", function(req, res) {
            // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
            db.Article.findOne({ _id: params.req })
                // ..and populate all of the notes associated with it
                .populate("note")
                .then(function(dbArticle) {
                    // If we were able to successfully find an Article with the given id, send it back to the client
                    res.json(dbArticle);
                })
                .catch(function(err) {
                    // If an error occurred, send it to the client
                    res.json(err);
                });
        });

        //Route for saving/updating an Article's associated Note
        app.post("/saved/:id", function(req, res) {
            // Create a new note and pass the req.body to the entry
            db.Note.create(req.body)
                .then(function(dbNote) {
                    // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                    // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                    // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                    return db.Note.findOneAndUpdate({ _id: params.req }, { note: dbNote._id }, { new: true });
                })
                .then(function(dbNote) {
                    // If we were able to successfully update an Article, send it back to the client
                    res.json(dbNote);
                })
                .catch(function(err) {
                    // If an error occurred, send it to the client
                    res.json(err);
                });
        });

        app.get("/", function(req, res) {
            res.redirect("/articles")
        });

        // Route for grabbing a specific Article by id, populate it with it's note
        app.get("/saved/:id", function(req, res) {
            // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
            db.Note.findOne({ _id: req.body._id })
                // ..and populate all of the notes associated with it
                .populate("note")
                .then(function(dbNote) {
                    // If we were able to successfully find an Article with the given id, send it back to the client
                    res.json(dbNote);
                })
                .catch(function(err) {
                    // If an error occurred, send it to the client
                    res.json(err);
                });
        });

}