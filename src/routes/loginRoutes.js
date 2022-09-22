const express = require ('express')
const loginController = require('../controllers/logincontroler')
const routes = express.Router()

routes.get('/login', loginController.login)
routes.post('/login', loginController.auth)
routes.get('/register', loginController.register)
routes.post('/register', loginController.usuarioRegistrado)
routes.get('/logout', loginController.logout)


module.exports= routes