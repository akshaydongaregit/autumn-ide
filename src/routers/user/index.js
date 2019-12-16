let router = require('express').Router();
const auth = require('../../helpers/auth')

router.post('/login',(req,res)=>{
    let data = req.body;
    let isAuth = auth.authUser(data.username , data.pswd);
    if(isAuth)
        req.session.login = data.username;
    console.log(req.session.login);
    
    res.send(isAuth);
});

router.post('/add',(req,res)=>{
    let data = req.body;
    res.send(auth.add(data));
});

router.get('/logout',(req,res)=>{
    req.session.login = undefined;
    res.redirect('/');
});

module.exports = router;