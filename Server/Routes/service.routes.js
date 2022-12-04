const express = require("express")
const router = express.Router()
const serviceController = require("../controllers/service.controller")

router.post("/", serviceController.create)
router.get("/:id?", serviceController.read)
router.put("/:id", serviceController.update)
router.delete("/:id", serviceController.delete)

module.exports = router
