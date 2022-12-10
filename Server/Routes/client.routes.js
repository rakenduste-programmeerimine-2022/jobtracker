const express = require("express")
const router = express.Router()
const { body, validationResult } = require("express-validator")
const clientController = require("../controllers/client.controller")

router.post(
  "/",
  body("userId").not().isEmpty().trim().escape(),
  body("name").not().isEmpty().trim().escape(),
  body("regcode").isNumeric(),
  body("vatno").not().isEmpty().trim().escape(),
  body("address").not().isEmpty().trim().escape(),
  body("term").isNumeric(),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    User.create({
      username: req.body.username,
      password: req.body.password,
    }).then((user) => res.json(user))
  }
)

router.post("/", clientController.create)
router.get("/:id?", clientController.read)
router.put("/:id", clientController.update)
router.delete("/:id", clientController.delete)

module.exports = router
