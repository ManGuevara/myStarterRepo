const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}
/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* ***************************
 *  Build inventory detail HTML
 * ************************** */
async function buildInventoryDetail(data) {
  const item = data[0]
  
  // Format price with USD and commas
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(item.inv_price)
  
  // Format mileage with commas
  const formattedMiles = new Intl.NumberFormat('en-US').format(item.inv_miles)
  
  return `
    <div class="inventory-detail-container">
      <div class="inventory-image">
        <img src="${item.inv_image}" alt="${item.inv_make} ${item.inv_model}">
      </div>
      <div class="inventory-details">
        <h2>${item.inv_make} ${item.inv_model}</h2>
        <p class="price-mileage">
          <strong>Price:</strong> ${formattedPrice}<br>
          <strong>Mileage:</strong> ${formattedMiles} miles<br>
          <strong>Year:</strong> ${item.inv_year}<br>
          <strong>Color:</strong> ${item.inv_color}
        </p>
        <div class="inventory-description">
          <h3>Vehicle Description</h3>
          <p>${item.inv_description}</p>
        </div>
      </div>
    </div>
  `
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = {handleErrors: Util.handleErrors,getNav:Util.getNav,buildClassificationGrid: Util.buildClassificationGrid, buildInventoryDetail}