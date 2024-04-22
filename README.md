## A repository for CS3100 term project
Stock Trading Game Web Application - https://youtu.be/_oq9CNEi0JI 
--
Project Overview-
This web application serves as a platform for a stock trading game, allowing players to compete by trading stocks based on current NYSE prices. 
The goal is for players to maximise the value of their portfolios by the end of the game period.

Repository Layout
----
This repository is structured as follows:

/models: Contains data models for the application. For instance, player.js defines the schema for player data and game.js define schema for a game.

/routes: Houses the route definitions for the application. players.js manages routes related to player actions. admin.js manages routes related to admin actio like creating a game

/utils: Utility scripts and helpers

/ stockUtils.js for interactions with stock price APIs.

/gameservice.js help in creating a game.

/db.js: Configures and connects to the MongoDB database.

/server.js: The main Express server setup.

/index.js: Bootstraps the application by connecting to the database and starting the server.

/tests: Includes unit tests for server-side logic.

README.md: This document, providing an overview and setup instructions.

package.json: Lists dependencies and defines scripts for the project.

Code Architecture
=
The application is divided into two main components: the server (backend) and the client (frontend).

Backend
=
The backend architecture employs Node.js with Express for routing and MongoDB for data persistence. Here’s how the components work together:

Model (/models): Defines the structure of data stored in MongoDB. player.js is an example model for player data.

Routes (/routes): Specifies the endpoints and their logic. players.js contains endpoints for player registration and management.

Utilities (/utils): stockUtils.js encapsulates logic for fetching real-time stock prices, using an external API.

Database Connection (/db.js): Establishes a connection to the MongoDB database.

Server (/server.js): Configures the Express server, including middleware and route integration.

Bootstrap (/index.js): Initializes the database connection and starts the Express server.

Frontend
=
Frontend Overview
====
The frontend of our stock trading game application is built using React, a popular JavaScript library for building user interfaces. The application features a rich, client-side interface that allows users to interact with the game in real-time, providing functionalities such as user registration, dashboard viewing, stock buying and selling, leaderboard access, and administrative tasks.

Key Components and Functionalities
-------
Register Component
===
Purpose: Facilitates user registration, enabling new players to sign up and participate in the stock trading game.

Technologies Used: React for the component structure, HTML for form layout, and CSS for styling.

Functionality: Captures user input through a form and submits it to the backend to register a new player.

Dashboard Component
===
Purpose: Serves as the main interface for players, displaying their current cash balance, owned stocks, and providing options to buy or sell stocks.

Technologies Used: React for dynamic content updates, axios for making HTTP requests to the backend, and CSS for styling.

Functionality:
Fetches and displays current player information, including cash balances and stock holdings.
Integrates BuyComponent and SellComponent to enable stock transactions.
Displays a leaderboard showing top players.

AdminPage Component
===

Purpose: Allows administrative users to manage game settings, including creating games, renaming players, and providing feedback mechanisms.
Technologies Used: React, axios for API interactions, and CSS for the admin interface design.

Functionality:
Enables game creation with custom start and end times.
Allows for renaming of player accounts.
Incorporates a feedback form for users to leave comments or suggestions.

DeclareWinner Component
===
Integration Point:  its presence in routing suggests functionality for declaring the game's winner, likely an essential feature for the admin user.

Technical Highlights

React Router: Utilized for SPA (Single Page Application) navigation, enabling seamless transitions between different views (Register, Dashboard, AdminPage, DeclareWinner) without reloading the page.
State Management: Uses React's useState and useEffect hooks for state management and side effects, respectively, ensuring that the UI is in sync with the application's state.
Axios: Employed for promise-based HTTP requests to interact with the backend API, fetching data for display or submitting user actions.
CSS: Dedicated CSS files for components (e.g., Dashboard.css, AdminPage.css) ensure modular and maintainable styling across the application.

API Documentation
----
Player Management
=
Register a New Player
=
Endpoint: /api/players/register

Method: POST


Input: { name: 'Test Player' }

Functionality: Registers a new player in the game with an initial cash balance. Expected to return the player's details, including a starting cash balance.

Portfolio Management
=
Calculate Portfolio Value
=
Endpoint: /api/players/:id/portfolio/value

Method: GET

Input: Player ID in the URL path

Functionality: Calculates and returns the total value of a player's portfolio, including cash on hand and the current value of owned stocks.

Buy Stocks
=
Endpoint: /api/players/:id/buy

Method: POST

Input: { symbol: 'AAPL', quantity: 3 } with Player ID in the URL path

Functionality: Allows a player to buy a specified quantity of a stock, deducting the appropriate amount of cash from their balance.

Sell Stocks
=
Endpoint: /api/players/:id/sell

Method: POST

Input: { symbol: 'AAPL', quantity: 2 } with Player ID in the URL path

Functionality: Enables a player to sell a specified quantity of a stock, adding the appropriate amount of cash to their balance.
Setup and Running Instruction

Game Administration
=
Admin Creates a New Game
=

Endpoint: /api/admin/games/create

Method: POST

Input: { name: 'New Game', startTime: new Date(), endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) }

