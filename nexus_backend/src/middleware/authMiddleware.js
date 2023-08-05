const jwt = require("jsonwebtoken");
const { responseModel } = require("../responses");
const { isVerifiedToken } = require("../services/auth");


let Auth = async (req, res, next) => {
  checkAuth(req, res, next, 1);
};

const checkAuth = async (req, res, next, role) => {
  if (req.headers && req.headers.authorization) {
    let authorization = req.headers.authorization;

    let user = isVerifiedToken(authorization);
    if (!user) {
      const response = responseModel.failResponse("Invalid Token")
      return res.status(response.status).send(response.data);
    }
    else {
      res.locals.user = user;
      next();
    }
  } else {
    const response = responseModel.failResponse("Token required")
    return res.status(response.status).send(response.data);
  }
};

module.exports = { Auth};