

module.exports = function () {
    return function (req, res, next) {
        
        console.log(' req ' + req.url);
        let url = '' + req.url;
        let user = req.session.login;
        if(user==undefined && !url.includes('/user') && !url.includes('/public') && url!='/' ){
            console.log('not logged in '+url+' '+ user);
            res.redirect('/');
            return ;
        }
        if(url=='/')
            next();
        else if( !url.includes('/ide') && !url.includes('/repo') && !url.includes('/public') && !url.includes('/user') ){
            res.sendFile(global.root + '/repos/' + user + '/' + url);
        }else
            next();
        }
  }