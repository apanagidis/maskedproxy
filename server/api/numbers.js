const { Router } = require('express');
const provisionNumbers = require('./helpers/provisionNumbers')

const numbersRouter = Router();

numbersRouter.post('/provision', function(req, res) {
    try {
        let quantity = req.body.quantity && req.body.quantity > 1 ? req.body.quantity : 1
        for (let iter = 0; iter < quantity; iter++) {
            provisionNumbers();
        }
        let response = "Provisioned " + quantity + " number(s)";
        res.send(response);
        
    } catch (error) {
        console.log(error);
        res.send("Error while provisioning numbers");
    }
});

numbersRouter.post('/release', function(req, res) {
    let response ="Not Implemented"
    res.send(response);
 });


module.exports = {
    numbersRouter,
};