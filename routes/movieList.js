const express = require('express')
const router = express.Router()
const cors = require('cors')
const movieList = require('../db/movieList')
const User = require('../db/user')

router.use(cors({origin: '*'}))
router.use(express.json())
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


router.post('/add', async (req,res)=>{ 
    const docs = new movieList({
        users: req.body.users,
        listAdmin: req.body.users[req.body.users.length-1],
        movieListName: req.body.movieListName,
    })
    docs.save()
    req.body.users.forEach(async username => {
        const docs1 = await User.updateOne({username: username}, {$addToSet: { movieLists: docs._id}})
        console.log(docs1)
    });
    res.json({status: true})
})

router.post('/add-movies', async (req,res)=>{
    console.log(req.body)
    for(let j = 0; j < req.body.length; j++) { 
        const docs = await movieList.updateOne({_id: req.body[j].listId}, {$addToSet: {movieList: {movieId: req.body[j].movieId, agreedToWatch: []}}})
        const user = await movieList.findOne({_id: req.body[j].listId})
        let _id;
        console.log(docs)
        for(let i = 0; i < user.movieList.length; i++) { 
            if(req.body[j].movieId == Number(user.movieList[i].movieId)) {
                _id = user.movieList[i]._id
            }
        }
        for(let i = 0; i < user.users.length; i++) {
                const docs1 = await movieList.updateOne({"movieList._id": _id}, {$addToSet: { "movieList.$.agreedToWatch": {username: user.users[i], agreedToWatch: false}}}) 
                console.log("docs1", docs1)
            }
        }
    res.json({status: true})
})

router.get('/get/:username', async (req,res) => {
    const docs = await User.findOne({username: req.params.username})
    let arr = []
    console.log(docs);
    for(let i = 0; i < docs?.movieLists?.length; i++){
        const docs1 = await movieList.findById(docs.movieLists[i])
        arr.push(docs1)
    }
    res.json(arr)
})

router.post('/remove-friend', async (req, res)=> {
    const {listAdmin} = await movieList.findOne({_id: req.body.listId})
    for(let i in req.body.userP) {
        if(listAdmin != req.body.userP[i]) {
            const removeFromUserList = await User.updateOne({username: req.body.userP[i]}, {$pull: {movieLists: req.body.listId}})
            const docs = await movieList.updateOne({_id: req.body.listId}, {$pull: {users: req.body.userP[i]}})
            console.log(docs)
            console.log(removeFromUserList)
        }
    }
    res.json({status: true})
})

router.post('/remove', async (req,res)=> {
    const removeUsers = await movieList.findOne({_id: req.body._id})
    for(let i = 0; i< removeUsers.users.length; i++) {
        const r = await User.updateOne({username: removeUsers.users[i]}, {$pull: {movieLists: removeUsers._id}})
        console.log(r)
    }
    const docs = await movieList.deleteOne({_id: req.body._id})
    console.log(docs);
    res.json({status: true})
})

router.get('/id/:id', async (req,res)=> {
    const docs = await movieList.findById(req.params.id).select('movieList')
    res.json(docs)
})

router.post('/remove-from-list/:id', async (req,res)=>{
    const docs = await movieList.updateOne({_id: req.params.id}, {$pull: {movieList: {movieId: req.body.movieId+''}}})
    console.log(docs)
    res.json({status: true})
})

router.post('/agree-to-watch/:id', async (req,res)=> {
    console.log(req.body.agreedToWatchId)
    const docs = await movieList.findOne({"_id": req.params.id})
    if(docs !== null) {
        let obj = JSON.parse(JSON.stringify(docs));
        for(let i = 0; i < obj.movieList.length; i++) {
            for(let j = 0; j < obj.movieList[i].agreedToWatch.length; j++) {
                if(obj.movieList[i].agreedToWatch[j]._id == req.body.agreedToWatchId) {
                    if(obj.movieList[i].agreedToWatch[j].username == req.body.username) {
                        console.log("HEYY")
                        obj.movieList[i].agreedToWatch[j].agreedToWatch = req.body.aw;
                    }
            } 
        }
    }
    const docs1 = await movieList.updateOne({_id: req.params.id}, obj)
    console.log(docs1)
}
    res.json({status: true})
})

module.exports = router