const utilities = require('../utilities');
const accountModel = require('../models/account-model');

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
  });
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
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

module.exports = { buildLogin, buildRegister, registerAccount }
