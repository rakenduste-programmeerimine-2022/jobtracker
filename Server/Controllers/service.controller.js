const Service = require("../models/service.model")

exports.create = async (req, res) => {
  Service.add(req.body)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(400).send(err)
    })
}

exports.read = async (req, res) => {
  Service.read(req.body)
    .then((data) => res.send(data))
    .catch((err) => res.status(400).send(err))
}

exports.update = async (req, res) => {
  Service.update(req.body)
    .then((data) => res.send(data))
    .catch((err) => res.status(400).send(err))
}

exports.delete = async (req, res) => {
  Service.delete(req.params)
    .then((data) => res.send(data))
    .catch((err) => rres.status(400).send(err))
}

// const mongoose = require("mongoose")

// const serviceSchema = new mongoose.Schema(
//   {
//     userId: { type: String, required: true },
//     code: { type: String, required: true },
//     description: { type: String, required: true },
//     unit: { type: String, required: true },
//     price: { type: Number, required: true },
//     tax: {
//       type: Number,
//       enum: [0.0, 9.0, 20.0],
//       default: 20.0,
//     },
//   },
//   { timestamps: true }
// )

// const Item = mongoose.model("Service", serviceSchema)

// exports.create = async (req, res) => {
//   const { userId, code, description, unit, price, tax } = req.body

//   const codeExists = await Item.findOne({ userId: userId, code: code })

//   let errorMsg = []
//   if (codeExists) {
//     errorMsg.push({ code: 499, title: "Kood on juba võetud" })
//   }

//   if (errorMsg.length > 0) {
//     res.status(400).send(errorMsg)
//     console.log(errorMsg)
//   } else {
//     const item = await Item.create(
//       { userId, code, description, unit, price, tax },
//       function (err, result) {
//         if (err) {
//           res.send(err)
//         } else {
//           console.log(result)
//           res.send(result)
//         }
//       }
//     )
//   }
// }

// exports.read = async (req, res) => {
//   const userId = req.query?.userId
//   const items = await Item.find({ userId })
//   res.send(items)
// }

// exports.update = async (req, res) => {
//   const { userId, code, description, unit, price, tax } = req.body
//   const { id } = req.params
//   //console.log(id)
//   const filter = { _id: id }
//   const update = { userId, code, description, unit, price, tax }

//   const codeExists = await Item.findOne({
//     userId: userId,
//     code: code,
//     _id: { $ne: id },
//   })

//   let errorMsg = []
//   if (codeExists) {
//     errorMsg.push({ code: 499, title: "Kood juba võetud" })
//   }

//   if (errorMsg.length > 0) {
//     res.status(400).send(errorMsg)
//     console.log(errorMsg)
//   } else {
//     Item.findOneAndReplace(
//       filter,
//       update,
//       {
//         returnDocument: "after",
//       },
//       function (err, result) {
//         if (err) {
//           res.send(err)
//         } else {
//           res.send(result)
//         }
//       }
//     )
//   }
// }

// exports.delete = async (req, res) => {
//   const { id } = req.params
//   const filter = { _id: id }
//   const item = await Item.deleteOne(filter)
//   res.send(item)
// }
