const mongoose = require("mongoose")
const ObjectId = require("mongodb").ObjectID

const clientSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    regcode: { type: String, required: true, unique: true },
    vatno: { type: String, unique: true },
    address: { type: String },
    term: { type: Number, default: 14.0 },
  },
  { timestamps: true }
)

const Item = mongoose.model("Client", clientSchema)

exports.create = async (req, res) => {
  const { userId, name, regcode, vatno, address, term } = req.body

  const nameExists = await Item.findOne({ name })
  const regcodeExists = await Item.findOne({ regcode })
  const vatnoExists = await Item.findOne({ vatno })

  if (nameExists) {
    res.status(499).send("Nimi on juba võetud")
  } else if (regcodeExists) {
    res.status(498).send("Reg on juba võetud")
  } else if (vatnoExists) {
    res.status(497).send("KMKR nr on juba võetud")
  } else {
    const item = await Item.create(
      { userId, name, regcode, vatno, address, term },
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
  /*  let id = req.params?.id
  const userId = req.query?.userId
  console.log(req.query)

  if (id !== undefined) {
    const item = await Item.findOne({ _id: ObjectId(id) })
    console.log(item)
    res.send(item)
  } else {
    const items = await Item.find({ userId })
    res.send(items)
  } */
}

exports.update = async (req, res) => {
  /* const { userId, code, description, unit, price, tax } = req.body
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
  } */
}

exports.delete = async (req, res) => {
  /*  const { id } = req.params
  const filter = { _id: id }
  const item = await Item.deleteOne(filter)
  res.send(item) */
}
