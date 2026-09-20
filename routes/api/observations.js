const express = require('express');
const router = express.Router();
const observationsController = require('../../controllers/observationsController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const { upload } = require('../../middleware/upload');

router.route('/')
    .get(observationsController.getAllObservations)
    .post(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor), observationsController.createNewObservation)
    .put(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor), observationsController.updateObservation)
    .delete(verifyRoles(ROLES_LIST.User), observationsController.deleteObservation);

router.route('/:id')
    .get(observationsController.getObservation);

router.route('/:id/images')
    .post(
        verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor),
        upload.array('images', 10),
        observationsController.uploadObservationImages
    );

router.route('/user/:id')
    .get(observationsController.getUserObservations);

module.exports = router;