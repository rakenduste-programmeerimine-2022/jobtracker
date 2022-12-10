const express = require("express")
const router = express.Router()
const { body, validationResult } = require("express-validator")
const clientController = require("../controllers/client.controller")

const clientValidation = [
  body("userId").not().isEmpty().trim().escape(),
  body("name").not().isEmpty().trim().escape(),
  body("regcode").isNumeric(),
  body("vatno").trim().escape(),
  body("address").trim().escape(),
  body("term").isNumeric(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    console.log(req.body)
    next()
  },
]

router.post("/", clientValidation, clientController.create)
router.get("/:id?", clientController.read)
router.put("/:id", clientValidation, clientController.update)
router.delete("/:id", clientController.delete)

module.exports = router
