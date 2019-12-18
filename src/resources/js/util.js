if($==undefined)
 var $ = (exp) => document.querySelector(exp); 
if($$==undefined)
 var $$ = (exp) => document.querySelectorAll(exp);
if(_$==undefined)
    var _$ = (html) => document.createRange().createContextualFragment(html);
    
$.$ = (el,exp) => el.querySelector(exp); 
$.$$ = (el,exp) => el.querySelectorAll(exp);

let loading = (el , action) => {
    
    if(el.querySelector('div.spinner')!=undefined)
            el.removeChild(el.querySelector('div.spinner'));

    if(action)        
        el.appendChild(_$(
            `<div class="spinner round show" >
            </div>`)
        );
}

$.dailog = ( el , config) => {
    let html = '';
    html += `<div class="dailog">
        <div class="dailog-title">`+config.title+`</div>
        <div class="dailog-subject">`+config.subject+`</div>
        <div class="dailog-body">
        `+config.body+`
        </div>
        <div class="dailog-footer">
            <button id="submit" class="success" >Submit</button>
            <button id="cancel" class="danger" >Cancel</button>
        </div>
    </div>` ;
    let dailogNode = new DOMParser().parseFromString(html,'text/html').documentElement ;
    
    if(config.onSubmit!=undefined){
        dailogNode.querySelector('#submit').addEventListener( 'click' , () => { 
            el.removeChild(dailogNode);
            config.onSubmit(dailogNode); });
    }
    if(config.onCancel!=undefined){
        dailogNode.querySelector('#cancel').addEventListener ( 'click' , () => {
                el.removeChild(dailogNode);
                config.onCancel(dailogNode) 
            })  ;
    }
    el.appendChild( dailogNode );

};