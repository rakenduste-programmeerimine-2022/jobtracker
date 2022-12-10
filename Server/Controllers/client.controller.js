const mongoose = require("mongoose")
const { body, validationResult } = require("express-validator")

const clientSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    regcode: { type: String, required: true },
    vatno: { type: String },
    address: { type: String },
    term: { type: Number, default: 14.0 },
  },
  { timestamps: true }
)

const Item = mongoose.model("Client", clientSchema)

exports.create = async (req, res) => {
  const { userId, name, regcode, vatno, address, term } = req.body

  /*   body('name').not().isEmpty().trim().escape(),
  body('regcode').isNumber(),
  body('term').isEmail(), */

  const nameExists = await Item.findOne({ userId: userId, name: name })
  const regcodeExists = await Item.findOne({ userId: userId, regcode: regcode })

  let vatnoExists = null
  if (vatno.length > 0)
    vatnoExists = await Item.findOne({ userId: userId, vatno: vatno })

  let errorMsg = []
  if (nameExists) {
    errorMsg.push({ code: 499, title: "Nimi on juba võetud" })
  }
  if (regcodeExists) {
    errorMsg.push({ code: 498, title: "Reg on juba võetud" })
  }
  if (vatnoExists) {
    errorMsg.push({ code: 497, title: "KMKR nr on juba võetud" })
  }

  if (errorMsg.length > 0) {
    res.status(400).send(errorMsg)
    console.log(errorMsg)
  } else {
    const item = await Item.create(
      { userId, name, regcode, vatno, address, term },
      function (err, result) {
        if (err) {
          res.send(err)
          console.log(err)
        } else {
          console.log(result)
          res.send(result)
        }
      }
    )
  }
}

exports.read = async (req, res) => {
  const userId = req.query?.userId
  const items = await Item.find({ userId })
  res.send(items)
}

exports.update = async (req, res) => {
  const { userId, name, regcode, vatno, address, term } = req.body
  const { id } = req.params
  const filter = { _id: id }
  const update = { name, regcode, vatno, address, term }

  const nameExists = await Item.findOne({
    userId: userId,
    name: name,
    _id: { $ne: id },
  })
  const regcodeExists = await Item.findOne({
    userId: userId,
    regcode: regcode,
    _id: { $ne: id },
  })

  let vatnoExists = null
  if (vatno.length > 0)
    vatnoExists = await Item.findOne({
      userId: userId,
      vatno: vatno,
      _id: { $ne: id },
    })

  console.log(nameExists)

  let errorMsg = []
  if (nameExists) {
    errorMsg.push({ code: 499, title: "Nimi on juba võetud" })
  }
  if (regcodeExists) {
    errorMsg.push({ code: 498, title: "Reg on juba võetud" })
  }
  if (vatnoExists) {
    errorMsg.push({ code: 497, title: "KMKR nr on juba võetud" })
  }

  if (errorMsg.length > 0) {
    res.status(400).send(errorMsg)
    console.log(errorMsg)
  } else {
    Item.findOneAndUpdate(
      filter,
      update,
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
}

exports.delete = async (req, res) => {
  const { id } = req.params
  const filter = { _id: id }
  const item = await Item.deleteOne(filter)
  res.send(item)
}
