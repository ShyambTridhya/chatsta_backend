const router = require('express').Router();
const {
  createAllInformative,
  getAllInformative,
  updateAllInformative,
} = require('../controllers/informationController');

//AboutUs Routes
router.post('/createAllInformative', createAllInformative);
router.get('/getAllInformative', getAllInformative);
router.patch('/updateAllInformative/:id', updateAllInformative);

module.exports = router;
