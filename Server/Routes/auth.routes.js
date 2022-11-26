const verifySignUp = require("../middlewares")
const controller = require("../controllers/auth.controller")
const { body, validationResult } = require("express-validator")

module.exports = async function (app) {
  await app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "origin, Content-Type, Accept")
    next()
  })

  app.post(
    "/auth/signup",
    body("email").isEmail().normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .matches("^(?=.*?[A-Z])(?=.*?[0-9]).{8,}$"),
    (req, res, next) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        })
      }

      next()
    },
    verifySignUp.verifySignUp,
    controller.signup
  )
  app.post("/auth/signin", controller.signin)
  app.post("/auth/signout", controller.signout)
}
