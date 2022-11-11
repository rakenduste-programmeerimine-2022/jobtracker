const db = require("../Models");
const User = db.user;
const dotenv = require('dotenv')
dotenv.config();

var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

exports.signup = (req, res) => {

    var regNumber = req.body.regNumber
    

    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        businessName: req.body.businessName,
        regNumber: regNumber,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        registerDate: new Date(),
    })

    user.save((err) => {
        if(err) {
            res.status(500).send({message: err})
            return
        }

        res.send({ message: "User was registered successfully!" });
    })
}

exports.signin = (req, res) => {
    User.findOne({
        email: req.body.email,
      })
      .exec((err, user) => {
        if(err) {
            res.status(500).send({ message: err });
            return;
        }

        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({ message: "Invalid Password!" });
        }

        var token = jwt.sign({
            id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email
        }, process.env.SECRET_KEY, {
            expiresIn: 2 * 60 * 60 * 1000, // 2 hours
        });


        req.session.token = token

        res.status(200).send({
            id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email
        })

      })
}

exports.signout = async(req,res) => {
    try{
        req.session = null;
        return res.status(200).send({message: "You've been signed out!"})
    }catch(err){
        this.next(err)
    }
}