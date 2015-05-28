// create a namespace for this app if it doesn't exist.
var MovieApp = MovieApp || {};

MovieApp.Movielist = (function(){
  // declare variables for DOM elements, mostly they are assigned in the 
  // initialiaze function
  var $movieListElement, $getMoviesButton, $currentMovieElement,
  moviesURL = 'http://localhost:3000/movies'; // TODO: fix hard-coded URL

  // render all movies
  function _render(movies){
    $movieListElement.html('');
    movies.forEach(function(movie_data){
      var movie = new MovieApp.Movie(movie_data.id, movie_data.name, movie_data.desc,
      movie_data.rating, movie_data.length);
      $movieListElement.append(movie.renderName());
    });
  };

  // get all movies from the backend and render
  function _getMoviesHandler(event){
    $.ajax({
      url: moviesURL,
      dataType: 'json'
    })
    .done(function(movies){
      _render(movies);
    })
    .fail(function(){
      var errorMsg = 'Error: Accessing Movies from the URL' + moviesURL;
      alert(errorMsg);
      console.log(errorMsg);
    });
  };

  // get one movie from the backend and render in page.
  function _getMovieHandler(event){
    // get the list element that was selected, 
    // this event was bubbled up from the <li> for the movie
    // to the <ul> for the movie list
    var movieID = event.target.id;  // target is element that received the click
    // form the URL to get info for a specific movie
    var movieURL = 'http://localhost:3000/movies/' + movieID;

    // Send and Ajax GET request
    $.ajax({
      url: movieURL,
      dataType: 'json'
    })
    .done(function(movie_data){
      var movie = new MovieApp.Movie(movie_data.id, movie_data.name, movie_data.desc,
      movie_data.rating, movie_data.length);

      $currentMovieElement.html(movie.render());
    })
    .fail(function(){
      var errorMsg = 'Error: Getting Movie data, Accessing the URL' + movieURL;
      alert(errorMsg);
      console.log(errorMsg);
    }); // end of $.ajax
  };

  // Initializes DOM Elements and Event Handlers.
  // Only public method
  function initialize(moviesID, getMoviesButtonID, currentMovieID){
    // div to render a selected movie
    $currentMovieElement = $(currentMovieID);

    // ul for list of movies
    $movieListElement = $(moviesID);

    // button to refresh list of movies
    $getMoviesButton = $(getMoviesButtonID);

    // setup click handler to get ALL the the movies
    $getMoviesButton.on('click', _getMoviesHandler);

    // setup click handler to render ONE movie
    $movieListElement.on('click', _getMovieHandler);
  };

  return {
    init: initialize
  };
})();