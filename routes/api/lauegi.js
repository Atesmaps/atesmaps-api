const express = require('express');
const router = express.Router();
const observationsController = require('../../controllers/lauegiController');

router.route('/')
    .get(observationsController.getFeatures);
router.route('/:id')
    .get(observationsController.getObservation);


module.exports = router;