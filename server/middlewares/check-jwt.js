const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = function(req, res, next) {
  let token = req.headers["authorization"];
  // token verification
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        res.json({
        success: false,
        message: 'Failed to auth token'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(403).send({
      success: false,
      message: 'No token provided'
    });
  }
}
