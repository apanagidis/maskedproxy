const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
var sqlite3 = require('sqlite3').verbose();

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())


var db = new sqlite3.Database('./proxy.db', sqlite3.OPEN_READWRITE,
    function(err) {
        if (err)
            console.log("DB" + err);
});


const query = (command, method = 'all') => {
    return new Promise((resolve, reject) => {
      db[method](command, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };



app.get('/', function(req, res) {
    // Find unassigned proxy numbers
    db.all("SELECT number FROM proxy_numbers", {}, function(err, rows) {
        var proxy_numbers = rows;
        
        // TODO to fix to show current sessions 
        // db.all("SELECT c.name AS customer, d.name AS driver, datetime, p.number AS number FROM sessions r JOIN customers c ON c.id = r.customer_id JOIN drivers d ON d.id = r.driver_id JOIN proxy_numbers p ON p.id = r.number_id", {}, function(err, rows) {
        db.all("SELECT * from sessions", {}, function(err, rows) {
    
            var sessions = rows;

            // Collect customers
            db.all("SELECT * FROM customers", {}, function(err, rows) {
                var customers = rows;
            
                // Collect drivers
                db.all("SELECT * FROM drivers", {}, function(err, rows) {
                    var drivers = rows;

                    stats ={
                        "Proxy number":proxy_numbers,
                        "Sessions":sessions,
                        "Customers":customers,
                        "Drivers": drivers
                    }
                    res.json(stats);

                });
            });
        });
    });
});

// Create a new session
app.post('/session', function(req, res) {
    db.serialize(async () => {
        try {
            const customer = await query('SELECT * FROM customers WHERE id ='+req.body.customer,'get');
            const driver = await query('SELECT * FROM drivers WHERE id ='+req.body.driver,'get');
            const availNumber = await query("SELECT * FROM proxy_numbers "
            + "WHERE id NOT IN (SELECT number_id FROM sessions WHERE customer_id ="+customer.id+") "
            + "AND id NOT IN (SELECT number_id FROM sessions WHERE driver_id ="+driver.id+")",'get');

            // Store ride in database
            db.run("INSERT INTO sessions ( datetime, customer_id, driver_id, number_id) VALUES ( $datetime, $customer, $driver,$number)", {
                $datetime : new Date(),
                $customer : customer.id,
                $driver : driver.id,
                $number : availNumber.id
            });
            let response = "Session created. Proxy number is " + availNumber.number;
            res.send(response);
            
        } catch (error) {
            console.log(error)
            res.send("An error occured creating the session");
        }
    });
});

// Delete session
app.delete('/session/:id', function(req, res) {
    db.run('DELETE FROM sessions WHERE id = ?',req.params.id , function(err) {
        if (err) {
          res.send("Error encountered while deleting");
          return console.error(err.message);

        }
        else{
            res.send("Entry Deleted");
        }

    });

});
app.post('/voice', (request, response) => {
    const twiml = new VoiceResponse();


  let proxy_number = request.body.To;
  console.log("proxy_number", proxy_number);
  let caller = request.body.From;
  console.log("caller", caller);

  db.serialize(async () => {
    const session = await query('SELECT c.number AS customer_number, d.number AS driver_number, p.number AS proxy_number from sessions r JOIN proxy_numbers p ON p.id = r.number_id JOIN customers c ON r.customer_id = c.id JOIN drivers d ON r.driver_id = d.id WHERE p.number = "'+proxy_number+'" AND (c.number = "'+caller+'" OR d.number = "'+caller+'")');
    console.log(session);
    if(session === undefined || session.length == 0){
        console.log("No active session")
        twiml.say({ language: 'en-AU', voice:'Polly.Nicole' }, 'Technical error, no active session. Goodbye');
    }
    else{
        let row = session[0];
        var recipient = "";
        if (caller == row.customer_number)
            recipient = row.driver_number;
        else if (caller == row.driver_number)
            recipient = row.customer_number;
        
        // Use the Twilio Node.js SDK to build an XML response
         twiml.dial({
            callerId: proxy_number,
          }, recipient);

     }
      // Render the response as XML in reply to the webhook request
      response.type('text/xml');
      response.send(twiml.toString());
  });

});

// Create an HTTP server and listen for requests on port 3000
app.listen(3010, () => {
  console.log(
    'Now listening'
  );
});

