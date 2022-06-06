const { Router } = require('express');
var sqlite3 = require('sqlite3').verbose();
const VoiceResponse = require('twilio').twiml.VoiceResponse;
require('dotenv').config();


const sessionsRouter = Router();

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

var db = new sqlite3.Database(process.env.PROXY_NAME.trim(), sqlite3.OPEN_READWRITE,
function(err) {
    if (err)
        console.log("DB" + err);
});

sessionsRouter.post('/session', function(req, res) {
    db.serialize(async () => {
        try {
            // Do not allow a pair with an existing session to create another session
            const existingSession = await query("SELECT number FROM proxy_numbers WHERE id IN (SELECT number_id FROM sessions WHERE customer_id = "+req.body.customer+" AND driver_id="+ req.body.driver+")",'get');
            if(existingSession){
                console.log(existingSession);
                let response = "An existing session exists, use proxy number " + existingSession.number;
                return res.send(response);
            }

            const customer = await query('SELECT * FROM customers WHERE id ='+req.body.customer,'get');
            const driver = await query('SELECT * FROM drivers WHERE id ='+req.body.driver,'get');
            const availNumber = await query("SELECT * FROM proxy_numbers "
            + "WHERE id NOT IN (SELECT number_id FROM sessions WHERE customer_id ="+customer.id+") "
            + "AND id NOT IN (SELECT number_id FROM sessions WHERE driver_id ="+driver.id+")",'get');

            if(availNumber){
                db.run("INSERT INTO sessions ( datetime, customer_id, driver_id, number_id) VALUES ( $datetime, $customer, $driver,$number)", {
                    $datetime : new Date(),
                    $customer : customer.id,
                    $driver : driver.id,
                    $number : availNumber.id
                });
                let response = "Session created. Proxy number is " + availNumber.number;
                res.send(response);
            }
            else{
                res.send("No available number in the pool");
            }
         
        } catch (error) {
            console.log(error)
            res.send("An error occured creating the session");
        }
    });
});

sessionsRouter.delete('/session', function(req, res) {
    try {
        db.run('DELETE from sessions WHERE customer_id IN (SELECT id FROM customers  WHERE number = "'+req.body.customer+'") AND driver_id IN (SELECT id FROM drivers WHERE number= "'+req.body.driver+'")', function(error) {
            if(error){
                console.log(error)
                res.send("An error occured deleting the session");          
            }
            else{
                console.log(`Row(s) deleted ${this.changes}`);
                if(this.changes && this.changes > 0)
                    res.send("Session Deleted");
                else
                    res.send("No sessions deleted");
            }
        });

    } catch (error) {
        console.log(error)
        res.send("An error occured deleting the session");
    }
});

sessionsRouter.get('/session', (request, response) => {
    try {
        const twiml = new VoiceResponse();
        let proxy_number = request.query.To;
        let caller = request.query.From;
        console.log("caller", caller);
    
        db.serialize(async () => {
            const session = await query('SELECT c.number AS customer_number, d.number AS driver_number, p.number AS proxy_number from sessions r JOIN proxy_numbers p ON p.id = r.number_id JOIN customers c ON r.customer_id = c.id JOIN drivers d ON r.driver_id = d.id WHERE p.number = "'+proxy_number+'" AND (c.number = "'+caller+'" OR d.number = "'+caller+'")','get');
            console.log("session", session);
            if(session === undefined || session.length == 0){
                console.log("No active session")
                twiml.say({ language: 'en-AU', voice:'Polly.Nicole' }, 'Technical error, no active session. Goodbye');
            }
            else{        
                let recipient = session.customer_number==caller ? session.driver_number : session.customer_number;
    
                // Use the Twilio Node.js SDK to build an XML response
                twiml.dial({
                    callerId: proxy_number,
                }, recipient);
    
            }
            // Render the response as XML in reply to the webhook request
            response.type('text/xml');
            response.send(twiml.toString());
        });
    } catch (error) {
        console.log(error)
        res.send("An error occured fetching the session");
    }
});

module.exports = {
    sessionsRouter,
};