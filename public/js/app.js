// Dependencies
//var mongoose = require("mongoose");
$("body").on("click", "#home", function() {
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "GET",
            url: "/",
        })
        .then(function(data) {
            location.href = "/articles";

        })

})

$("body").on("click", "#scraper", function() {
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "GET",
            url: "/scrape",
        })
        .then(function(data) {
            location.reload()

        })

})



$("body").on("click", "#save", function() {
    console.log($(this).attr("data_id"))
    let toBeSaved = $(this).attr("data_id");


    $.post("/saved", { _id: toBeSaved }).then(saved => {
        console.log(saved);
    })


});



$("body").on("click", "#savedArticles", function() {
    $.ajax({
            method: "GET",
            url: "/saved"
        })
        .then(function(data) {
            location.href = "/saved";
        })
})


   

// Whenever someone clicks the add Note button
$(".articles").on("click", "#addNote", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  let toBeSaved = $(this).attr("data_id");

  // Now make an ajax call for the Article
  $.get("/saved/", { _id: toBeSaved })
    .then(saved => {
        console.log("should be id")
        console.log(toBeSaved);
  })
    // With that done, add the note information to the page
    .then(function(toBeSaved) {
      //console.log(saved);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data_id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(".articles").on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data_id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/saved/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});