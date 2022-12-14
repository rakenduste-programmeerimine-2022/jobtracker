const express = require("express")
const router = express.Router()
const { body, validationResult } = require("express-validator")
const serviceController = require("../controllers/service.controller")

const serviceValidation = [
  body("userId").not().isEmpty().trim().escape(),
  body("code").not().isEmpty().isNumeric(),
  body("description").trim().escape(),
  body("unit").trim().escape(),
  body("price").isNumeric(),
  body("tax").isNumeric(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    console.log(req.body)
    next()
  },
]

router.post("/", serviceValidation, serviceController.create)
router.get("/:id", serviceController.read)
router.put("/:id", serviceValidation, serviceController.update)
router.delete("/:id", serviceController.delete)

module.exports = router
