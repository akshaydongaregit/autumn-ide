let $ = (exp) => document.querySelector(exp);
let $$ = (exp) => document.querySelectorAll(exp);

$$('.explorer .node label').forEach( el => {
        el.addEventListener( 'click' , () => { 
            el.parentElement.classList.toggle("fold");
        });
    });
