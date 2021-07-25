const express = require('express')
const axios = require('axios')
const indianStates = require('../data/indian_states.json')
const router = express.Router()

router.get('/', async(req, res) => {
    let lat = req.query.lat
    let lon = req.query.lon
    let locationData = await axios.get(`https://us1.locationiq.com/v1/reverse.php?key=${process.env.LOCATION_IQ_API_KEY}&lat=${lat}&lon=${lon}&format=json`)
    let state = indianStates[locationData.data.address.state]
    let response = []
    let i = 1
    let covid19IndiaData = await axios.get('https://api.covid19india.org/v4/min/data.min.json')
    for (let district in covid19IndiaData.data[state]['districts']) {
        covid19IndiaData.data[state]['districts'][district]['id'] = i
        let forward = await axios.get(`http://api.positionstack.com/v1/forward?access_key=${process.env.POSITION_STACK_API_KEY}&query=${district}`)
        covid19IndiaData.data[state]['districts'][district]['coords'] = `${forward.data.data[0].latitude}, ${forward.data.data[0].longitude}`
        covid19IndiaData.data[state]['districts'][district]['vacc1'] = ((covid19IndiaData.data[state]['districts'][district].total.vaccinated1 / covid19IndiaData.data[state]['districts'][district].meta.population) * 100).toFixed(2)
        covid19IndiaData.data[state]['districts'][district]['vacc2'] = ((covid19IndiaData.data[state]['districts'][district].total.vaccinated2 / covid19IndiaData.data[state]['districts'][district].meta.population) * 100).toFixed(2)
        covid19IndiaData.data[state]['districts'][district]['vacc3'] = ((1 - ((covid19IndiaData.data[state]['districts'][district].total.vaccinated1 + covid19IndiaData.data[state]['districts'][district].total.vaccinated2) / covid19IndiaData.data[state]['districts'][district].meta.population)) * 100).toFixed(2)
        covid19IndiaData.data[state]['districts'][district]['title'] = district
        response.push(covid19IndiaData.data[state]['districts'][district])
        i += 1
    }
    res.json(response)
});

module.exports = router