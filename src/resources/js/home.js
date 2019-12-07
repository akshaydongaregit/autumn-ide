let $ = (exp) => document.querySelector(exp);
let $$ = (exp) => document.querySelectorAll(exp);

$$('.explorer .node label').forEach( el => {
        el.addEventListener( 'click' , () => { 
            el.parentElement.classList.toggle("fold");
        });
    });

    var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
        mode:'javascript'
    });

    let save = () =>{
        let data = {
            file : 'first.js' ,
            content : $('#code').value
        }
        axios.post('/save',data).then((res)=>{
            console.log('res:'+JSON.stringify(res));
        }).catch((err)=>{
            console.log('err :'+err);
        });
    }

    let showOut = ()=>{
        $('#out').classList.add("show");
    }