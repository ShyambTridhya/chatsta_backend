const express = require('express');
const {
  createSponsoredClock,
  getAllSponsoredClock,
  deleteSponsoredClock,
  getSponsoredClockById,
  updateSponsoredClock,
} = require('../controllers/sponsoredClockController');
const router = express.Router();

//SponsoredClock Routes
router.post('/createSponsoredClock', createSponsoredClock);
router.get('/getAllSponsoredClock', getAllSponsoredClock);
router.delete('/deleteSponsoredClock', deleteSponsoredClock);
router.get('/getSponsoredClockById/:id', getSponsoredClockById);
router.patch('/updateSponsoredClock/:id', updateSponsoredClock);

module.exports = router;
