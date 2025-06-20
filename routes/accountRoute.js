// Needed Resources 
const express = require('express')
const router = express.Router()
const utilities = require('../utilities')
const accountController = require('../controllers/accountController')
const regValidate = require("../utilities/account-validation")


// GET route for login view
router.get('/login', utilities.handleErrors(accountController.buildLogin)) 

// GET route for registration view
router.get('/register', utilities.handleErrors(accountController.buildRegister))

// POST route for registration
router.post("/register", regValidate.registrationRules(), regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);


module.exports = router;