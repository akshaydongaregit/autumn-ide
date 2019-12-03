let router = require('express').Router();

router.get('/home' ,(req,res)=>{
    res.render('ide/home',{});
});

module.exports = router;