const express = require('express')
const router = express.Router()
const User = require('../models/User')

router.post('/gauth', async(req, res) => {
    try {
        User.findOne({ google_id: req.body.googleId }).then(async(user) => {
            if (!user) {
                let username = req.body.email.split('@')[0]
                req.body.imageUrl = req.body.imageUrl.slice(0, -4)
                req.body.imageUrl = `${req.body.imageUrl}1000-c`
                let newUser = User({
                    email: req.body.email,
                    name: req.body.name,
                    given_name: req.body.givenName,
                    family_name: req.body.familyName,
                    google_id: req.body.googleId,
                    pfp_url: req.body.imageUrl,
                    access_token: req.body.access_token,
                    username: username
                })
                newUser.save()
            } else {
                if (req.body.access_token != user.access_token) {
                    user.access_token = req.body.access_token
                    await user.save()
                }
            }
        })
        res.send({ success: true, message: 'Successfully authenticated!' })
    } catch (err) {
        console.log(err)
    }
});