const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/users.controller");

router.post("/", UsersController.insert);

module.exports = router;
