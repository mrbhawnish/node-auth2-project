const router = require("express").Router();
const protected = require("../auth/restricted-middleware");
const Users = require("./users-model.js");

router.get("/", protected, (req, res) => {
    Users.find()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(err => {
        res.status(500).json({message: err.message})
    })

})

module.exports = router