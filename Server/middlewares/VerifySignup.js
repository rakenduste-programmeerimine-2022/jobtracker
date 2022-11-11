const db = require("../Models")
const User = db.user;

checkEmailDuplicate = (req, res, next) => {

    console.log(req.body)

    User.findOne({
        email: req.body.email
    }).exec((err, user) => {
        if(err){
            res.status(500).send({message: err});
            return
        }

        if (user) {
            res.status(400).send({ message: "Failed! Email is already in use!" });
            return;
        }

        next();

    })

}

 

    module.exports = checkEmailDuplicate
