const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, userLogin) => {
      if (err) res.status(403).json('The Token is not valid!');
      req.userLogin = userLogin;
      next();
    });
  } else {
    return res.status(401).json('You are not authenticated!');
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.userLogin.id === req.params.id || req.userLogin.isAdmin) {
      next();
    } else {
      res.status(403).json('You are not allowed to perform this operation.');
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.userLogin.isAdmin) {
      next();
    } else {
      res.status(403).json('You are not allowed to perform this operation.');
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
