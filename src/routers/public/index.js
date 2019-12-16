let router = require('express').Router();
const auth = require('../../helpers/auth')

router.get('/login',(req,res)=>{
    res.render('user/login');
});

router.get('/signup',(req,res)=>{
    res.render('user/signup');
});

module.exports = router;