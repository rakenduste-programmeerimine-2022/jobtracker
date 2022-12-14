const Client = require("../models/client.model")

exports.create = async (req, res) => {
  Client.addClient(req.body)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(400).send(err)
    })
}

exports.read = async (req, res) => {
  Client.read(req.params)
    .then((data) => res.send(data))
    .catch((err) => res.status(400).send(err))
}

exports.update = async (req, res) => {
  Client.update(req.body)
    .then((data) => res.send(data))
    .catch((err) => res.status(400).send(err))
}

exports.delete = async (req, res) => {
  Client.delete(req.params)
    .then((data) => res.send(data))
    .catch((err) => rres.status(400).send(err))
}
