const express = require("express")
const router = express.Router()
const Account = require('../models/account')
const Schedule = require('../models/schedule')
const Attraction = require('../models/attraction')
const AttractionDetail = require('../models/attractionDetail')
const Preference = require('../models/preference')
const gp_schedules = require('../models/gp_schedules')
const multer = require('multer')
const mongoose = require('mongoose');
var moment = require('moment');
// Account route
router.get('/account/', async (req, res) => {
    Account.find({  })
        .then((data) => {
            console.log('Data: ', data);
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', daerrorta);
        });
});

router.post('/preference/save', async (req, res) => {
    const data = req.body;
    try{
        const findPreference = await Preference.exists({ user_id: data.user_id})
        if (!findPreference){
            const newPreference = new Preference(data);
            newPreference.save((error) => {
            if (error) {
                res.status(500).json({ msg: 'Sorry, internal server errors' });
                return;
            }
            console.log('Data: ', data);
            return res.json({
                msg: 'Your data has been saved!!!!!!'
            });
            });
        }else{
            const updatePreference = await Preference.updateOne({ user_id: data.user_id }, { $set: data })
            res.json(updatePreference)
        }

    } catch (err) {
        res.json({ message: err })
    }    
});

router.get('/preference/:uid', async (req, res) => {
    try{
        const findPreference = await Preference.find({user_id: req.params.uid})
        res.json(findPreference)
    } catch (err) {
        res.json({ message: err })
    }    
});

router.get('/account/find/:uid', async (req, res) => {
    try {
        const findAccount = await Account.findById(req.params.uid)
        res.json(findAccount)
    } catch (err) {
        res.json({ message: "invaild user" })
    }
})

router.get('/account/findgpuser/:sid', async (req, res) => {
    var userList = []
    var resultuserList = []
    gp_schedules.aggregate()
        .match({ _id: { $in: [ mongoose.Types.ObjectId(req.params.sid)] } })
        .project({
            "user_list":"$user_list"
        })
        .then(async (data) => {
            userList = data[0].user_list
            await userList.map((user,index)=>{
                Account.aggregate()
                    .match({ _id: { $in: [mongoose.Types.ObjectId(user)] } })
                    .project({
                        "userName":"$userName",
                        "email":"$email",
                        "icon":"$icon"
                    })
                    .then((data) => {
                        resultuserList.push(data[0])
                        if(userList.length-1 == index){
                            res.json(resultuserList)
                        }  
                    })
                    .catch((error) => {
                        console.log('error: ', error);
                    });
            });
        })
        .catch((error) => {
            console.log('error: ', error);
        });
})

router.post('/account/query', async (req, res) => {
    const data = req.body;
    try {
        const findAccount = await Account.find({email:data.email})
        if (findAccount.length == 0){
            res.json({ message: "Invalid User" })
        }else{
            if (findAccount[0].password != data.password)
                res.json({ message: "wrong password"})
            else
                res.json(findAccount);
        }
    } catch (err) {
        res.json({ message: err })
    }
})

// create user 
router.post('/account/create', async (req, res) => {
    const data = req.body;
    try {
        const findAccount = await Account.find({email:data.email})
        if (findAccount.length == 0){
            const newAccount = new Account(data);
            newAccount.save((error) => {
                if (error) {
                    res.status(500).json({ message: 'Sorry, internal server errors' });
                    return;
                }
                return res.json({
                    message: 'create successful'
                });
            });
        }else{
            res.json({ message: "This email alread registered." })
        }
    } catch (err) {
        res.json({ message: err })
    }
})


router.post('/account/update', async (req, res) => {
    const data = req.body;
    try {
        const updateAccount = await Account.updateOne({ _id: data._id }, { $set: { userName: data.userName,icon: data.icon} })
        res.json(updateAccount)
    } catch (err) {
        res.json({ message: err })
    }
});

const Storage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, __dirname+'/../public/images')
    },
    filename(req, file, callback) {
      callback(null, file.originalname)
    },
})

const upload = multer({ storage: Storage })
router.post('/account/imageUpload',upload.single('files'),async (req, res) => {
    console.log('file', req.files)
    console.log('body', req.body)
    res.status(200).json({
        message: 'success!',
    })
});

// ----------------------------------------------- schedule -----------------------------------------------

// find all schedule
router.get('/schedule/', async (req, res) => {
    Schedule.find({  })
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', daerrorta);
        });
});