Functionality: Allows an admin to create a new game with specified start and end times.

Declare Winner
=
Endpoint: /api/admin/games/:gameId/
declare-winner

Method: POST

Input: Game ID in the URL path

Functionality: Declares the winner of a game based on the highest portfolio value among players.

Additional Functionality
=
Welcome Aboard Challenge Completion
=
Endpoint: /api/players/daily

Method: POST

Input: { name: 'Test Player0' }

Functionality: Tests automatic completion of a "Welcome Aboard" challenge for new players.
Trade History

Endpoint: /api/players/:id/trade-history

Method: GET

Input: Player ID in the URL path

Functionality: Retrieves a player's history of trade transactions.

---

Prerequisites
-----
Ensure Node.js and MongoDB are installed on your machine.

Obtain an API key for accessing NYSE stock prices, required for stockUtils.js.

Installation
==
#Clone the repository to your local environment.

#Run "npm install" in the project directory to install dependencies.

#Set up necessary environment variables, such as the MongoDB connection string and the stock price API key in stockUtils.js.

Database Setup
=
Initialize the MongoDB database structure as per db.js. If you have a seed data file, import it using mongoimport. i use mongo compass, make a database name stockTradingGame1 and one for more test stockTradingGameTest1
make collection name as players[ p.s dont forget the "1"]

Running the Server
=
Execute node server.js to start the server and connect to the database.[if u want just want to run test dont start the server]

The application will be accessible at http://localhost:3000.

Running Tests
----
Unit tests located in /tests can be run with "npm test".

Portfolio Management Tests
=
Register a New Player

Purpose: Ensures that a new player can be successfully registered in the system.

Process: Sends a POST request to the player registration endpoint with the player's name and checks for a 201 status code indicating success. Also verifies that the player's name and initial cash balance are correctly set in the response.

Calculate Portfolio Value
=
Purpose: Verifies the application's ability to calculate the total value of a player's portfolio accurately.

Process: Creates a player with an initial cash balance and stocks, then sends a GET request to calculate the portfolio value. The test checks if the total value equals the sum of cash and the value of held stocks.

Buy Stocks
=

Purpose: Tests the functionality allowing a player to buy stocks and updates their portfolio accordingly.

Process: Initiates a stock purchase for a player and checks if the player's cash balance is deducted appropriately and the bought stocks are added to their portfolio.

Sell Stocks
=
Purpose: Ensures that players can sell stocks from their portfolio, receiving the correct amount of cash in return.

Process: Simulates a stock sale for a player and validates that cash is added back to the player's balance while the sold stocks are removed or decreased in quantity from the portfolio.

Error Handling in Stock Transactions
=
Invalid Data for Buying Stocks
=
Purpose: Checks the system's response to invalid stock purchase requests, such as buying a negative quantity of stocks.

Process: Attempts to buy stocks with invalid data and expects a 400 status code, indicating an error.

Insufficient Funds for Buying Stocks
=
Purpose: Tests the scenario where a player attempts to buy stocks without having enough cash.

Process: Tries to make a stock purchase that exceeds the player's cash balance and looks for a 400 error response, indicating insufficient funds.

Buying Stocks with Zero Quantity
=
Purpose: Examines how the system handles a request to buy zero stocks.

Process: Sends a request to buy zero quantity of a stock and expects a 400 error response, indicating invalid transaction data.

Player Registration Sequence
=
Sequential Player Registration
=
Purpose: Ensures multiple players can be registered one after another without encountering errors.

Process: Registers two players sequentially and checks that each registration is successful and the players are correctly added to the database.

Game Administration Tests
=
Admin Creates a New Game

Purpose: Tests the functionality for an admin to create a new game.

Process: Sends a request to the game creation endpoint and verifies that the game is successfully created with the correct start and end times.

Declare Winner
=
Purpose: Validates the application's ability to declare a winner based on the highest portfolio value at the end of a game.

Process: Simulates player actions to differentiate their portfolio values and then tests the declare winner endpoint to ensure the correct player is declared as the winner.

Additional Functionality Tests
=
Welcome Aboard Challenge Completion
=
Purpose: Tests whether a new player automatically completes a "Welcome Aboard" challenge upon registration.

Process: Registers a new player and checks if the "Welcome Aboard" challenge is marked as completed in their profile.

Trade History
=
Purpose: Ensures that the application correctly records and retrieves a player's trade history.

Process: Simulates buying stocks for a player and then fetches the trade history to verify that the transactions are correctly recorded.

Analyzing Market Trends
=

Purpose: Tests the functionality of analyzing market trends for specified stocks.

Process: Uses mocked responses to simulate market trend analysis for given stocks and checks if the trends (upward or downward) are identified correctly based on price changes.

Watchlist Functionality
=


Purpose: Verifies that players can add and remove stocks from their watchlist.

Process: Tests adding a stock to the watchlist and ensures it's included, then tests removing the stock and ensures it's no longer present.

Attributions
=
api used aplha vantage

future implementation=

adding a leaderboard

adding athentication 

adding more admin tools

and the front end development
