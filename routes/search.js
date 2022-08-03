const express = require('express')
const router = express.Router()
const cors = require('cors')
const User = require('../db/user')


router.use(cors({origin: '*'}))
router.use(express.json())

router.get('/user/:sq/:id', async (req,res)=> {
    const {linkedUsers} = await User.findOne({"_id": req.params.id})
    let docs = await User.find({username: {"$regex": req.params.sq, '$options': 'i'}}).select('username')
    console.log(docs)
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

module.exports = router