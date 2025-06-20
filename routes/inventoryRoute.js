// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildByInventoryId);//ADDED TASK
router.get("/trigger-error", (req, res, next) => {
    next(new Error("Intentional 500 error - Test"))
})//ADDED TASK

// Inventory management route
router.get('/', invController.buildManagement);


// NEW classification routes
router.get('/add-classification', utilities.handleErrors(invController.buildAddClassification))
router.post('/add-classification', utilities.handleErrors(invController.addClassification))

router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventory))
router.post('/add-inventory', utilities.handleErrors(invController.addInventory))


// GET route (renders confirmation view)  
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteView))

// POST route (processes deletion)  
router.post("/delete", utilities.handleErrors(invController.deleteItem));    

router.post('/delete-confirm', utilities.handleErrors(invController.confirmDelete));

module.exports = router;