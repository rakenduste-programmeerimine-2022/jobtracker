const verifySignUp = require("../middlewares")
const controller = require("../controllers/auth.controller")
const { body, validationResult } = require("express-validator")
const cors = require("cors")

module.exports = async function (app) {
  let corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
  }

  await app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", true)
    res.header("Access-Control-Allow-Origin", "http://localhost:3000")
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
    res.header(
      "Access-Control-Allow-Headers",
      "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
    )
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
  app.get("/auth/signout", controller.signout)
  app.get("/auth/tokencheck", controller.tokencheck)
  app.put("/auth/user/:id?", controller.update)
}
