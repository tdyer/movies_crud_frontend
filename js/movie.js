var MovieApp = MovieApp || {};

MovieApp.Movie = (function(){
  // constructor function for a movie
  function Movie(id, name, desc, rating, length){
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.rating = rating;
    this.length = length;
  }

  Movie.prototype.renderName = function(){
    return '<li id="' + this.id + '" >'+ this.name + '</li>';

  };

  Movie.prototype.render = function(){
    var movieHTML = '<dl><dt>name</dt><dd>' + this.name + '</dd>';
    movieHTML += '<dt>rating</dt><dd>' + this.rating + '</dd>';
    movieHTML += '<dt>description</dt><dd>' + this.desc + '</dd>';
    movieHTML+= '<dt>length</dt><dd>' + this.length + '</dd></dl>';
    return movieHTML;
  };

  return Movie;
})(); 