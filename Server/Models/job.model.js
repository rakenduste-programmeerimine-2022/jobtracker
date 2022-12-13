const { Schema, model } = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
//const { body, validationResult } = require("express-validator")

const jobSchema = new Schema(
  {
    userId: { type: String, required: true },
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    description: { type: String, required: true },
    unit: { type: String, required: true },
    price: { type: Number, required: true },
    tax: { type: Number, enum: [0.0, 9.0, 20.0] },
    total: { type: Number },
    dueDate: { type: Date },
    status: { type: String, enum: ["active", "finished"], default: "active" },
    invoiceID: { type: String },
    invoiceNo: { type: String },
  },
  { timestamps: true }
)

// Töö lisamine
jobSchema.statics.addJob = async ({
  userId,
  clientId,
  serviceId,
  description,
  unit,
  price,
  tax,
  total,
  dueDate,
  status,
  invoiceID,
  invoiceNo,
}) => {
  return new Promise(async (resolve, reject) => {
    const newJob = await Job.create({
      userId,
      clientId,
      serviceId,
      description,
      unit,
      price,
      tax,
      total,
      dueDate,
      status,
      invoiceID,
      invoiceNo,
    })

    console.log(newJob)
    //tokenit ei ole vaja panna? */

    newJob.save((err) => {
      if (err) return reject(err)

      resolve(newJob)
    })
  })
}

// Töö lugemine
jobSchema.statics.read = async ({ id }) => {
  const filter = { userId: id }
  return new Promise(async (resolve, reject) => {
    const jobs = await Job.find(filter)
      .populate("clientId")
      .populate("serviceId")
    if (!jobs) reject("töid pole")
    resolve(jobs)
  })
}

// Töö muutmine
jobSchema.statics.update = async ({
  _id,
  userId,
  clientId,
  serviceId,
  description,
  unit,
  price,
  tax,
  total,
  dueDate,
  status,
  invoiceID,
  invoiceNo,
}) => {
  return new Promise(async (resolve, reject) => {
    //muutmine
    const filter = { _id }
    const update = {
      description,
      unit,
      price,
      tax,
      status,
      total,
      dueDate,
      clientId: clientId._id,
      serviceId: serviceId._id,
    }

    Job.findOneAndUpdate(filter, update, {
      returnDocument: "after",
    })
      .populate("clientId")
      .populate("serviceId")
      .then((updateJob) => {
        resolve(updateJob)
        //console.log("klient ", updatedClient)
      })
  })
}

// Töö kustutamine
jobSchema.statics.delete = async ({ id }) => {
  return new Promise(async (resolve, reject) => {
    const filter = { _id: id }
    const deleteJob = await Job.deleteOne(filter)
    if (!deletedJob.acknowledged) {
      reject("Ei õnnestunud kustutada")
      return
    }
    resolve(deleteJob)
  })
}

const Job = model("Job", jobSchema)

module.exports = Job
