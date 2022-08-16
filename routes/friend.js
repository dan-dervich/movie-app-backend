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

router.post('/add-friend/:id/:username', async (req,res)=> {
    const docs = await User.updateOne({_id: req.body._id}, {$addToSet: {"linkedUsers": [{username: req.params.username, userId: req.params.id}]}})
    if(docs.matchedCount == 1 && docs.modifiedCount == 1) {
        res.json({status: true})
        return;
    }
    res.json({status: false})
})

router.post('/remove/:userID/:id', async (req, res)=> {
    const removeFriend = await User.updateOne({'_id': req.params.userID}, {$unset: {'linkedUsers':  {'_id': req.body._id}}})
    const removeFromFriendsList = await User.updateOne({'_id': req.params.id}, {$unset: {'linkedUsers':  {'userId': req.params.userID}}})
    console.log(removeFriend)
    console.log(removeFromFriendsList)
    res.json({status: true})
})



module.exports = router