const Observation = require('../model/Observation');
const User = require('../model/User');
const GeoJSON = require('geojson');
const proj4 = require('proj4');
const { format } = require('date-fns');


const getObservation = async (req, res) => {
    const apiKey = process.env.LAUEGI_API_KEY; 
    const providedApiKey = req.headers['x-api-key']; 

    if (!providedApiKey || providedApiKey !== apiKey) {
        return res.status(401).json({ "message": 'Unauthorized: Invalid or missing API key.' });
    }

    if (!req?.params?.id) return res.status(400).json({ "message": 'Observation ID required' });
    const observation = await Observation.findOne({ _id: req.params.id }).exec();
    if (!observation) {
        return res.status(204).json({ 'message': `Observation ID ${req.params.id} not found` });
    }
    res.json(observation);
}

const getFeatures2 = async (req, res) => {
    console.log('--- DUMMY TEST START ---');
    const providedApiKey = req.headers['x-api-key']; 
    
    // Check if middleware already ruined the response
    if (res.headersSent) {
        console.log('CRITICAL: Headers already sent by middleware!');
        return;
    }

    console.log('Key received:', providedApiKey);
    
    // Send a simple, immediate success
    return res.status(200).json({ message: "Routing is working! The bug is in the DB logic." });
}

const getFeatures = async (req, res) => {

    const apiKey = process.env.LAUEGI_API_KEY; 
    const providedApiKey = req.headers['x-api-key']; 

    if (!providedApiKey || providedApiKey !== apiKey) {
        return res.status(401).json({ "message": 'Unauthorized: Invalid or missing API key.' });
    }

    try {

        //const box = [[parseFloat(req.query.transformedbbox[0]),parseFloat(req.query.transformedbbox[1])],[parseFloat(req.query.transformedbbox[2]),parseFloat(req.query.transformedbbox[3])]];
        const box = [[parseFloat(0.6402078369020309),parseFloat(42.582312510993745)],[parseFloat(1.0246806029244835),parseFloat(42.868976713679956)]];
        //  console.log(`$and:[{date: { $gte: ${new Date(req.query.startDate)}, $lte: ${new Date(req.query.endDate)}}, location: {
        //     $geoWithin: {
        //         $box: ${box},
        //     }
        // }}]}`)
        let data = await Observation.find({$and:[{date: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate)}, location: {
            $geoWithin: {
                $box: box,
            }
        }}]}).sort({date: 'desc'}).populate('user');

    
        // console.log('--------')
        // console.log(data);
        // console.log('--------')
        let features = [];
        data.forEach((feature)=>{
            let terrainScore = 0;
            let userTa =  -1;
            let userRa =  -1;
            if(feature.user){
                switch(feature.user.terrainType) {
                    case 1:
                        terrainScore = 0.5
                    break;
                    case 2:
                        terrainScore = 1
                    break;
                    case 3:
                        terrainScore = 3
                    break;
                    default:
                        terrainScore = 0
                }
                //let transformedCoors = proj4(proj4.defs('EPSG:4326'),proj4.defs('EPSG:3857'),[feature.location.coordinates[1],feature.location.coordinates[0]]);
                userTa = (feature.user.professionalOrientation-1)+(feature.user.snowEducationLevel-1)+(feature.user.snowExperienceLevel*terrainScore);
                userRa = feature.user.avalanchExposure + feature.user.conditionsType;
            }else{
                terrainScore = -1;
            }
        
            // console.log(feature.user);
            features.push({
                "type": "Feature",
                "id": feature._id,
                "geometry": feature.location,
                "properties":{
                    "type": "observation",
                    "title":feature.title,
                    "date":feature.date,
                    "directoryId":feature.directoryId,
                    "images":feature.images,
                    "observationTypes":feature.observationTypes,
                    "user": {
                        "username": feature.user ? feature.user.username : "annonymous",
                        "name": feature.user ? feature.user.name : "annonymous",
                        "lastName": feature.user ? feature.user.lastName : "annonymous",
                        "Ta": userTa,
                        "Ra": userRa,
                    }
                }
            });
        })
        res.json({
            "type": "FeatureCollection",
            "crs": {
                "type": "name",
                "properties": {
                "name": "EPSG:4326",
                },
            },
            "numberMatched":features.length,
            "numberReturned":features.length,
            "timeStamp": new Date(),
            "totalFeatures":features.length,
            "features":features
        });
    } catch (err) {
        // 7. Error Handling
        console.error("Error in getFeatures:", err);
        // This prevents the request from hanging if DB fails
        return res.status(500).json({ "message": "Server Error", "error": err.message });
    }
}

module.exports = {
    getObservation,
    getFeatures
}