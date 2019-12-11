
let users = [ 
    { login : 'ak' , pswd : '123' } ,
    { login : 'vishu' , pswd : '123' } ,
    { login : 'adi' , pswd : '123' } ,
    { login : 'kiran' , pswd : '123' }
];

exports.authUser = (login , pswd) => {
    console.log('login:'+login+' pswd:'+pswd);
    return true;
};

exports.userOfLogin = (login) => {

};