const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config()

function generateAccessToken(email) {
  return jwt.sign(email, process.env.TOKEN_SECRET, { expiresIn: "1800s" })
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, require: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    businessName: { type: String },
    regNumber: { type: Number },
    address: { type: String },
    vat: { type: String },
    iban: { type: String },
    deleteDate: { type: Date },
  },
  { timestamps: true }
)

userSchema.statics.signup = async ({
  name,
  surname,
  businessName,
  regNumber,
  address,
  email,
  password,
}) => {
  return new Promise(async (resolve, reject) => {
    const user = await User.findOne({ email })
    if (user) reject("User already exists")

    const hashPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      name,
      surname,
      businessName,
      regNumber,
      address,
      email,
      password: hashPassword,
      registerDate: new Date(),
      deleteDate: null,
    })

    newUser.save((err) => {
      if (err) return reject(err)
      resolve(newUser)
    })
  })
}

userSchema.statics.login = async ({ email, password }) => {
  return new Promise(async (resolve, reject) => {
    const user = await User.findOne({ email })
    console.log(user)
    let loginStatus = ""
    if (!user) reject("This email or password is incorrect")

    const checkPassword = await bcrypt.compare(password, user.password)

    const token = generateAccessToken({ name: user.name, email: user.email })

    console.log(token)

    if (checkPassword) {
      loginStatus = "You are successfully logged in."
    } else {
      loginStatus = "This email or password is incorrect'"
    }

    resolve(loginStatus)
  })
}

module.exports = mongoose.model("User", userSchema)
