const bcrypt = require('bcrypt')

async function hashPWD(password) {
    try{
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);

        return hash
    } catch(err){
        console.log(err)
        return false
    }
}

async function comparePWD(password, hash){
    const match = await bcrypt.compare(password, hash);
    return match
}


module.exports = {
    hashPWD,
    comparePWD
}