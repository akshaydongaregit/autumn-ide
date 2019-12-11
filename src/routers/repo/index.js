let router = require('express').Router();
const repo = require('../../helpers/repo')

router.post('/save',(req,res)=>{
    let data = req.body;
    res.send(repo.save(data));
});

router.post('/repostree',(req,res)=>{
    let data = req.body;
    let login = req.session.login;

    res.send(repo.dirTreeByLogin(login));
});


module.exports = router;