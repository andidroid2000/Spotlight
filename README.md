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
- local database
    ```
    psql -U postgres 
    npm init  
    npm install pg
    ```
- express -> `npm install express`
- ejs -> `npm install ejs`
- router -> `npm install router`
- sass -> `npm install sass` 
- scss -> `npm install scss` 

After installing the packages, just run the command `node .` in project terminal to start the local hosting of the web app and acces http://localhost:8081 in a browser.

### Structure

---

- Home page -> has a submenu for each section
  Contains info about latest movies, events, monthly movie top and a gallery with upcoming cinema productions.
  
- About
  Short description of the website.
  
- Cinema
  
- Production
  Details about actors and movie directors.
  
- Memes
  Bloopers and memes about movies and actors.
