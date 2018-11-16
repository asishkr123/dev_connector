const express = require('express');

const router = express.Router();





// Public routes

router.get('/test', (req,res) => res.json({msg : 'users works'}));



// Private routes

module.exports = router;