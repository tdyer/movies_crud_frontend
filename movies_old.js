
$(document).ready(function(){
  'use strict';

  var $moviesList = $('#movies');

  // Get the movies from the movies.json file served from
  // the web server listening on port 3000.
  var moviesURL = 'http://localhost:3000/movies';

  $('#movies-button').on('click', function(event){
    $.ajax({
      url: moviesURL,
      dataType: 'json'
    })
      .done(function(movies){
        // clear the list of movies
        $moviesList.html('');

        movies.forEach(function(movie){
          $moviesList.append('<li id="' + movie.id + '" >'+ movie.name + '</li>');
        });
      })
      .fail(function(){
        var errorMsg = 'Error: Accessing the URL' + moviesURL;
        alert(errorMsg);
        console.log(errorMsg);
      });
  });

  // div to show info about a specific movie
  var $currentMovie = $('#current-movie');

  // Add a click handler to show one movie
  $moviesList.on('click', function(event){
    // get the list element that was selected
    var movieID = event.target.id;
    // form the URL to get info for a specific movie
    var movieURL = 'http://localhost:3000/movies/' + movieID;

    // Send and Ajax GET request
    $.ajax({
      url: movieURL,
      dataType: 'json'
    })
    .done(function(movie){
      var movieHTML = '<dl><dt>name</dt><dd>' + movie.name + '</dd>';
      movieHTML += '<dt>rating</dt><dd>' + movie.rating + '</dd>';
      movieHTML += '<dt>description</dt><dd>' + movie.desc + '</dd>';
      movieHTML+= '<dt>length</dt><dd>' + movie.length + '</dd></dl>';
      $currentMovie.html(movieHTML);
    })
    .fail(function(){
      var errorMsg = 'Error: Getting Movie data, Accessing the URL' + movieURL;
      alert(errorMsg);
      console.log(errorMsg);
    }); // end of $.ajax

  }); // end of click handler

  // lets get the form input fields only once.
  var $movieName = $('#movie-name');
  var $movieDesc = $('#movie-desc');
  var $movieLength = $('#movie-length');
  var $movieRating = $('#movie-rating');

  $('#create-movie').on('click', function(){
  
    var movieData = {movie: {
      name: $movieName.val(),
      desc: $movieDesc.val(),
      length: $movieLength.val(),
      rating: $movieRating.val()
    }};

    $.ajax({
      url: moviesURL,
      dataType: 'json',
      method: 'post',
      data: movieData
    })
    .done(function(movie){
      $moviesList.append('<li id="' + movie.id + '"> ' + movie.name + '</li>');
    })
    .fail(function(){
      var errorMsg = 'Error: Creating a movie';
      alert(errorMsg);
      console.log(errorMsg);
    }); // end fail
  }); // end create movie handler
 
}); // end of DOM ready