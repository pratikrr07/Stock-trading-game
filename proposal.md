
Overview

This interactive web-based platform invites participants to delve into the realm of stock market trading through a competitive, simulated environment. Each player embarks on a financial journey with a designated amount of virtual currency, tasked with navigating the ebbs and flows of the NYSE to augment their portfolio's worth. Through strategic buying and selling, individuals vie for the top spot, aiming to outperform their peers by the competition's conclusion. Additionally, the platform empowers administrators to craft and oversee the trading contests, ensuring a dynamic and engaging experience for all involved.

***************************************
(if the link doesnt work i have uploaded the images in the folder with their description)
-

player's web gui interface
--
![Alt text](player.jpg)

https://raw.githubusercontent.com/CS3100W24/project-pratikrr07/main/doc/player.jpg?token=GHSAT0AAAAAACMVQLLHVQEUT3ESALCQBKKSZOAJ5FQ

admin's web gui interface
--
![Alt text](admin.jpg)
https://raw.githubusercontent.com/CS3100W24/project-pratikrr07/main/doc/admin.jpg?token=GHSAT0AAAAAACMVQLLHM574E4E4NA3NFGCUZOAJ4ZA





| ID | Feature Name                     | Access By    | Short Description                                                       | Expected Implementation   | Source of Idea       |
|----|----------------------------------|--------------|-------------------------------------------------------------------------|---------------------------|----------------------|
| 1  | Player Registration              | Player       | Players register for a specific game                                    | Must implement            | Project instructions |
| 2  | Starting Cash Allocation         | System       | Provide all players a starting cash account in their portfolio          | Must implement            | Project instructions |
| 3  | Buy and Sell Actions             | Player       | Allow player buy and sell actions at current NYSE prices                | Must implement            | Project instructions |
| 4  | Portfolio Tracking               | System       | Keep track of each player's portfolio and its value                     | Must implement            | Project instructions |
| 5  | Winner Declaration               | Admin        | Declare a winner at the end of the game                                 | Must implement            | Project instructions |
| 6  | Login and Profile Management     | Player/Admin | Maintain player login and profile information                           | Must implement            | Project instructions |
| 7  | Game Creation                    | Admin        | Admin users can create games                                            | Must implement            | Project instructions |
| 8  | Competitor Portfolio Viewing     | Player       | Optional viewing of competitor's portfolios                             | Likely to be done         | Player choice        |
| 9  | Transaction Fees                 | System       | Optional costs to buy/sell transactions (fees)                          | Likely to be done         | Realism              |
| 10 | Trade History                    | Player       | Tracking all trades and activities of a player during the game          | Must implement            | Transparency         |
| 11 | Game Configuration               | Admin        | Time and starting amount game configuration                             | Likely to be done         | Customization        |
| 12 | Real-time Market Updates         | Player       | Display real-time NYSE market updates within the game                   | Must implement            | Engagement           |
| 13 | Player Messaging System          | Player       | Allow players to send messages to each other                            | Considered                | Social Interaction   |
| 14 | News Feed                        | Player       | Provide a news feed with relevant financial news                        | Likely to be done         | Informed Decisions   |
| 15 | Leaderboard                      | Player       | Real-time leaderboard showing top players                               | Must implement            | Competition          |
| 16 | Stock Watchlist                  | Player       | Players can create a watchlist of stocks                                | Likely to be done         | Personalization      |
| 17 | Daily Challenges                 | Player       | Introduce daily challenges for additional rewards                       | Considered                | Engagement           |
| 18 | Rewards System                   | Player       | Implement a rewards system for achieving certain milestones             | Considered                | Motivation           |
| 19 | Tutorial and Tips                | Player       | Provide tutorials and tips for new players                              | Likely to be done         | Education            |
| 20 | Market Analysis Tools            | Player       | Advanced tools for market analysis (e.g., moving averages, indicators)  | Considered                | Strategic Planning   |
| 21 | Custom Game Modes                | Admin        | Admins can create custom game modes with different rules                | Considered                | Variety              |
| 22 | Mobile Responsiveness            | Player/Admin | Ensure the web application is fully responsive on mobile devices        | Must implement            | Accessibility        |
| 23 | Multi-language Support           | Player/Admin | Support multiple languages for wider accessibility                      | Considered                | Global Reach         |
| 24 | Dark Mode                        | Player/Admin | Provide a dark mode to reduce eye strain                                | Likely to be done         | User Preference      |
| 25 | Feedback System                  | Player       | Players can submit feedback directly through the game                   | Considered                | Quality Improvement  |
| 26 | Historical Performance Analysis  | Player       | Allow players to analyze their historical performance                   | Likely to be done         | Self-improvement     |
| 27 | Automated Trading Options        | Player       | Let players set up automated trading based on certain criteria          | Considered                | Advanced Users       |
| 28 | Game Pause and Resume            | Admin        | Admins can pause and resume games, useful for maintenance or updates    | Considered                | Administration       |
| 29 | Security Features                | System       | Implement advanced security features to protect user data               | Must implement            | Trust and Safety     |
| 30 | API Access for Third-party Tools | Developer    | Provide API access for integration with third-party tools and analytics | Considered                | Extensibility        |


************************
TOOLS AND PACKAGES
-

Frontend: React.js for building the user interface

Chart.js for charting stock prices.

Backend: Node.js with Express for the server

MongoDB for data storage.


Authentication: Passport.js for handling user authentication.

Stock Data: Use of a third-party API to fetch real-time stock prices.

****************************

User and Authentication
------------------------

POST /register: Registers a new user.

Body: Includes username, password, and email.

Response: Success message or error.

POST /login: Authenticates a user.

(PLAYER ACTION)

GET /portfolio: Gets the current portfolio of a player.

Query Params: playername and gameid.

Response: Portfolio details or error.

POST /buy: Executes a stock purchase within the game.

Body: Includes playername, gameid, stock, and quantity.

Response: Success message with transaction details or error.

POST /sell: Executes a stock sale within the game.

Body: Includes playername, gameid, stock, and quantity.

Response: Success message with transaction details or error.

GET /leaderboard: Retrieves the game leaderboard.


****************************

Stocks api
--- 

Alpha Vantage-GET https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=YOUR_API_KEY

or 

MarketStack-GET http://api.marketstack.com/v1/tickers/aapl/eod/latest?access_key=YOUR_ACCESS_KEY


Conclusion
--
This proposal outlines is not complete for the stock trading game project. The features listed are subject to change as more is learned throughout the course.