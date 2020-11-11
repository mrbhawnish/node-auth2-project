const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const router = express.Router();
const Users = require("../users/users-model.js");
const { isValid } = require("../users/users-service");

const {jwtSecret}  = require("../auth/secrets");

router.post("/register", (req, res) => {
    const { username, password } = req.body
    const credentials = {
        username: username,
        password: password
    }

    if(isValid(credentials)){
        const rounds = process.env.BCRYPT_ROUNDS || 8;

        // hash the password
        const hash = bcrypt.hashSync(password, rounds)

        //reset the req password to hash
        credentials.password = hash
        
        //save the user to database
        Users.add(credentials)
        .then(user => {
            res.status(201).json({ data: user })
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
          });
    } else {
        res.status(400).json({ message: "please provide username and password and the password shoud be alphanumeric"})
    }

})

router.post("/login", (req, res) => {
    const {username, password} = req.body;
    const credentials = {
        username: username,
        password: password,
    }
    if(isValid(credentials)){
        //find the user by the specified username in req.body
        Users.findBy({ username: username })
        .then(([user]) => {
            // compare the password input against the pass in db
            if(user && bcrypt.compareSync(password, user.password)){
                const token = generateToken(user)
                res.status(200).json({message: `Welcome to the API ${user.username}`, token})
            } else {
                res.status(401).json({ message: "user does not exist"})
            }
            
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
          });
    } else {
        res.status(400).json({
            message: "please provide a valid username and password",
          });
    }

})

const generateToken = (user) => {
   const payload = {
    subject: user.id,
    username: user.username,
    foo: "bar",
   };

   const options = {
       expiresIn: "25 seconds",
   }
    return jwt.sign(payload, jwtSecret, options)
};

module.exports = router;