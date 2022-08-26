const express = require('express')
const router = express.Router()
const cors = require('cors')
const User = require('../db/user')


router.use(cors({origin: '*'}))
router.use(express.json())
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


router.get('/user/:sq/:id', async (req,res)=> {
    const {linkedUsers, username} = await User.findOne({"_id": req.params.id})
    let docs = await User.find({username: {"$regex": req.params.sq, '$options': 'i'}}).select('username')
    for(let i = 0; i < docs.length; i++){ 
        if(docs[i].username == username) {
            let docs1 = docs.slice()
            docs1.splice(i, 1)
            docs = docs1
        }
    }
    for(let i in linkedUsers) {
        for(let j in docs) {
            if(linkedUsers[i].username == docs[j].username) {
                let docs1 = docs.slice()
                docs1.splice(j, 1)
                docs = docs1
            }
        }
    }
    res.json({docs})
})

router.get('/users/:id', async (req, res) => {
    // get logged userData
    var docs = await User.findById(req.params.id)
    let index = 0
    // loop through each user and check if that user has added them back
    let arr = docs?.linkedUsers
    docs?.linkedUsers.forEach(async ({username, userId}) => {
        var {linkedUsers} = await User.findById(userId)
        let notFound = true;
        if(linkedUsers.length > 0 ) {
            for(let i = 0; i < linkedUsers.length; i++) {
                if(linkedUsers[i].username == docs.username) notFound = false
            }
        }
        if(notFound) {
           console.log(arr.splice(index, 1))
        }
        index += 1
    })
    if(docs == null) {
        res.json({data: []})
        return;
    } 
    res.json(arr)
})


module.exports = router