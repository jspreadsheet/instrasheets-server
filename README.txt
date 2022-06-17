1) Clone the following GIT and go to the project root folder:

https://github.com/jspreadsheet/server.git

2) Install the JSS server

% cd resources/docker/sheets
% run install

3) Copy .env-sample to .env and add your JSS SERVER LICENSE and update the SECRET key.

4) Back to the project root folder

// Run docker-compose
% docker-compose up

// Install react frontend example
% npm install

5) Copy .env.example to .env and add the API address and JSS LICENSE (plugin licence)

6) Recovery SQL dump

docker-compose exec postgresql bash

$ psql -U postgres
$ CREATE DATABASE jsspro;
$ \q
$ psql -U postgres jsspro < server.sql
$ \q

7) Start frontend

% npm run start