// find schedule by user id
router.get('/schedule/find/:uid', async (req, res) => {
    try {
        const findSchedule = await Schedule.find({user_id:req.params.uid})
        res.json(findSchedule)
    } catch (err) {
        res.json({ message: err })
    }
});

// create new schedule
router.post('/schedule/save', async (req, res) => {
    const data = req.body;
    const newSchedule = new Schedule(data);
    newSchedule.save((error) => {
        if (error) {
            res.status(500).json({ msg: 'Sorry, internal server errors' });
            return;
        }
        console.log('Data: ', data);
        return res.json({
            msg: 'Your data has been saved!!!!!!'
        });
    });
});

router.delete('/schedule/remove/:sid', async (req, res) => {
    try {
        const removeSchedule = await Schedule.remove({ _id: req.params.sid })
        res.json({ removeSchedule,message: "Delete successfully" })
    } catch (err) {
        res.json({ message: err })
    }
});


router.post('/schedule/gpschedule/invite', async (req, res) => {
    const data = req.body;
    console.log(data);
    var user_list = []
    try {
        const findgp_schedules = await gp_schedules.find({_id:data._id})
        user_list = findgp_schedules[0].user_list
        const finAccount = await Account.find({email:data.email})
        user_list.push(finAccount[0]._id)
        const updateSchedule = await gp_schedules.updateOne({ _id: data._id }, { $set: { user_list: user_list} })
        res.json(updateSchedule)
    } catch (err) {
        res.json({ message: err })
    }
});

router.post('/schedule/update', async (req, res) => {
    const data = req.body;
    console.log(data)
    try {
        const updateSchedule = await Schedule.updateOne({ _id: data._id }, { $set: { Title: data.Title,StartDate: data.StartDate} })
        res.json(updateSchedule)
    } catch (err) {
        res.json({ message: err })
    }
});

// show schedule image
router.get('/schedule/image/:image', async (req, res) => {
    try {
        var img = fs.readFileSync('../image'+req.params.image);
        res.writeHead(200, {'Content-Type': 'image/jpg' });
        res.end(img, 'binary');
    } catch (err) {
        res.json({ message: err })
    }
})

router.get('/schedule/gpschedule/:uid', async (req, res) => {
    try {
        const findSchedule = await gp_schedules.find({ user_list: req.params.uid})
        res.json(findSchedule)
    } catch (err) {
        res.json({ message: err })
    }
})

router.post('/schedule/gpschedule/create', async (req, res) => {
    const data = req.body;
    const new_gp_schedules = new gp_schedules(data);
    new_gp_schedules.save((error) => {
        if (error) {
            res.status(500).json({ msg: 'Sorry, internal server errors' });
            return;
        }
        console.log('Data: ', data);
        return res.json({
            msg: 'Your data has been saved!!!!!!'
        });
    });
})

router.post('/schedule/remove/', async (req, res) => {
    const data = req.body;
    try {
        const removeSchedule = await Schedule.deleteOne({ _id:data._id })
        res.json(removeSchedule)
    } catch (err) {
        res.json({ message: err })
    }
});


router.post('/schedule/gpschedule/remove/', async (req, res) => {
    const data = req.body;
    try {
        const findgp_schedules = await gp_schedules.find({ _id: data._id})
        if(findgp_schedules[0].user_list[0] == data.user_id){
            const removeAttraction = await gp_schedules.deleteOne({ _id:data._id })
            res.json({result:removeAttraction,message:"Delete successfully"})
        }else{
            res.json({ message: "You are not the host, can't delete this group schedule" })
        }
    } catch (err) {
        res.json({ message: err })
    }
});
//----------------------------------------- Attraction -----------------------------------

// find all attraction
router.get('/attraction/', async (req, res) => {
    Attraction.find({  })
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', daerrorta);
        });
});

// find attraction by schedule id
router.get('/attraction/:sid', async (req, res) => {
    try {
        const findAttraction = await Attraction.find({schedule_id:req.params.sid})
        res.json(findAttraction)
    } catch (err) {
        res.json({ message: err })
    }
});

// create new schedule
router.post('/attraction/save', async (req, res) => {
    const data = req.body;
    const newAttraction = new Attraction(data);
    newAttraction.save((error) => {
        if (error) {
            res.status(500).json({ msg: 'Sorry, internal server errors' });
            return;
        }
        console.log('Data: ', data);
        return res.json({
            msg: 'Your data has been saved!!!!!!'
        });
    });
});

