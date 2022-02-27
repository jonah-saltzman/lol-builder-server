# LoL Forge

## Create & Save League of Legends Builds

League of Legends in a popular "Multiplayer Online Battle Arena" game in which two teams of five players fight over the course of 20-40 minutes to destroy their opponents' base. Each game is self-contained: what happens in one game has no effect on the next. Within a game, players choose one champion and, over the course of the game, earn gold that can be exchanged for items that augment their champion's in-game statistics.

With over 150 champions and 200 items, and a limit of up to six items at one time, choosing what items to build and what order to build them in is an important contributor to a player's success or failure. LoL Forge helps players create and store their preferred builds for a given champion, which they can access during a game in order to quickly remember the builds they carefully decided on.

Deployed at: [lol.jonahsaltzman.dev](https://lol.jonahsaltzman.dev)

Frontend repository: [github.com/jonah-saltzman/lol-forge](https://github.com/jonah-saltzman/lol-forge)

### Set Up

#### Backend

The LoL Forge backend is a Node application serving an Express-based API. The project is written in TypeScript, so in order to run it, you will need to transpile the TypeScript into JavaScript using `tsc`. 

The data abstraction layer of LoL Forge was written to be able to use any SQL-based database. As such, in order to fully install LoL Forge, you will need to configure a SQL ORM in `src/db/config.ts`. 

#### Frontend

The frontend is similarly written in TypeScript, and uses a customized WebPack configuration for transpiling and minifying the TypeScript code. The WepPack configuration, found in `webpack.config.js` and `webpack.prod.js` in the root of the client repository, makes use of `HtmlWebPackPlugin`, `FaviconsWebpackPlugin`, and `MiniCssExtractPlugin` plugins, and uses `ts-loader` to transpile and include the TypeScript code. The `npm run build` command will run WebPack in production mode and produce a minified distribution of the client in `prod/`.

### Technologies Used

#### Backend

The highlight of the LoL Forge backend is the data abstraction layer I wrote between the MySQL database (served from AWS) and the business logic of the application. This layer allows the database to be changed/switched from one relational database system to another without changing 99% of the code.

Riot Games, the publisher of League of Legends, patches the game every 2 weeks, meaning that the statistics of any item or champion are subject to change every two weeks. To keep the database current, I wrote an updater script that runs when the server starts and every 6 hours thereafter. This script downloads the latest item and champion data from Riot, computes an MD5 hash of the data, and if the hash is different from the previous hash (stored as text in an AWS S3 bucket), it parses the JSON data and updates the database accordingly. Writing the code to normalize this data, which unfortunately contains many errors and omissions, took about 1/4 of the total time spent on this project.

Because the item and champion data will change at most once every two weeks, I implemented server-side cache for this data using `node-cache` so that requests for this data from the client do not require database queries.

I also have found Passport to be more trouble than it is worth when using local authentication only, and so I wrote my own JWT-based authentication system that uses the same data abstraction layer as the rest of the application, and so similarly can be configured to use any relational database for user and token management.

#### Frontend

The LoL Forge frontend is a React application written in TypeScript. I used the exact same interfaces on the frontend as on the backend in order to keep data consistent and easy to work with. The data abstraction on the frontend largely mirrors that on the backend, except it is written to be tolerant of partial data and to allow data to be added to the abstracted objects as it is requested and received from the server. 

State is largely managed using React's context API across four state objects, one of which uses a custom reducer to apply state changes. `react-select` is used for searching and selecting both items and champions, and list items are rendered with a custom component to include the relevant icon with each list item. The client also uses `react-bootstrap` and `react-toastify` for UI elements and user notifications, respectively.

### Future Updates

The original purpose of LoL Forge was to allow users to not only create and manage item builds, but to also calculate the in-game statistics that would be conferred by a particular build, in order to compare one build with another. The reason I wrote such a robust data abstraction layer in the first place was to facilitate this feature; unfortunately, while all the necessary data is currently marshalled at the right place and time on the frontend to perform these calculations, the time limitations of this project did not allow my to implement this feature while also meeting MVP requirements such as the authentication flow and basic CRUD actions. Implementing this feature will be my next priority.

### Design

The LoL Forge data abstraction layer consists of three main classes: Item, Build, and Champ. The Item and Champ classes extend a base Stat class, which keeps track of the 22 different statistics and the 4 different ways each statistic can be modified. A Build consists of one champion, and an optional array of up to six items. All the business logic of creating, modifying, and saving a Build on the frontend is implemented as methods of the Build class. The Build class also has a method, `toObject`, which is used in order to send a JSON representation of the Build at some time to the server. When the server receives updated Build information from the client, it reconstructs an instance of the Build class from the information saved in the database, and then calls methods of that server-side class in order to update the Build in the database. 

### Current ERD

![Current ERD](https://i.imgur.com/EK8gua8.png)

### Initial Wireframe

![Initial Wireframe](https://i.imgur.com/aukfvNJ.png)

### Initial User Stories

- Sign-in/sign-out
- Change password
- Create a new build
- Add/remove items to a build
- Delete a build
- Compare the stats of one build to another (incomplete)

## Server routesr

### Public Routes

- GET /items: retrieve a list of all items (cached on server)
- GET /champs: retrieve a list of all champions (cached on server)
- POST /auth/signup: create a new user account
- POST /auth/signin: login to an existing account

### Authenticated routes (require JWT)

#### Authorization

- GET /auth/signout: sign out
- PATCH /auth/changepass: change password

#### Items

- GET /items/:itemId: retrieve detailed information and statistics for one item
- POST /items: retrieve detailed information and statistics for many items at once

#### Champions

- GET /champs/:champId: retrieve detailed information and statistics for one champion

#### Builds

- GET / : retrieve basic information about all the builds owned by the user associated with the provided JWT
- POST /new: create a new build from the provided information
- PATCH / : update a build with the provided information
- DELETE / : delete the indicated build from the database