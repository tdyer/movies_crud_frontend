$(document).ready(function(){
  'use strict';

  // Setup/init the list of movies
  MovieApp.Movielist.init('#movies', '#movies-button');

  // simulate a mouse click to get all the movies from the backend
  $('#movies-button').trigger('click');
});