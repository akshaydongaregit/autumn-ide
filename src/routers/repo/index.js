let router = require('express').Router();
const repo = require('../../helpers/repo')

router.post('/save',(req,res)=>{
    let data = req.body;
    res.send(repo.save(data));
});

router.post('/saveFile',(req,res)=>{
    let data = req.body;
    console.log('router '+data);

    res.send(repo.save(data));
});

router.post('/repostree',(req,res)=>{
    let data = req.body;
    let login = req.session.login;

    res.send(repo.dirTreeByLogin(login));
});


router.post('/get',(req,res)=>{
    let data = req.body;
    let login = req.session.login;

    res.sendFile(global.root+'/repos/' + data.filename);
});

module.exports = router;