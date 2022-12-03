const mongoose = require("mongoose")
const ObjectId = require("mongodb").ObjectID

const serviceSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    unit: { type: String, required: true },
    price: { type: Number, required: true },
    tax: {
      type: String,
      enum: ["0.0", "9.0", "20.0"],
      default: "20.0",
    },
  },
  { timestamps: true }
)

const Item = mongoose.model("Service", serviceSchema)

exports.create = async (req, res) => {
  const { userId, code, description, unit, price, tax } = req.body
  console.log(req)

  const codeExists = await Item.findOne({ code })
  if (codeExists) {
    res.status(499).send("Kood juba võetud")
  } else {
    const item = await Item.create(
      { userId, code, description, unit, price, tax },
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

exports.read = async (req, res) => {
  let id = req.params?.id
  const userId = req.query?.userId
  console.log(req.query)

  if (id !== undefined) {
    const item = await Item.findOne({ _id: ObjectId(id) })
    console.log(item)
    res.send(item)
  } else {
    const items = await Item.find({ userId })
    res.send(items)
  }
}

exports.update = async (req, res) => {
  const { userId, code, description, unit, price, tax } = req.body
  const { id } = req.params
  console.log(id)
  const filter = { _id: ObjectId(id) }
  const update = { userId, code, description, unit, price, tax }

  const codeExists = await Item.findOne({ code })
  let canProceed = true

  if (codeExists !== null) {
    console.log(codeExists)
    if (codeExists._id.toString() !== id) {
      canProceed = false
    }
  }

  if (!canProceed) {
    res.status(499).send("Kood juba võetud")
    console.log("499")
  } else {
    Item.findOneAndReplace(
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
