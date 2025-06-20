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

/* ***************************
 *  Build Add Classification View
 * ************************** */
invCont.buildAddClassification = async function(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      messages: req.flash()
    })
  } catch (error) {
    req.flash('error', 'Sorry, the classification view could not be built.')
    res.redirect('/inv/')
  }
}

/* ***************************
 *  Process Add Classification
 * ************************** */
invCont.addClassification = async function(req, res, next) {
  const { classification_name } = req.body;
  
  // Server-side validation
  const errors = [];
  if (!classification_name) {
    errors.push('Classification name is required');
  } else if (!/^[a-zA-Z0-9]+$/.test(classification_name)) {
    errors.push('Only letters and numbers allowed (no spaces/special characters)');
  }

  if (errors.length > 0) {
    let nav = await utilities.getNav();
    return res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors, 
      message: null, 
      info: null    
    });
  }

  try {
    const result = await invModel.addClassification(classification_name);
    if (result) {
      req.flash('success', `Successfully added ${classification_name} classification!`);
      return res.redirect('/inv/');
    }
  } catch (error) {
    let nav = await utilities.getNav();
    return res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: ['Classification may already exist'],
      message: null,
      info: null
    });
  }
}

// Build add inventory view
invCont.buildAddInventory = async function(req, res, next) {
    try {
        let nav = await utilities.getNav(req)
        let classificationList = await utilities.buildClassificationList()
        res.render("./inventory/add-inventory", {
            title: "Add New Inventory",
            nav,
            classificationList,
            errors: null,
            messages: req.flash()
        })
    } catch (error) {
      console.error("Error building inventory view:", error);
        req.flash('error', 'Sorry, the inventory view could not be built.')
        res.redirect('/inv/')
    }
}

// Process new inventory

invCont.addInventory = async function(req, res) {
    const { 
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color
    } = req.body;

    // Server-side validation
    const errors = [];
    
    if (!classification_id) errors.push('Classification is required');
    if (!inv_make || inv_make.length < 1 || inv_make.length > 50) errors.push('Make must be 1-50 characters');
    if (!inv_model || inv_model.length < 1 || inv_model.length > 50) errors.push('Model must be 1-50 characters');
    if (!inv_year || !/^\d{4}$/.test(inv_year)) errors.push('Year must be a 4-digit number');
    if (!inv_description || inv_description.trim().length < 1) errors.push('Description is required');
    if (!inv_image) errors.push('Image path is required');
    if (!inv_thumbnail) errors.push('Thumbnail path is required');
    if (!inv_price || isNaN(inv_price) || parseFloat(inv_price) <= 0) errors.push('Valid price is required');
    if (!inv_miles || !/^\d+$/.test(inv_miles)) errors.push('Miles must be a whole number');
    if (!inv_color || inv_color.length < 1 || inv_color.length > 20) errors.push('Color must be 1-20 characters');

    if (errors.length > 0) {
        let nav = await utilities.getNav(req);
        let classificationList = await utilities.buildClassificationList(classification_id);
        return res.render("./inventory/add-inventory", {
            title: "Add New Inventory",
            nav,
            classificationList,
            errors,
            // Sticky form values
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            messages: req.flash()
        });
    }

    try {
        const result = await invModel.addInventory({
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price: parseFloat(inv_price),
            inv_miles: parseInt(inv_miles),
            inv_color
        });

        if (result) {
            req.flash('success', 'Successfully added new inventory item!');
            return res.redirect('/inv/');
        }
    } catch (error) {
        console.error("Add inventory error:", error);
        req.flash('error', 'Failed to add inventory item');
        let nav = await utilities.getNav(req);
        let classificationList = await utilities.buildClassificationList(classification_id);
        return res.render("./inventory/add-inventory", {
            title: "Add New Inventory",
            nav,
            classificationList,
            errors: ['Database error occurred'],
            // Sticky form values
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            messages: req.flash()
        });
    }
};

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.deleteView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryItemById(inv_id);
    
    if (!itemData || itemData.length === 0) {
      req.flash('error', 'Inventory item not found');
      return res.redirect('/inv/');
    }

    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;
    
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData[0].inv_id,
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_year: itemData[0].inv_year,
      inv_price: itemData[0].inv_price,
      messages: req.flash()
    });
  } catch (error) {
    console.error("Error building delete confirmation view:", error);
    req.flash('error', 'Sorry, the delete confirmation view could not be built.');
    res.redirect('/inv/');
  }
};

/* ***************************
 *  Process inventory item deletion
 * ************************** */
invCont.deleteItem = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id);
    let nav = await utilities.getNav();
    
    // Call model to delete item
    const deleteResult = await invModel.deleteInventoryItem(inv_id);

    if (deleteResult) {
      req.flash("success", 'The deletion was successful.');
      res.redirect('/inv/');
    } else {
      req.flash("error", 'Sorry, the delete failed.');
      res.redirect(`/inv/delete/${inv_id}`);
    }
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    req.flash("error", 'Sorry, an error occurred during deletion.');
    res.redirect(`/inv/delete/${req.body.inv_id}`);
  }
};





  module.exports = invCont