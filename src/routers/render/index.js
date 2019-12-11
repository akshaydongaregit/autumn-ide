let router = require('express').Router();
const repo = require('../../helpers/repo')

router.post('/',(req,res)=>{
    let data = req.body;
    res.send(repo.save(data));
});

module.exports = router;