const pool = require('../database/');

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* **********************
 * Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount > 0
  } catch (error) {
    return error.message
  }
}


/* *****************************
* Authenticate user
* ***************************** */
async function authenticate(account_email, account_password) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const data = await pool.query(sql, [account_email]);
    
    if (data.rowCount > 0) {
      const account = data.rows[0];
      // In production, use bcrypt.compare()
      if (account_password === account.account_password) {
        return account;
      }
    }
    return null;
  } catch (error) {
    return error.message;
  }
}


module.exports = { registerAccount, checkExistingEmail, authenticate  };