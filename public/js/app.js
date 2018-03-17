//$.getJSON("/articles", function(data) {
//   // For each one
//   for (var i = 0; i < data.length; i++) {
//     // Display the apropos information on the page
//     $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//   }
// });

// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        // With that done, add the note information to the page
        .then(function(data) {
            console.log(data);
            // The title of the article
            $("#notes").append("<h2>" + data.title + "</h2>");
            // An input to enter a new title
            $("#notes").append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

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
$(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
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

$(document).on("click", "#scraper", function() {
            // Run a POST request to change the note, using what's entered in the inputs
            $.ajax({
                    method: "GET",
                    url: "/scrape",
                })
                .then(function(data) {
                    location.reload()

                })

})

            function handleArticleSave() {
                // This function is triggered when the user wants to save an article
                // When we rendered the article initially, we attatched a javascript object containing the headline id
                // to the element using the .data method. Here we retrieve that.
                var thisId = $(this).attr("data-id");
                var articleToSave = $(this).headline.data();
                articleToSave.saved = true;
                // Using a patch method to be semantic since this is an update to an existing record in our collection
                $.ajax({
                    method: "POST",
                    url: "/saved" + thisId,
                    data: articleToSave
                }).then(function(data) {
                    // If successful, mongoose will send back an object containing a key of "ok" with the value of 1
                    // (which casts to 'true')
                    if (data.ok) {
                        // Run the initPage function again. This will reload the entire list of articles
                        console.log("ok")
                    }
                });
            }

            $(document).on("click", "#save", function() {
                // Run a POST request to change the note, using what's entered in the inputs
                $.ajax({
                        method: "GET",
                        url: "/saved",
                    })
                    .then(function(data) {
                        handleArticleSave()

                    })
            });