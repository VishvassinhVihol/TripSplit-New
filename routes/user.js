const express = require('express')
const router = express.Router()
const passport = require('passport')
const { isLoggedIn, saveRedirectUrl } = require('../middleware.js')
let userController = require('../controller/user.js')


router.get('/signup',userController.signupPage)

router.post('/signup',userController.signup)

router.get('/login',userController.loginPage)

router.post('/login',saveRedirectUrl,passport.authenticate('local',{failureRedirect:'/trip',failureFlash:true}),userController.login)

router.get('/logout',isLoggedIn,userController.logout)

module.exports = router