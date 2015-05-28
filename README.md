![General Assembly Logo](http://i.imgur.com/ke8USTq.png)

## Objectives
* Create a frontend app that will use an API to list, read, create, update and delete movies. 
* This frontend app will use Ajax for to create, read, update, delete and list movies.
* This frontend app will process the JSON responses from the backend API.
* Draw Diagrams that show the flow of a HTTP Requests and Responses and the how the Model, View and Controller interact.


## Create a frontend app

**Create a directory for a front-end application.**

```
mkdir movies_crud_frontend
cd movies_crud_frontend
mkdir js
subl .
```


### List all the Movies

**In the index.html add**

```html
<html>
<head>
  <title>Movies</title>
</head>
<body>

  <!-- Create a Movie form -->
  <div>
    <input type='text' id='movie-name' placeholder="Enter Movie name"></input><br>
    <input type='textarea' id='movie-desc' placeholder="Enter Movie description"></input><br>
    <input type='text' id='movie-length' placeholder="Enter Movie length"></input><br>

    <label for='select-movie-rating'>Movie Rating</label>
    <select id='movie-rating' name='select-movie-rating'>
      <option value='G'>G</option>
      <option value='pg'>PG</option>
      <option value='pg-13'>PG-13</option>
      <option value='R'>R</option>      
      <option value='nc-17'>NC-17</option>      
    </select><br>

    <button id='create-movie'>Create Movie</button>
  </div>

  <h1>Movies</h1>
  <ul id='movies'>
  </ul>
  <button id='movies-button'>Get Movies</button>
  <br>

  <div id='current-movie'>
  </div>
  <script type="text/javascript" src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
  <script type="text/javascript" src='js/movie.js'></script>
  <script type="text/javascript" src='js/movie_list.js'></script>
  <script type="text/javascript" src='js/app.js'></script>
</body>
</html>
```

**Create js/app.js**

```javascript
$(document).ready(function(){
  'use strict';

  // Setup/init the list of movies
  MovieApp.Movielist.init('#movies', '#movies-button');

  // simulate a mouse click to get all the movies from the backend
  $('#movies-button').trigger('click');
});

```
**Create js/movie_list.js**

```javascript
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
```

**Create a js/movie.js**

```javascript
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
```

**First lets create an alias for the simple web server**

Put this at the beginning of your .bashrc file, 

```
alias rubys='ruby -run -e httpd . -p5000' 
```
This just creates an alias from rubys to that really hard to remember command to start up the ruby server.

**Run the front-end server on port 5000**

```
rubys 
```



##Let's Use the Rails API we just created

That provides us with a Movies API.

**Open a terminal in the movies backend directory**

**And run the backend on port 5000**

```
rails server
```


