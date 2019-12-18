let repo = require('./repo')

let users = new Map();
users.set('ak' , {name:'akshay' , email:'ak@gmail.com' , username:'ak' , pswd : '123' });

exports.authUser = (login , pswd) => {
    console.log('login:'+login+' pswd:'+pswd);
    if(users.get(login)!=undefined)
        if(users.get(login).pswd == pswd)
            return true;

        return false;

};

exports.userOfLogin = (login) => {
    return user.get(login);
};

exports.add = (user) => {
    let result = {
        success : true ,
        error : null
    };

    if(users.get(user.username)==undefined) {
        repo.create({ name : user.username , type : 'folder'} );
        users.set(user.username , user);
        return result;
    }else {
        result.success = false;
        result.error = 'duplicate username exists';
        return result;
    }
}