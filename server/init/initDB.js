
var sqlite3 = require('sqlite3').verbose();
require('dotenv').config();
var db = new sqlite3.Database(process.env.PROXY_NAME.trim(), (sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE),
    function(err) {
        if (err)
            console.log("unable to open DB");
});
 
db.serialize(function() {
    db.run("CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, number TEXT)");
    db.run("CREATE TABLE drivers (id INTEGER PRIMARY KEY, name TEXT, number TEXT)");
    db.run("CREATE TABLE proxy_numbers (id INTEGER PRIMARY KEY, number TEXT)");
    db.run("CREATE TABLE sessions (id INTEGER PRIMARY KEY, datetime TEXT, customer_id INTEGER, driver_id INTEGER, number_id INTEGER, FOREIGN KEY (customer_id) REFERENCES customers(id), FOREIGN KEY (driver_id) REFERENCES drivers(id))")
    
    db.run("INSERT INTO customers (name, number) VALUES ('Zoiper', '+18312736601')")
    db.run("INSERT INTO drivers (name, number) VALUES ('Adonis', '+6585095256')")
    db.run("INSERT INTO proxy_numbers (number) VALUES ('+19014684199')");
    db.run("INSERT INTO proxy_numbers (number) VALUES ('+19282382429')");
});
 
db.close();