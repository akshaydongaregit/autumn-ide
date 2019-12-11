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


module.exports = router;