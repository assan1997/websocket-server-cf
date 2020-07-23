const express = require('express');

const router = new express.Router;

router.route('/')
.get(async(req,res)=>{
    res.json('is ok');
});

module.exports = router;