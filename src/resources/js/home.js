if($==undefined)
    var $ = (exp) => document.querySelector(exp); 
if($$==undefined)
    var $$ = (exp) => document.querySelectorAll(exp);

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
        let optionsHtml = `
        <div class="footer-options">
        <div class="options">
            <div class="option" onclick="options.addFolder();">  <div class="option-icon add-folder"></div> </div>
            <div class="option" onclick="options.addFile()"> <div class="option-icon add-file" > </div> </div>
            <div class="option" onclick="options.delete()"> <div class="option-icon delete-file" > </div> </div>
            <div class="option" onclick="options.rename()">  <div class="option-icon rename-file" ></div> </div>
        </div>
    </div>
    `;
        let bottomOptions = `
            <div class="bottom-options">
                <button class="new-project" onclick="files.newProject()">New Project</button>
            </div>
        `;
        let html = '<div class="nodes-wrapper">' +
        explorerHtml(nodes) + '</div>';

        $('.explorer .nodes').innerHTML = optionsHtml + html +   bottomOptions;

        addSideExplorerClicks();

}
let explorerHtml = (nodes)=> {
    let html = '';
    nodes.forEach( node => {
        html+= renderNode(node);
    });
    return html;
};

let addSideExplorerClicks = () => {
    $$('.explorer .node label').forEach( el => {
        el.addEventListener( 'click' , () => { 
            el.parentElement.classList.toggle("fold");
            files.explorer.select(el);
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
files.explorer = {
    selected : undefined,
    select : (el) => {
        if(files.explorer.selected!=undefined){
            files.explorer.selected.classList.remove('selected');
        }
        files.explorer.selected = el;
        files.explorer.selected.classList.add('selected');
    }
};

files.refreshExplorer = () => {
    axios.post('/repo/repostree',{}).then((res)=>{
        console.log('res:'+JSON.stringify(res.data));    
        let html = explorerHtml(res.data.children);
        $('.explorer .nodes .nodes-wrapper').innerHTML = html;
        addSideExplorerClicks(); 
    }).catch((err)=>{
        console.log('err :'+err);
    });
};

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
        if(files.editor.current!=undefined)
            files.editor.current.toTextArea();

        var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
            lineNumbers: true,
            styleActiveLine: true,
            matchBrackets: true,
            mode: mode
        });
        files.editor.current = editor;
        
        //stop loading
        loading($('.body'));

    }
};

files.edit = (file) => {

    loading($('.body'), true);

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

files.newFolder = () => {

}

files.newProject = () => {
    console.log('creating new project');
    $.dailog($('.body') , {
        title : 'Create New Project' ,
        subject : '' ,
        body : `
        <label>Enter Project Name : </label> <br/>
        <input type="text" class="text" id="proj" />
        ` ,
        onSubmit : (dailog) => {
            let proj = $.$( dailog , '#proj').value;
            console.log(' proj name : '+ proj);

            axios.post('/repo/newFile',{name:proj , type:'folder'}).then((res)=>{
                console.log('res:'+JSON.stringify(res));
                files.refreshExplorer();
            }).catch((err)=>{
                console.log('err :'+err);
            });
        }
    });
}

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

