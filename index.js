const express = require('express')
const app = express()
const cors = require("cors")
const authRoute = require('./routes/auth.js')
const searchRoute = require('./routes/search.js')
const addFriendRoute = require('./routes/friend.js')
const movieListRoute = require('./routes/movieList.js')

app.use(express.json())
app.use('/auth', authRoute)
app.use('/search', searchRoute)
app.use('/friend', addFriendRoute)
app.use('/movie-list', movieListRoute)
app.use(cors({origin: '*'}))


app.get('/', (req,res)=> {
    res.json({
        status: "working : )"
    })
})

app.listen(3001, ()=>{
    console.log('listening on http://localhost:3001')
})