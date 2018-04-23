const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async(request, response) => {
    const users = await User.find({})
    response.json(users.map(User.format))
})

usersRouter.post('/', async(request, response) => {
    const body = request.body
    const password1 = body.password1
    const password2 = body.password2
    const email = body.email
    const username = body.username

    if(password1 !== password2){
        return response.status(400).json({error: "passwords don't match"})
    }
    // password requirements
    if (password1.length < 5) {
        return response.status(400).json({error: 'password too short'})
    }
    // username validation const isUnique = await isUniqueUser(username) parempi
    const existingUser = await User.find({username})
    if (existingUser != null && existingUser.length > 0) {
        return response.status(400).json({error: 'username exists'})
    }
    try {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password1, saltRounds)
        const user = new User({
            username,
            name: body.name,
            email: body.email,
            passwordHash,
            admin: false // TODO: pääkäyttäjä voi antaa adminoikeudet
        })
        debugger
        const savedUser = await user.save()
        response.json(User.format(savedUser))
    } catch (exception) {
        console.log(exception)
        response.status(500).json({error: 'something went wrong...'})
    }
})

// const formatUser = (user) => {     return {         id: user._id,
// name: user.name,         password: user.passwordHash,         adult:
// user.adult,         username: user.username     } }
const isUniqueUser = async(username) => {

    const users = await User.find({})
    const usernames = users.map(x => x.username)
    return usernames.indexOf(username) === -1
}

module.exports = usersRouter
