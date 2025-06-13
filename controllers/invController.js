const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}
/* ***************************************
 *  Build inventory item detail view
 * *************************************** */

invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryItemById(inv_id);
  const detailHTML = await utilities.buildInventoryDetail(data)
  let nav = await utilities.getNav()
  const vehicleName = `${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    detailHTML,
  })
}

invCont.triggerError = async function(req, res) {
  // This will trigger a 500 error
  throw new Error("Intentional 500 error - Test")
}

// Build inventory management view
invCont.buildManagement = async function(req, res, next) {
    try {
        // Test messages (remove after testing)
        req.flash('success', 'Welcome to Inventory Management');
        req.flash('info', 'Please select an action below');
        
        const nav = await utilities.getNav();
        res.render("inventory/management", {
            title: "Inventory Management",
            nav
        });
    } catch (error) {
        req.flash('error', 'Failed to load management view');
        res.redirect('/');
    }
}

  module.exports = invCont