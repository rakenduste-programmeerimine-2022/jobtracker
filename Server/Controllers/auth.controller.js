const db = require("../models")
const dotenv = require("dotenv")
const User = db.user
dotenv.config()

var jwt = require("jsonwebtoken")
var bcrypt = require("bcrypt")

exports.signup = (req, res) => {
  const user = new User({
    name: req.body.name,
    surname: req.body.surname,
    businessName: req.body.businessName,
    regNumber: req.body.regNumber,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    iban: req.body.iban,
  })

  console.log(user.password)

  user.save((err) => {
    if (err) {
      res.send({ message: err })
      return
    }

    const token = jwt.sign(
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

    res.status(200).send({
      id: user._id,
      user: {
        name: user.name,
        surname: user.surname,
        email: user.email,
        businessName: user.businessName,
        regNumber: user.regNumber,
        vat: user.vat,
        address: user.address,
        iban: user.iban,
      },
    })
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

    res.status(200).send({
      id: user._id,
      user: {
        name: user.name,
        surname: user.surname,
        email: user.email,
        businessName: user.businessName,
        regNumber: user.regNumber,
        vat: user.vat,
        address: user.address,
        iban: user.iban,
      },
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
    return res.send({ success: true })
  } catch (err) {
    this.next(err)
  }
}

exports.update = async (req, res) => {
  const { id } = req.params
  const filter = { _id: id }
  let content = req.body
  if (content.password !== undefined)
    content.password = bcrypt.hashSync(content.password, 8)

  User.findOneAndUpdate(
    filter,
    content,
    {
      returnDocument: "after",
    },
    function (err, result) {
      if (err) {
        res.send(err)
      } else {
        res.send(result)
      }
    }
  )
}
