if($==undefined)
 var $ = (exp) => document.querySelector(exp); 
if($$==undefined)
 var $$ = (exp) => document.querySelectorAll(exp);
if(_$==undefined)
    var _$ = (html) => document.createRange().createContextualFragment(html);
    
$.$ = (el,exp) => el.querySelector(exp); 
$.$$ = (el,exp) => el.querySelectorAll(exp);

$.loading = (el , action) => {
    
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
            <button id="submit" class="success" > ` + (config.submitText !=undefined ? config.submitText : `Submit`) + ` </button>
            <button id="cancel" class="danger" > ` + (config.cancelText !=undefined ? config.cancelText : `Cancel`) + `</button>
        </div>
    </div>` ;
    let dailogNode = new DOMParser().parseFromString(html,'text/html').documentElement ;
    
    
        dailogNode.querySelector('#submit').addEventListener( 'click' , () => { 
            el.removeChild(dailogNode);
            if(config.onSubmit!=undefined)
                config.onSubmit(dailogNode); });
    
        dailogNode.querySelector('#cancel').addEventListener ( 'click' , () => {
                el.removeChild(dailogNode);
                if(config.onCancel!=undefined)
                    config.onCancel(dailogNode) 
            })  ;
    
    el.appendChild( dailogNode );

};