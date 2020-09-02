//testando o novo branch
const express = require("express");

const AuthController = require("./app/controllers/AuthController");

const authMiddleware = require("./app/middlewares/auth");

const ProjectController = require("./app/controllers/ProjectController");

const routes = express.Router();

routes.post("/auth/register", AuthController.store);
routes.post("/auth/authenticate", AuthController.authenticate);

routes.get("/projects", authMiddleware, ProjectController.index);
routes.get("test", ProjectController.test);

module.exports = routes;
