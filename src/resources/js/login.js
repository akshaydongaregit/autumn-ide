let $ = (exp) => document.querySelector(exp);
let $$ = (exp) => document.querySelectorAll(exp);

let login = () =>{
    let data = {
        username : $('#username').value ,
        pswd : $('#pswd').value
    }

    axios.post('/user/login',data).then((res)=>{
        console.log('res:'+JSON.stringify(res));
        if(res.data == true ){
            document.location = '/ide/home';
        }
    }).catch((err)=>{
        console.log('err :'+err);
    });
}
