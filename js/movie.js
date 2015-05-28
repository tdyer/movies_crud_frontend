var MovieApp = MovieApp || {};

MovieApp.Movie = (function(){

  var $currentMovieElement = $('#current-movie'),
   // lets get the form input fields only once.
    $movieName = $('#movie-name'), 
    $movieDesc = $('#movie-desc'),
    $movieLength = $('#movie-length'),
    $movieRating = $('#movie-rating'),
    $moviesList = $('#movies'),
    moviesURL = 'http://localhost:3000/movies';

  // constructor function for a movie
  function Movie(id, name, desc, rating, length){
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.rating = rating;
    this.length = length;
  };

  // Class method to create a movie using the backend API
  Movie.create = function(){
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
    .done(function(movie_data){
      var movie = new Movie(movie_data.id, movie_data.name, 
        movie_data.desc, movie_data.rating, movie_data.length);

      $moviesList.append(movie.renderName());
    })
    .fail(function(){
      var errorMsg = 'Error: Creating a movie';
      alert(errorMsg);
      console.log(errorMsg);
    }); // end fail
  };

  // Set the handler to create a movie
  $('#create-movie').on('click', Movie.create);
  
  // Class method to query the backend API for a movie with
  // and id
  Movie.find_and_render = function(id){
    var movieURL = 'http://localhost:3000/movies/' + id,
    movie;

     // Send and Ajax GET request
    $.ajax({
      url: movieURL,
      dataType: 'json'
    })
    .done(function(movie_data){
      movie = new MovieApp.Movie(movie_data.id, movie_data.name, movie_data.desc,
      movie_data.rating, movie_data.length);
      // set the dom element to contain the movie's attributes.
      $currentMovieElement.html(movie.render())
    })
    .fail(function(){
      var errorMsg = 'Error: Getting Movie data, Accessing the URL' + movieURL;
      alert(errorMsg);
      console.log(errorMsg);
    }); // end of $.ajax
  };

  // Instance method to add the name of of a movie in a list.
  Movie.prototype.renderName = function(){
    return '<li id="' + this.id + '" >'+ this.name + '</li>';

  };

  // Instance method to build the HTML to represent a movie.
  Movie.prototype.render = function(){
    var movieHTML = '<dl><dt>name</dt><dd>' + this.name + '</dd>';
    movieHTML += '<dt>rating</dt><dd>' + this.rating + '</dd>';
    movieHTML += '<dt>description</dt><dd>' + this.desc + '</dd>';
    movieHTML+= '<dt>length</dt><dd>' + this.length + '</dd></dl>';
    return movieHTML;
  };

  // return the constructor function
  return Movie;
})(); 