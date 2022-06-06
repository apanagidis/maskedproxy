var crypto = require('crypto');

var generate_key = function() {
    return crypto.randomBytes(16).toString('base64');
};

  console.log(generate_key());