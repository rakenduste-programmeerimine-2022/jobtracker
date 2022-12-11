const Job = require("../models/job.model")

exports.create = async (req, res) => {
  Job.addJob(req.body)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(400).send(err)
    })
}

exports.read = async (req, res) => {
  Job.read(req.body)
    .then((data) => res.send(data))
    .catch((err) => res.status(400).send(err))
}

exports.update = async (req, res) => {
  Job.update(req.body)
    .then((data) => res.send(data))
    .catch((err) => res.status(400).send(err))
}

exports.delete = async (req, res) => {
  Job.delete(req.params)
    .then((data) => res.send(data))
    .catch((err) => res.status(400).send(err))
}