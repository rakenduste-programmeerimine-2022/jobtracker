const { Schema, model } = require("mongoose")

const serviceSchema = new Schema(
  {
    userId: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String, required: true },
    unit: { type: String, required: true },
    price: { type: Number, required: true },
    tax: {
      type: Number,
      enum: [0.0, 9.0, 20.0],
      default: 20.0,
    },
  },
  { timestamps: true }
)

// Teenuse lisamine
serviceSchema.statics.add = async ({
  userId,
  code,
  description,
  unit,
  price,
  tax,
}) => {
  return new Promise(async (resolve, reject) => {
    const codeExists = await Service.findOne({ userId: userId, code: code })

    let errorMsg = []
    if (codeExists) {
      errorMsg.push({ code: 499, title: "Kood on juba võetud" })
    }

    if (errorMsg.length > 0) {
      reject({ errors: errorMsg })
      return
    }

    const newService = await Service.create({
      userId,
      code,
      description,
      unit,
      price,
      tax,
    })

    //tokenit ei ole vaja panna? */

    newService.save((err) => {
      if (err) return reject(err)
      resolve(newService)
    })
  })
}

// Teenuse lugemine
serviceSchema.statics.read = async () => {
  return new Promise(async (resolve, reject) => {
    const services = await Service.find()
    if (!services) reject("teenuseid pole")
    resolve(services)
  })
}

// Teenuse muutmine
serviceSchema.statics.update = async ({
  _id,
  userId,
  code,
  description,
  unit,
  price,
  tax,
}) => {
  return new Promise(async (resolve, reject) => {
    //kontroll
    const codeExists = await Service.findOne({
      userId: userId,
      code: code,
      _id: { $ne: _id },
    })

    let errorMsg = []
    if (codeExists) {
      errorMsg.push({ code: 499, title: "Kood juba võetud" })
    }

    if (errorMsg.length > 0) {
      reject({ errors: errorMsg })
      return
    }

    //muutmine
    const filter = { _id: _id }
    const update = { code, description, unit, price, tax }

    Service.findOneAndUpdate(filter, update, {
      returnDocument: "after",
    }).then((updatedService) => {
      resolve(updatedService)
    })
  })
}

// Teenuse kustutamine
serviceSchema.statics.delete = async ({ id }) => {
  return new Promise(async (resolve, reject) => {
    const filter = { _id: id }
    const deletedService = await Service.deleteOne(filter)
    if (!deletedService) {
      reject("Ei õnnestunud kustutada")
      return
    }
    resolve(deletedService)
  })
}

const Service = model("Service", serviceSchema)

module.exports = Service
