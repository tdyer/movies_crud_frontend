// create a namespace for this app if it doesn't exist.
var MovieApp = MovieApp || {};

MovieApp.Movielist = (function(){
  // declare variables for DOM elements, mostly they are assigned in the 
  // initialize function below
  var $movieListElement, $getMoviesButton,
  moviesURL = 'http://localhost:3000/movies'; // TODO: fix hard-coded URL

  // render all movies
  function _render(movies){
    // clear the list of movies
    $movieListElement.html('');

    // render each movie
    movies.forEach(function(movie_data){
      // create a movie object from the movie data returned from the 
      // backend API.
      var movie = new MovieApp.Movie(movie_data.id, movie_data.name, movie_data.desc,
      movie_data.rating, movie_data.length);

      // create the HTML to show the movie's name
      $movieListElement.append(movie.renderName());
    });
  };

  // get all movies from the backend and render
  function _getMoviesHandler(event){
    // make the request to the backend to get ALL the 
    // movies.
    $.ajax({
      url: moviesURL,
      dataType: 'json'
    })
    .done(function(movies){
      // render ALL the movies
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
    // target is element that received the click
    var movieID = event.target.id,
    movie;  

    // retrieve the movie from the backend and show it
    MovieApp.Movie.find_and_render(movieID);
  };

  // Initializes DOM Elements and Event Handlers.
  // Only public method
  function initialize(moviesID, getMoviesButtonID){
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