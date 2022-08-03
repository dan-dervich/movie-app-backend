const express = require('express')
const router = express.Router()
const cors = require('cors')
const User = require('../db/user')
const jwt = require('jsonwebtoken')
const { hashPWD, comparePWD } = require('../encrypt')


router.use(cors({origin: '*'}))
router.use(express.json())

router.post('/login', async (req,res)=> {
    const checkEmailAndUsername = await User.findOne({"email": req.body.email})
    if(checkEmailAndUsername?.email !== req.body.email) {
        res.json({status: 'userNotFound'})
        return;
    }
    const compare = await comparePWD(req.body.password, checkEmailAndUsername.password)
    if(!compare) {
        res.json({status: 'passwordsDontMatch'})
        return;
    } 
    const payload = {
        email: req.body.email,
        Username: checkEmailAndUsername.username,
        ID: checkEmailAndUsername._id,
    }
    const token = await jwt.sign({
        payload
    },
        "078fcc13c}84$f6c923c89394{bbd0#e", {
        algorithm: 'HS256'
    },
    )
    res.json({
        "status": "everythingIsFine",
        "token": token
    })
})

router.post('/sign-up', async (req,res)=> {
    const checkEmail = await User.findOne({"email": req.body.email})
    const checkUser = await User.findOne({"username": req.body.username})
    if(checkEmail?.email == req.body.email) {
        res.json({"status": "emailAlreadyInUse"})
        return;
    }
    if(checkUser?.username == req.body.username) {
        res.json({"status": "usernameAlreadyInUse"})
        return;
    }
    const password = await hashPWD(req.body.password)
    if (password == false) {
        res.json({
            "status": "errorHashingPassword"
        })
        return;
    }
    const docs = new User({
        username: req.body.username,
        email: req.body.email,
        password: password
    })
    docs.save(async (err, user) => {
        if (err) {
            res.json({
                "status": "errorSavingUser"
            })
            return
        } else {
            const payload = {
                email: req.body.email,
                Username: req.body.username,
                ID: user._id,
            }
            const token = await jwt.sign({
                payload
            },
                "078fcc13c}84$f6c923c89394{bbd0#e", {
                algorithm: 'HS256'
            },
            )
            res.json({
                "status": "userCreatedSuccessfully",
                "jwtToken": token
            })
            return
        }
    })
})

module.exports = router