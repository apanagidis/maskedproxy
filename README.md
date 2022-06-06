# Install 

````bash
npm install
````
Update initDB.js with test numbers (proxy, customer, driver)
Run initDB.js once 
Create and populate .env file based on .env.sample 
The Twilio proxy numbers webhook should point to the public url of the server, using HTTP GET
![Alt text](assets/numberwebhook?raw=true)
````bash
cd server && nodemon app.js 
````
# Usage
Create session -> Get proxy phone number
Call the proxy phone number from the customer or driver and the call will be forwarded accordingly. 
