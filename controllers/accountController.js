const utilities = require('../utilities');
const accountModel = require('../models/account-model');
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver login view
* *************************************** */

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()

  res.render("account/login", {
    title: "Login",
    nav,
    errors: req.flash('error') || null,  // Standardized flash access
    message: req.flash('success') || null // Clear type differentiation
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    message: null
    // account_firstname: null, 
    // account_lastname: null,
    // account_email: null
  });
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  try {
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult.rowCount > 0) {
      req.flash(
        "success", // Changed from "notice" to match our flash types
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      );
      return res.redirect("/account/login"); // ✅ Changed to login page
    }
  } catch (error) {
    req.flash("error", "Registration failed. Please try again.");
    return res.redirect("/account/register");
  }

}


/* ****************************************
*  Process login attempt
* *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  try {
    const account = await accountModel.authenticate(account_email, account_password);
    
    if (account) {
      req.flash("success", `Welcome back ${account.account_firstname}!`);
      return res.redirect("/account/");
    } else {
      req.flash("error", "Invalid credentials");
      return res.redirect("/account/login");
    }
  } catch (error) {
    req.flash("error", "Login failed. Please try again.");
    return res.redirect("/account/login");
  }
}

 
module.exports = { buildLogin, buildRegister, registerAccount,  accountLogin  }
