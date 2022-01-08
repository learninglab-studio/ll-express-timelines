var express = require('express');
var router = express.Router();
var sampleTimeLineJson = require(`../data/timeline-sample.json`)
const llAt = require(`../utilities/ll-airtable-tools`)


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:id', oneReactionTimeline);

module.exports = router;

async function imagesTimeline (req, res, next){
    const atResult = await llAt.findManyByValue({
        baseId: "apprSmdoCbtfnsGwY",
        table: "ShowYourImages",
        view: "MAIN_VIEW",
        maxRecords: 20,
        field: "PostedBySlackUser",
        value: req.params.id
    })
    res.render('timeline', {
        title: `timeline for ${req.params.id} 🚀`,
        message: "",
        timeline_json: sampleTimeLineJson
    })
}

async function oneReactionTimeline (req, res, next){
    res.render('timeline', {
        title: `timeline for ${req.params.id} 🚀`,
        message: "",
        timeline_json: sampleTimeLineJson
    })
}

