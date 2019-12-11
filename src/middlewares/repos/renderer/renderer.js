

module.exports = function () {
    return function (req, res, next) {
    
    console.log(' req ' + req.url);
    let url = '' + req.url;
    let user = req.session.login;
    if(user==undefined && !url.includes('/user/login') ){
        console.log('not logged in '+url+' '+ user);
        res.render('user/login');
        return ;
    }

    if( !url.includes('/ide') && !url.includes('/repo') && !url.includes('/user') ){
        res.sendFile(global.root + '/repos/' + user + '/' + url);
    }else
        next()
    }
  }