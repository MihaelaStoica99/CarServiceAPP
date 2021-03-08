
# Car Service App
> This is a node.js application whose purpose is to facilitate the administration of a car service.

## Table of contents
* [Motivation](#motivation)
* [Technologies](#technologies)
* [Setup](#setup)
* [Features](#features)
* [Status](#status)
* [Sources](#sources)
* [Contact](#contact)

## Motivation

The purpose of this application was to **learn new technologies** and to get familiar with **working with databases**.

## Technologies
* node.js -  v15.2.1
* EJS - v3.1.5
* Express - v4.17.1

## Setup

In order for this application to run you have to **install npm** on your computer and all dependencies from **package.json**.
```
#Install dependencies 
$npm install

#Run the app
$npm start
```
However, since this application has a connection to a local database - **Microsoft SQL Server** it won't run this way.

To exemplify how it actually works, here you can find the configuration of the local database:
```javascript
const sqlConfig = {  
  server: "localhost",  
  authentication: {  
    type: "default",  
  options: {  
      userName: "sa",  
  password: "*******",  
  database: "ServiceMasini",  
  },  
  },  
  options: { encrypt: false, enableArithAbort: true },  
};
```
After the configuration is made, we can connect to the database and start the application:
```javascript
dbConn = sql.connect(sqlConfig, function (err) {  
  if (err) {  
    console.log(err);  
  } else {  
    console.log("DB connected");  
  }  
});
```
## Features
* *delete* requests on the local database (admin mode)
* *add*/*update* information from the local database
* show relevant *statistics* about clients, services etc.
* make some advanced *searches*

To-do list:
* implement features for user mode: make an appointment, show the details of the intervention etc.

## Status
Project is: _in progress_, since the features for user mode are not implemented yet.

## Sources

1. **[Node.js Crash Course Tutorial](https://www.youtube.com/playlist?list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU)**

## Contact
Created by [@StoicaMihaela99](https://github.com/MihaelaStoica99) - feel free to contact me!