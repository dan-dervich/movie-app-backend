const express = require('express')
const router = express.Router()
const cors = require('cors')
const User = require('../db/user')

router.use(cors({origin: '*'}))
router.use(express.json())


router.post('/add-friend/:id', async (req,res)=> {
    const docs = await User.updateOne({_id: req.params.id}, {$addToSet: {"linkedUsers": [{username: req.body.username, userId: req.body._id}]}})
    console.log(docs)
    if(docs.matchedCount == 1 && docs.modifiedCount == 1) {
        res.json({status: true})
        return;
    }
    res.json({status: false})
})


module.exports = router