router.post('/attraction/remove/', async (req, res) => {
    const data = req.body;
    try {
        const removeAttraction = await Attraction.deleteOne({ _id:data._id })
        res.json({result:removeAttraction,message:"Delete successfully"})
    } catch (err) {
        res.json({ message: err })
    }
});


// find attraction by schedule id
router.get('/attractiondetail/', async (req, res) => {
    AttractionDetail.find({  })
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', daerrorta);
        });     
});

router.post('/recommend/add', async (req, res) => {
    const data = req.body;
    const newSchedule = new Schedule(data);
        newSchedule.save();
    var attractions = []
    attractions = data.data;
    let startTime = new Date().setHours('06','00','00');
    let endTime = new Date();
    var insertAttrations = [];
    attractions.map((attraction)=>{
        startTime = moment(startTime).add(attraction.timespend,'hours');
        endTime = moment(startTime).add(attraction.timespend,'hours');
        var newAttraction = {
            startTime:startTime.toDate(),
            endTime:endTime.toDate(),
            title:attraction.title,
            location:attraction.location,
            image:attraction.image,
            schedule_id:newSchedule._id,
            latitude:attraction.latitude,
            longitude:attraction.longitude,
            timespend:attraction.timespend,
            coordinate:{
                latitude:attraction.latitude,
                longitude:attraction.longitude,
            }
        }
        insertAttrations.push(newAttraction)
    })

    Attraction.insertMany(insertAttrations)
    .then(function (docs) {
        res.json(docs);
    })
    .catch(function (err) {
        res.status(500).send(err);
    });
});


const getPearsonCorrelation = (user1,user2) =>{

    let { min, pow, sqrt } = Math
    let add = (a, b) => a + b
    let n = min(user1.length, user2.length)
    if (n === 0) {
        return 0
    }
    [user1, user2] = [user1.slice(0, n), user2.slice(0, n)]
    let [sum1, sum2] = [user1, user2].map(l => l.reduce(add))
    let [pow1, pow2] = [user1, user2].map(l => l.reduce((a, b) => a + pow(b, 2), 0))
    let mulSum = user1.map((n, i) => n * user2[i]).reduce(add)
    let dense = sqrt((pow1 - pow(sum1, 2) / n) * (pow2 - pow(sum2, 2) / n))
    if (dense === 0) {
        return 0
    }
    let result = (mulSum - (sum1 * sum2 / n)) / dense
    return Math.abs(result)
}

const getSimilarUser = async (uid) =>{
    const targetPreference = await Preference.find({user_id:uid})
    var targetUser = [];
    targetUser.push(targetPreference[0].shopping);
    targetUser.push(targetPreference[0].view);
    targetUser.push(targetPreference[0].sport);
    targetUser.push(targetPreference[0].culture);
    targetUser.push(targetPreference[0].music);
    const findPreference = await Preference.find({user_id: {$ne: uid}})
    let similarUser = "";
    let similarScore = 0;
    findPreference.map(async(user,index)=>{
        var loopuser = [];
        loopuser.push(user.shopping);
        loopuser.push(user.view);
        loopuser.push(user.sport);
        loopuser.push(user.culture);
        loopuser.push(user.music);
        let value = 0;
        value = getPearsonCorrelation(targetUser,loopuser);
        if (similarScore < value){
            similarScore = value;
            similarUser = user.user_id;
        }    
    })
    return {"user":similarUser,"score":similarScore}
}

const getTypeofUser = async (uid) =>{
    const targetPreference = await Preference.find({user_id:uid})
    var targetUser = targetPreference[0];
    var list = {"Shopping":targetUser.shopping,"View":targetUser.view,"Sport":targetUser.sport,"Culture":targetUser.culture,"Music":targetUser.music};
    let index, max = 0;
    for(const [key, value] of Object.entries(list)) {
        if(value > max) {
                max = value;
                index = key;
        }
    }
    return index
}

