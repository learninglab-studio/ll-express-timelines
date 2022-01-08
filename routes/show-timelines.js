var express = require('express');
var router = express.Router();
var sampleTimeLineJson = require(`../data/timeline-sample.json`)
const llAt = require(`../utilities/ll-airtable-tools`)
const placeholderImage = `https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png`
const timelineImages = [
    `https://i.pinimg.com/564x/b3/21/41/b321410295dff67dac935a3cbb2d5ab0.jpg`,
    `https://i.pinimg.com/564x/16/96/9f/16969f8dc32e7c762bb559a637ba3d02.jpg`,
    `https://the-public-domain-review.imgix.net/essays/emma-willard-maps-of-time/13233002-edit-small-zoom.jpg?fit=max&w=1200&h=850`,
    `https://i.pinimg.com/564x/5f/f0/c3/5ff0c3c4fb80f1855eea060125de591c.jpg`,
    `https://i.pinimg.com/564x/95/26/11/9526118f14cbbbe06bf36413d6fc43d2.jpg`
]
const { randomElement } = require(`../utilities/ll-utilities`)

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('remember to put in a query');
});

router.get('/:table/:field/:value', renderTimeline);

module.exports = router;

async function renderTimeline (req, res, next){
    // just try atResult, catch with a response that explains how to fix
    const atResult = await llAt.findManyByValue({
        baseId: "apprSmdoCbtfnsGwY",
        table: req.params.table,
        view: "MAIN_VIEW",
        maxRecords: 20,
        field: req.params.field,
        value: req.params.value
    })
    var timelineJson = {
        "title": {
            "media": {
              "url": randomElement(timelineImages),
              "caption": "timelines.",
            },
            "text": {
              "headline": `ll-timelines`,
              "text": `<p>Timeline of all ${req.params.table} with ${req.params.field} = ${req.params.value}</p>`
            }
        },
        events: []
    }
    for (let i = 0; i < atResult.length; i++) {
        const element = atResult[i];
        timelineJson.events.push(makeEvent(element))
    }
    console.log(JSON.stringify(atResult[0], null, 4))
    console.log(JSON.stringify(timelineJson, null, 4))
    res.render('timeline', {
        title: `timeline for ${req.params.id} 🚀`,
        message: "",
        timeline_json: timelineJson
    })
}

async function allUsersTimeline (req, res, next){
    res.render('timeline', {
        title: `timeline for ${req.params.id} 🚀`,
        message: "",
        timeline_json: sampleTimeLineJson
    })
}


function makeEvent(imageRecord) {
    const createdDate = new Date(imageRecord.fields.CreatedTs)
    console.log(`changing ${imageRecord.fields.CreatedTs} to ${createdDate.toISOString()}`)
    var revisedEvent = {
        "media": {
            "url": imageRecord.fields.SlackUrl ? imageRecord.fields.SlackUrl : placeholderImage,
            "caption": `posted by ${imageRecord.fields.PostedBySlackUser}`,
            // "credit": `posted by ${imageRecord.fields.PostedBySlackUser}`
        },
        "start_date": {
            "second": createdDate.getSeconds(),
            "minute": createdDate.getMinutes(),
            "hour": createdDate.getHours(),
            "month": createdDate.getMonth(),
            "day": createdDate.getDay(),
            "year": createdDate.getFullYear(),
        },
        "text": {
            "headline": imageRecord.fields.Title,
            "text": imageRecord.fields.Text
        }
    }
    // console.log(JSON.stringify(revisedEvent));
    return revisedEvent
}
