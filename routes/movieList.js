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
        movieListName: req.body.movieListName,
    })
    docs.save()
    req.body.users.forEach(async username => {
        const docs1 = await User.updateOne({username: username}, {$addToSet: { movieLists: docs._id}})
        console.log(docs1)
    });
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



module.exports = router