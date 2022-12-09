const mongoose = require("mongoose")
const ObjectId = require("mongodb").ObjectID

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

  const nameExists = await Item.findOne({ userId: userId, name: name })
  const regcodeExists = await Item.findOne({ userId: userId, regcode: regcode })
  //const vatnoExists = await Item.findOne({ userId: userId, vatno: vatno })

  if (nameExists) {
    res.status(499).send("Nimi on juba võetud")
  } else if (regcodeExists) {
    res.status(498).send("Reg on juba võetud")
    /*
  }
     if (vatnoExists) {
    res.status(497).send("KMKR nr on juba võetud")
  */
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
  const { name, regcode, vatno, address, term } = req.body
  const { id } = req.params
  const filter = { _id: id }
  const update = { name, regcode, vatno, address, term }

  const codeExists = await Item.findOne({ regcode })
  let canProceed = true

  if (codeExists !== null) {
    console.log(codeExists)
    if (codeExists._id.toString() !== id) {
      canProceed = false
    }
  }

  if (!canProceed) {
    res.status(499).send("Registrikood juba võetud")
    console.log("499")
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
