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
  Service.read(req.params)
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
    .catch((err) => res.status(400).send(err))
}
