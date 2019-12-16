if($==undefined)
 var $ = (exp) => document.querySelector(exp); 
if($$==undefined)
 var $$ = (exp) => document.querySelectorAll(exp);
if(_$==undefined)
    var _$ = (html) => document.createRange().createContextualFragment(html);

let loading = (el , action) => {
    
    if(el.querySelector('div.spinner')!=undefined)
            el.removeChild(el.querySelector('div.spinner'));

    if(action)        
        el.appendChild(_$(
            `<div class="spinner round show" >
            </div>`)
        );
}