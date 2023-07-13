const express = require("express");
const router = express.Router();
const Controller = require("../controllers/users.controller");
const ValidationMiddleware = require("../middlewares/auth.validation.middleware");
const PermissionMiddleware = require("../middlewares/auth.permission.middleware");

const config = require('../config/env.config');
const ADMIN = config.permissionLevels.ADMIN;
const DEFAULT = config.permissionLevels.DEFAULT;

router.post("/", [Controller.insert]);
router.get("/", [ 
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
  Controller.list
]);
router.get("/:userId", [
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(DEFAULT),
  PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
  Controller.getById
]);
router.patch("/:userId", [
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(DEFAULT),
  PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
  Controller.patchById,
]);
router.delete("/:userId", [
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
  Controller.removeById,
]);

module.exports = router;
