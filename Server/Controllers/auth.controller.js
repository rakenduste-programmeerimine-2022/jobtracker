const db = require("../models")
const ObjectId = require("mongodb").ObjectID
const dotenv = require("dotenv")
const User = db.user
dotenv.config()

var jwt = require("jsonwebtoken")
var bcrypt = require("bcrypt")

exports.signup = (req, res) => {
  var regNumber = req.body.regNumber

  const user = new User({
    name: req.body.name,
    surname: req.body.surname,
    businessName: req.body.businessName,
    regNumber: regNumber,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })

  user.save((err) => {
    if (err) {
      res.status(500).send({ message: err })
      return
    }

    res.send({ message: "User was registered successfully!" })
  })
}

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err })
      return
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." })
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password)

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid Password!" })
    }

    var token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: 2 * 60 * 60 * 1000, // 2 hours
      }
    )

    req.session.token = token

    //console.log(req.session.token)

    res.status(200).send({
      id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
    })
  })
}

exports.tokencheck = async (req, res) => {
  let token = req.session.token
  //console.log(token)
  try {
    if (!token) {
      return res.status(200).send({ success: false })
    } else {
      return res.status(200).send({ success: true })
    }
  } catch (err) {
    this.next(err)
  }
}

exports.signout = async (req, res) => {
  try {
    req.session = null
    return res.status(200).send({ message: "You've been signed out!" })
  } catch (err) {
    this.next(err)
  }
}

//vaja teha
exports.update = async (req, res) => {
  const {
    name,
    surname,
    email,
    businessName,
    regNumber,
    vat,
    address,
    iban,
    password,
  } = req.body

  hashedPassword = bcrypt.hashSync(password, 8)

  const { id } = req.params
  console.log(id)
  const filter = { _id: ObjectId(id) }
  const update = {
    name,
    surname,
    email,
    businessName,
    regNumber,
    vat,
    address,
    iban,
    password: hashedPassword,
  }

  // const regNumberExists = await User.findOne({ regNumber })
  let canProceed = true

  /*   if (regNumberExists !== null) {
    console.log(regNumberExists)
    if (regNumberExists._id.toString() !== id) {
      canProceed = false
    }
  } */

  if (!canProceed) {
    res.status(499).send("Registreerimiskood on juba kasutusel")
    console.log("499")
  } else {
    User.findOneAndReplace(
      filter,
      update,
      {
        returnDocument: "after",
      },
      function (err, result) {
        if (err) {
          res.send(err)
        } else {
          res.status(200).send(result)
        }
      }
    )
  }
}
