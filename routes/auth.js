const express = require("express");
const router = express.Router();
const VerifyUserMiddleware = require("../middlewares/verify.user.middleware");
const AuthorizationController = require("../controllers/authorization.controller");

router.post("/", [
  VerifyUserMiddleware.hasAuthValidFields,
  VerifyUserMiddleware.isPasswordAndUserMatch,
  AuthorizationController.login
]);

module.exports = router;
