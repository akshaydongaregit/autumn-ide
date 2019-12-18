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
router.post('/newFile',(req,res)=>{
    let data = req.body;
    let username = req.session.login;
    data.name = username+'/'+data.name;
    console.log('router '+data);
    res.send(repo.create(data));
});
router.post('/deleteFile',(req,res)=>{
    let data = req.body;
    let username = req.session.login;
    data.name = username+'/'+data.name;
    console.log('router '+data);
    res.send(repo.delete(data));
});
router.post('/renameFile',(req,res)=>{
    let data = req.body;
    let username = req.session.login;
    data.name = username+'/'+data.name;
    data.newName = username+'/'+data.newName;
    console.log('router '+data);
    res.send(repo.rename(data));
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