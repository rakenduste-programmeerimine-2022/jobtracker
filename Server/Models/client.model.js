const { Schema, model } = require("mongoose")

const clientSchema = new Schema(
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

// Kliendi lisamine
clientSchema.statics.addClient = async ({
  userId,
  name,
  regcode,
  vatno,
  address,
  term,
}) => {
  return new Promise(async (resolve, reject) => {
    const nameExists = await Client.findOne({
      userId,
      name,
    })
    const regcodeExists = await Client.findOne({
      userId: userId,
      regcode: regcode,
    })

    let vatnoExists = null
    if (vatno.length > 0)
      vatnoExists = await Client.findOne({
        userId: userId,
        vatno: vatno,
      })

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
      reject({ errors: errorMsg })
      return
    }

    const newClient = await Client.create({
      userId,
      name,
      regcode,
      vatno,
      address,
      term,
    })

    //tokenit ei ole vaja panna? */

    newClient.save((err) => {
      if (err) return reject(err)
      resolve(newClient)
    })
  })
}

// Kliendi lugemine
clientSchema.statics.read = async ({ id }) => {
  const filter = { userId: id }
  return new Promise(async (resolve, reject) => {
    const clients = await Client.find(filter)
    if (!clients) reject("kliente pole")
    resolve(clients)
  })
}

// Kliendi muutmine
clientSchema.statics.update = async ({
  _id,
  userId,
  name,
  regcode,
  vatno,
  address,
  term,
}) => {
  return new Promise(async (resolve, reject) => {
    //kontroll
    const nameExists = await Client.findOne({
      userId: userId,
      name: name,
      _id: { $ne: _id },
    })

    const regcodeExists = await Client.findOne({
      userId: userId,
      regcode: regcode,
      _id: { $ne: _id },
    })

    let vatnoExists = null
    if (vatno.length > 0)
      vatnoExists = await Client.findOne({
        userId: userId,
        vatno: vatno,
        _id: { $ne: _id },
      })

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
      reject({ errors: errorMsg })
      return
    }

    //muutmine
    const filter = { _id }
    const update = { name, regcode, vatno, address, term }

    Client.findOneAndUpdate(filter, update, {
      returnDocument: "after",
    }).then((updatedClient) => {
      resolve(updatedClient)
    })
  })
}

// Kliendi kustutamine
clientSchema.statics.delete = async ({ id }) => {
  return new Promise(async (resolve, reject) => {
    const filter = { _id: id }
    const deletedClient = await Client.deleteOne(filter)
    if (!deletedClient.acknowledged) {
      reject("Ei õnnestunud kustutada")
      return
    }
    resolve(deletedClient)
  })
}

const Client = model("Client", clientSchema)

module.exports = Client
