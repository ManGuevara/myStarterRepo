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

/* ***************************
 *  Delete inventory item by id
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1 RETURNING *";
    const data = await pool.query(sql, [inv_id]);
    
    // Return true if a row was deleted, false otherwise
    return data.rowCount > 0;
    
  } catch (error) {
    console.error("deleteInventoryItem error:", error);
    throw error; // Re-throw to be caught by controller
  }
}

/* ***************************
 * Get classifications with their inventory items
 * ************************** */
async function getClassificationsWithInventory() {
  try {
    const data = await pool.query(`
      SELECT c.classification_id, c.classification_name, 
             i.inv_id, i.inv_make, i.inv_model, i.inv_year
      FROM classification c
      LEFT JOIN inventory i ON c.classification_id = i.classification_id
      ORDER BY c.classification_name, i.inv_year DESC, i.inv_make, i.inv_model
    `);
    
    // Group by classification
    const result = [];
    let currentClassification = null;
    
    data.rows.forEach(row => {
      if (!currentClassification || currentClassification.classification_id !== row.classification_id) {
        currentClassification = {
          classification_id: row.classification_id,
          classification_name: row.classification_name,
          inventory: []
        };
        result.push(currentClassification);
      }
      
      if (row.inv_id) {
        currentClassification.inventory.push({
          inv_id: row.inv_id,
          inv_make: row.inv_make,
          inv_model: row.inv_model,
          inv_year: row.inv_year
        });
      }
    });
    
    return result;
  } catch (error) {
    console.error("getClassificationsWithInventory error:", error);
    return [];
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryItemById,addClassification, addInventory,deleteInventoryItem, getClassificationsWithInventory};