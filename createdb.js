
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./proxy.db', (sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE),
    function(err) {
        if (err)
            console.log("Failed opening DB: " + err);
    });
 
db.serialize(function() {
    // Create the data model

    // // Customers: have ID, name and number
    // db.run("CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, number TEXT)");
    // // Drivers: have ID, name and number
    // db.run("CREATE TABLE drivers (id INTEGER PRIMARY KEY, name TEXT, number TEXT)");
    // // Proxy Numbers: have ID and number
    // db.run("CREATE TABLE proxy_numbers (id INTEGER PRIMARY KEY, number TEXT)");
    // Sessions: have ID, start, destination and date; are connected to a customer, a driver, and a proxy number
    db.run("CREATE TABLE sessions (id INTEGER PRIMARY KEY, datetime TEXT, customer_id INTEGER, driver_id INTEGER, number_id INTEGER, FOREIGN KEY (customer_id) REFERENCES customers(id), FOREIGN KEY (driver_id) REFERENCES drivers(id))")
    
    // Insert some data
    
    // // Create a sample customer for testing
    // // -> enter your name and number here!
    // db.run("INSERT INTO customers (name, number) VALUES ('Zoiper', '+18312736601')")

    // // Create a sample driver for testing
    // // -> enter your name and number here!
    // db.run("INSERT INTO drivers (name, number) VALUES ('Adonis', '+6585095256')")
    
    // db.run("INSERT INTO proxy_numbers (number) VALUES ('+19014684199')");
    // db.run("INSERT INTO proxy_numbers (number) VALUES ('+19282382429')");

});
 
db.close();