router.get('/recommend/:uid', async (req, res) => {

    var restaurantList = [];
    var scheduleList = [];
    var outList = [];
    await AttractionDetail.aggregate()
        .match({ type: { $in: [ "Restaurant" ] } })
        .project({
            "title" : "$title",
            "location": "$location",
            "image":"$image",
            "latitude":"$latitude",
            "longitude":"$longitude",
            "coordinate":"$coordinate",
            "numberOfRating":"$numberOfRating",
            "timespend":"$timespend",
            "TotalMark": { "$add": [ "$numberOfRating", "$numberOfAdd" ] }
        })
        .sort({ TotalMark: 'desc'}).limit(5)
        .then((data) => {restaurantList=data;})
        .catch((error) => {console.log('error: ', error);});

    const shuffled = restaurantList.sort(() => 0.5 - Math.random());
    let restaurantData = shuffled.slice(0, 2);

    try {
        var similarUser = await getSimilarUser(req.params.uid);
        if (similarUser.score > 0.6){
            console.log("similar score:"+similarUser.score)
            var result = {"type":"sim","result":similarUser.user};
            await AttractionDetail.aggregate()
            .match({ type: { $ne: "Restaurant"} })
            .project({
                "title" : "$title",
                "location": "$location",
                "image":"$image",
                "latitude":"$latitude",
                "longitude":"$longitude",
                "coordinate":"$coordinate",
                "numberOfRating":"$numberOfRating",
                "timespend":"$timespend",
                "TotalMark": { "$add": [ "$numberOfRating", "$numberOfAdd" ] }
            })
            .sort({ TotalMark: 'desc'})
            .then((data) => {
                scheduleList = data;
                const shuffled = scheduleList.sort(() => 0.5 - Math.random());
                let scheduleData = shuffled.slice(0, 6);
                outList.push(scheduleData[0])
                outList.push(scheduleData[1])
                outList.push(restaurantData[0])
                outList.push(scheduleData[2])
                outList.push(scheduleData[3])
                outList.push(restaurantData[1])
                outList.push(scheduleData[4])
                outList.push(scheduleData[5])
                res.json(outList);
            })
            .catch((error) => {console.log('error: ', error);});
        } else {
            var type = await getTypeofUser(req.params.uid);
            console.log("Type:"+type)
            await AttractionDetail.aggregate()
            .match({ type: { $in: [type]} })
            .project({
                "title" : "$title",
                "location": "$location",
                "image":"$image",
                "latitude":"$latitude",
                "longitude":"$longitude",
                "coordinate":"$coordinate",
                "numberOfRating":"$numberOfRating",
                "timespend":"$timespend",
                "TotalMark": { "$add": [ "$numberOfRating", "$numberOfAdd" ] }
            })
            .sort({ TotalMark: 'desc'})
            .then((data) => {
                scheduleList = data;
                const shuffled = scheduleList.sort(() => 0.5 - Math.random());
                let scheduleData = shuffled.slice(0, 6);
                outList.push(scheduleData[0])
                outList.push(scheduleData[1])
                outList.push(restaurantData[0])
                outList.push(scheduleData[2])
                outList.push(scheduleData[3])
                outList.push(restaurantData[1])
                outList.push(scheduleData[4])
                outList.push(scheduleData[5])
                res.json(outList);
            })
            .catch((error) => {console.log('error: ', error);});
        }
    } catch (err) {
        res.json({ message: err })
    }
});



router.get('/attractiondetail/recommend/', async (req, res) => {
    //const data = req.body;
    var restaurantData = [];
    var attractionData = [];

    await AttractionDetail.aggregate()
        .match({ type: { $in: [ "Restaurant" ] } })
        .project({
            "title" : "$title",
            "location": "$location",
            "image":"$image",
            "latitude":"$latitude",
            "longitude":"$longitude",
            "coordinate":"$coordinate",
            "numberOfRating":"$numberOfRating",
            "timespend":"$timespend",
            "TotalMark": { "$add": [ "$numberOfRating", "$numberOfAdd" ] }
        })
        .sort({ TotalMark: 'desc'}).limit(2)
        .then((data) => {
            restaurantData=data;
        })
        .catch((error) => {
            console.log('error: ', error);
        });
    
    await AttractionDetail.aggregate()
        .match({ type: { $in: ["View","Shopping"]} })
        .project({
            "title" : "$title",
            "location": "$location",
            "image":"$image",
            "latitude":"$latitude",
            "longitude":"$longitude",
            "coordinate":"$coordinate",
            "numberOfRating":"$numberOfRating",
            "timespend":"$timespend",
            "TotalMark": { "$add": [ "$numberOfRating", "$numberOfAdd" ] }
        })
        .sort({ TotalMark: 'desc'}).limit(6)
        .then((data) => {
            attractionData = data;
            var resData = []
            resData.push(attractionData[0]);
            resData.push(attractionData[1]);
            resData.push(restaurantData[0]);
            resData.push(attractionData[2]);
            resData.push(attractionData[3]);
            resData.push(restaurantData[1]);
            resData.push(attractionData[4]);
            resData.push(attractionData[5]);
            res.json(resData);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});




module.exports = router