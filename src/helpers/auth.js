
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
    users.set(user.username , user);
    return true;
}