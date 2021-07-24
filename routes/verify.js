const express = require('express')
const User = require('../models/User')
const Verification = require('../models/Verification')
const router = express.Router()

const terms = ['covid', 'vaccination']

router.post('/', async(req, res) => {
    let user = await User.findOne({ access_token: req.query.access_token })
    if (user) {
        let verification = await Verification.findOne({ verified: true, aadhaar: req.body.aadhaar })
        if (!verification) {
            let ocrData = axios.post(`https://api.ocr.space/parse/image`, { url: req.body.imageUrl, headers: { apikey: process.env.OCR_API_KEY } })
            let verified1 = true
            let verified2 = false
            terms.forEach(term => {
                if (verified1) {
                    if (term in ocrData.data.ParsedResults.ParsedText.toLowerCase()) {
                        verified1 = true
                    } else {
                        verified1 = false
                    }
                }
            })
            if (verified1) {
                if (req.body.name.toLowerCase() in ocrData.data.ParsedResults.ParsedText.toLowerCase()) {
                    verified2 = true
                } else {
                    verified2 = false
                }
            }
            let newVerification = new Verification({
                author: user._id,
                verified: verified1 && verified2,
                name: req.body.name,
                image: req.body.imageUrl,
                date: new Date(),
                district: district,
                aadhaar: req.body.aadhaar
            })
            await newVerification.save()
            if (verified1 && verified2) {
                user.vixons += 1
                user.save()
                res.json({ success: true, message: 'Vixon earned successfully!' })
            } else {
                res.json({ success: false, message: 'Verification failed!' })
            }
        } else {
            res.json({ success: false, message: 'Verification already exists!' })
        }
    } else {
        res.sendStatus(401).json({ success: false, message: 'User not found' })
    }
});

module.exports = router