const db = require("../models")
const ObjectId = require("mongodb").ObjectID
const dotenv = require("dotenv")
const User = db.user
dotenv.config()

var jwt = require("jsonwebtoken")
var bcrypt = require("bcrypt")

exports.signup = (req, res) => {
  // try {
  //   const user = new User({
  //     name: req.body.name,
  //     surname: req.body.surname,
  //     email: req.body.email,
  //     password: bcrypt.hashSync(req.body.password, 8),
  //     businessName: req.body.businessName,
  //     regNumber: req.body.regNumber,
  //     /*       address: req.body.address,
  //     vat: req.body.vat,
  //     iban: req.body.iban, */
  //   })

  //   user.save({
  //     /* name: user.name,
  //     surname: user.surname,
  //     email: user.email,
  //     businessName: user.businessName,
  //     regNumber: user.regNumber, */
  //     /*       vat: user.vat,
  //     address: user.address,
  //     iban: user.iban, */
  //   })

  //   console.log(user)

  //   const token = jwt.sign(
  //     {
  //       id: user._id,
  //       name: user.name,
  //       surname: user.surname,
  //       email: user.email,
  //     },
  //     process.env.SECRET_KEY,
  //     {
  //       expiresIn: 2 * 60 * 60 * 1000, // 2 hours
  //     }
  //   )
  //   req.session.token = token
  //   console.log(req.session.token)

  //   res.status(200).send({
  //     id: user._id,
  //     user: {
  //       name: user.name,
  //       surname: user.surname,
  //       email: user.email,
  //       businessName: user.businessName,
  //       regNumber: user.regNumber,
  //       vat: user.vat,
  //       address: user.address,
  //       iban: user.iban,
  //     },
  //   })
  // } catch (error) {
  //   res.status(500).send({ message: error.message })
  // }

  const user = new User({
    name: req.body.name,
    surname: req.body.surname,
    businessName: req.body.businessName,
    regNumber: req.body.regNumber,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    iban: req.body.iban,
  })

  user.save((err) => {
    if (err) {
      res.status(500).send({ message: err })
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

    console.log("1: ", req.session.token)
    console.log(JSON.stringify(req.headers))

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
    //console.log("2: ", req.session.token)
  })

  //console.log("3: ", req.session.token)
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
    //console.log(JSON.stringify(req.headers))

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
  console.log(token)
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
  const { id } = req.params
  //console.log(id)
  const filter = { _id: ObjectId(id) }
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
        res.status(200).send(result)
      }
    }
  )
}
