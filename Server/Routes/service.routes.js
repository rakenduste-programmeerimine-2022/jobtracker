const express = require("express")
const router = express.Router()
const serviceController = require("../controllers/service.controller")

// middleware that is specific to this router
// router.use((req, res, next) => {
//   console.log("Time: ", Date.now())
//   next()
// })

// const getMiddleware = (req, res, next) => {
//   console.log("Getting DB result for req.user")
//   next()
// }

router.post("/", serviceController.create)
router.get("/:id?", serviceController.read)
router.put("/:id", serviceController.update)
router.delete("/:id", serviceController.delete)

module.exports = router
