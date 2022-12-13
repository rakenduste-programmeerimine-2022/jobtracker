const express = require("express")
const router = express.Router()
const { body, validationResult } = require("express-validator")
const jobController = require("../controllers/job.controller")

const jobValidation = [
  body("userId").not().isEmpty().trim().escape(),
  body("clientId").not().isEmpty().trim().escape(),
  body("serviceId").not().isEmpty().trim().escape(),
  body("description").not().isEmpty().escape(),
  body("unit").not().isEmpty().trim().escape(),
  body("price").isNumeric(),
  body("total").isNumeric(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    console.log(req.body)
    next()
  },
]

router.post("/", jobValidation, jobController.create)
router.get("/:id?", jobController.read)
router.put("/:id", jobValidation, jobController.update)
router.delete("/:id", jobController.delete)

module.exports = router