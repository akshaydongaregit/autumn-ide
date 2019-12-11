
let $ = (exp) => document.querySelector(exp);
let $$ = (exp) => document.querySelectorAll(exp);

    let showOut = ()=>{
        $('#out').classList.add("show");
    }

    let menu = {};
    
let init = () => {
        axios.post('/repo/repostree',{}).then((res)=>{
            console.log('res:'+JSON.stringify(res.data));    
            initSideExplorer(res.data);
        }).catch((err)=>{
            console.log('err :'+err);
        });
    }

    let initSideExplorer = (dirTree) => {

        var nodes = dirTree.children;
        let html = '';

        nodes.forEach( node => {
            html+= renderNode(node);
        });
        
        $('.explorer .nodes').innerHTML = html;

        addSideExplorerClicks();

}

let addSideExplorerClicks = () => {
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
}

let renderNode = (node) => {
    let type = node.type;
    let name = node.name;
    let html = '';

    if(type == 'file'){
        html += `<div class="node">
            <label class="`+type+`">`+name+`</label>
        </div>`;

    }else if(type == 'folder' ) {
        html = `<div class="node">
                    <label class="`+type+`">`+name+`</label>`;

        node.children.forEach( node => {
            html+= renderNode(node);
        });
        
        html+= `</div>`;

    }
    console.log(html);

    return html;
}
