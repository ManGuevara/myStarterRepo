const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  try {
    const data = await pool.query(
      "SELECT classification_id, classification_name FROM public.classification ORDER BY classification_name"
    );
    return data; 
  } catch (error) {
    console.error("getClassifications error:", error);
    return { rows: [] }; 
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get inventory item by id
 * ************************** */
async function getInventoryItemById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
       WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryItemById error " + error)
    throw error
  }
}

// Get new classification
async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
        return await pool.query(sql, [classification_name]);
    } catch (error) {
        console.error("Error adding classification:", error);
        return null;
    }
}

/***adding inventory task 3 */

async function addInventory({
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
}) {
    try {
        const sql = `INSERT INTO inventory (
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
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
        
        return await pool.query(sql, [
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
        ])
    } catch (error) {
        console.error("Error adding inventory:", error)
        return null
    }
}



module.exports = {getClassifications, getInventoryByClassificationId, getInventoryItemById,addClassification, addInventory};