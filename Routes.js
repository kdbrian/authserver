const express = require('express')

const Router = express.Router();
const {
    register, login,refreshSession ,deleteAccount, logout
} = require('./controller/Authcontroller')

const { protect } =require('./util/Protect')

Router
.post('/register', register)
.post('/login', login)
.get('/refreshSession', protect, refreshSession)
.delete('/deleteAccount', protect, deleteAccount)
.get('/logout', protect, logout)

module.exports = Router;
