# Spotlight

### Description

---

Spotlight is a Javascript web app that hosts a forum for movie rating and related news about actors, directors and scenes.

### How to use

---

In order to run the app, the project must contain the following *Node.js* modules (run the commands in the terminal of the project):

- request ip -> `npm install request-ip`
- mp4box -> `npm install mp4box`
- sharp -> `npm install sharp`
- local database -> `psql -U postgres` `npm init` `npm install pg`
- express -> `npm install express`
- ejs -> `npm install ejs`
- router -> `npm install router`
- sass -> `npm install sass` 
- scss -> `npm install scss` 

After installing the packages, just run the command `node .` in project terminal to start the local hosting of the web app and acces http://localhost:8081 in a browser.

### Structure

---

- Home page 

  Has a submenu for each section.
  
  Contains: 
  - info about latest movies;
  - events;
  - monthly movie top;
  - gallery with upcoming cinema productions.
  
- About page

  Short description of the website.
  
- Cinema page

  Has a submenu for each type of cinema productions - it works as a filter (all types, animations, movies, documentaries, short films and soap operas)
  
  Data is shown as a list of cards with main info about movies.
  
  This page contains a filter section with the following options:
  - name;
  - lowest score;
  - country of production;
  - type of movie;
  - show the latest movies;
  - family friendly;
  - sort by score;
  - compute the average score of the selected movies.
  
  Each movie card has a link towards the movie page that contain detailed data about the film.
  
- Production page

  Details about actors and movie directors.
  
- Memes page

  Bloopers and memes about movies and actors.
