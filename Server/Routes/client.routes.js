const express = require("express")
const router = express.Router()
const clientController = require("../controllers/client.controller")

router.post("/", clientController.create)
router.get("/:id?", clientController.read)
router.put("/:id", clientController.update)
router.delete("/:id", clientController.delete)

module.exports = router
