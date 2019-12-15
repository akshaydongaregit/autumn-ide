
let $ = (exp) => document.querySelector(exp);
let $$ = (exp) => document.querySelectorAll(exp);

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
        let optionsHtml = `
        <div class="footer-options">
        <div class="options">
            <div class="option" > <div class="option-icon add-file"> </div> </div>
            <div class="option" > <div class="option-icon delete-file"> </div> </div>
            <div class="option" onclick="showOut();">  <div class="option-icon rename-file"></div> </div>
        </div>
    </div>
    `;

        nodes.forEach( node => {
            html+= renderNode(node);
        });
        
        $('.explorer .nodes').innerHTML = optionsHtml+html;

        addSideExplorerClicks();

}

let addSideExplorerClicks = () => {
    $$('.explorer .node label').forEach( el => {
        el.addEventListener( 'click' , () => { 
            el.parentElement.classList.toggle("fold");
        });
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
    let path = node.path;
    path = path.substr(path.indexOf('/repos/')+7)
    let name = node.name;
    let html = '';

    if(type == 'file'){
        html += `<div class="node" path = `+path+` onclick="files.edit(this)">
            <label class="`+type+`"  >`+name+`</label>
        </div>`;

    }else if(type == 'folder' ) {
        html = `<div class="node" path = `+path+`>
                    <label class="`+type+`">`+name+`</label>`;

        node.children.forEach( node => {
            html+= renderNode(node);
        });
        
        html+= `</div>`;

    }
    console.log(html);

    return html;
}

let files = {};
files.editor = {
    currentFile : undefined ,
    current : undefined , 
    unsaved : new Map() , 
    open : (path , content) => {

        files.editor.currentFile = path;
        $('#code').innerHTML = ''+content+'';
        let mode = '';
        if(path.includes('.html'))
            mode = 'html/mixed';
        else if(path.includes('.css'))
            mode = 'css';
        else
            mode = 'javascript';
        console.log('mode'+mode);
        var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
            lineNumbers: true,
            styleActiveLine: true,
            matchBrackets: true,
            mode: mode
        });
        files.editor.current = editor;
    }
};

files.edit = (file) => {

    let path = file.getAttribute('path') ;
    console.log(path);

    if(files.editor.currentFile !=undefined) {
        files.editor.unsaved.set(files.editor.currentFile,files.editor.current.getValue());
        console.log(' data '+files.editor.current.getValue());
    }

    let unsaved = false;
    files.editor.unsaved.forEach( (value,key) => {
       console.log('path '+path+' key '+key+' value'+value);

        if( key == path ){
            files.editor.open(key, value );
            unsaved = true;
        }
    } );

    if(!unsaved)
    axios.post('/repo/get',{filename:path}).then((res)=>{
        console.log('res:'+JSON.stringify(res));
        if(res.data!=undefined){
            files.editor.open(path,res.data);
        }
    }).catch((err)=>{
        console.log('err :'+err);
    });

};

let floatingOptions =  {
 saveCurrent : () => {
     let data = {
            filename : files.editor.currentFile,
            content : files.editor.current.getValue()
     };

    axios.post('/repo/saveFile',data).then((res)=>{
        console.log('res:'+JSON.stringify(res));
        if(res.data!=undefined){
            console.log(res);
        }
    }).catch((err)=>{
        console.log('err :'+err);
    });
 } ,

 runFile : () => {
    let data = {
        filename : files.editor.currentFile
    };

    if(data.filename.includes('.html')) {
        $('.out-frame iframe').src = data.filename.substr(data.filename.indexOf('/'));
        $('#out').classList.add("show");
    }
    
 },
 showOut : ()=>{
    $('#out').classList.add("show");
}

};

