const express = require('express')
const User = require('../models/User')
const router = express.Router()

router.get('/', async(req, res) => {
    let users = await User.find().sort({ vixons: -1 })
    let response = []
    users.forEach(user => {
        let object = {}
        object.username = user.username
        object.covicoins = user.vixons
        object.pfp_url = user.pfp_url
        response.push(object)
    })
    res.json(response)
});

module.exports = router