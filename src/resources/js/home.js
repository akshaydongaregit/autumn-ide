if($==undefined)
    var $ = (exp) => document.querySelector(exp); 
if($$==undefined)
    var $$ = (exp) => document.querySelectorAll(exp);

let menu = {};
    
let init = () => {
    $.loading($('.body'), true);
        axios.post('/repo/repostree',{}).then((res)=>{
            console.log('res:'+JSON.stringify(res.data));    
            initSideExplorer(res.data);
        }).catch((err)=>{
            console.log('err :'+err);
        });
    $.loading($('.body'));
    
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
    path = path.substr(path.indexOf('/repos/')+7);
    console.log(' path : '+ path + '  , ' + node.path );
    let name = node.name;
    let html = '';

    if(type == 'file'){
        html += `<div class="node" path = "`+path+`" onclick="files.edit(this)" type="file">
            <label class="`+type+`"  >`+name+`</label>
        </div>`;

    }else if(type == 'folder' ) {
        html = `<div class="node" path = "`+path+`" type="folder">
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

        if(files.editor.current!=undefined)
            files.editor.current.toTextArea();

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
        editor.getDoc().setValue(content);

        files.editor.current = editor;
        
        //stop loading
        $.loading($('.body'));

    }
};

files.edit = (file) => {

    $.loading($('.body'), true);

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
    $.loading($('.body'), true);
    try {
     let data = {
            filename : files.editor.currentFile,
            content : files.editor.current.getValue()
     };

    axios.post('/repo/saveFile',data).then((res)=>{
        console.log('res:'+JSON.stringify(res));
        if(res.data!=undefined){
            console.log(res);
        }
        $.loading($('.body'));
    }).catch((err)=>{
        $.loading($('.body'));
        console.log('err :'+err);
    });
    }catch(err){
        $.loading($('.body'));
    }
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

let options = {
    add : (type) => {
        $.dailog($('.body') , {
            title : 'Add ' + type,
            subject : '' ,
            body : `
            <label>Enter `+type+` Name : </label> <br/>
            <input type="text" class="text" id="name" />
            ` ,
            submitText : 'add' ,
            cancelText : 'close' ,
            onSubmit : (dailog) => {
                let name = $.$( dailog , '#name').value;
                console.log(' name : '+ name);
                let selectedpath = files.explorer.selected.parentElement.getAttribute('path');
                if(files.explorer.selected.parentElement.getAttribute('type')=='file')
                selectedpath = selectedpath.substr(0 , selectedpath.lastIndexOf('/'));

                let path = selectedpath.substring(selectedpath.indexOf('/')+1) + '/' + name;
                console.log(path);

                axios.post('/repo/newFile',{name:path , type:type}).then((res)=>{
                    console.log('res:'+JSON.stringify(res));
                    files.refreshExplorer();
                }).catch((err)=>{
                    console.log('err :'+err);
                });
            }
        });
    } ,
    delete : () => {
        
        let path = files.explorer.selected.parentElement.getAttribute('path');
        path = path.substring(path.indexOf('/')+1) ;
        let type = files.explorer.selected.parentElement.getAttribute('type');

        $.dailog($('.body') , {
            title : 'Delete ' + type,
            subject : '' ,
            body : `
            <label>Confirm to delete `+type+` `+path+` : </label> <br/>
            ` ,
            submitText : 'Delete' ,
            cancelText : 'Cancel' ,
            onSubmit : (dailog) => {

                console.log(path);

                axios.post('/repo/deleteFile',{name:path , type:type}).then((res)=>{
                    console.log('res:'+JSON.stringify(res));
                    files.refreshExplorer();
                }).catch((err)=>{
                    console.log('err :'+err);
                });
            }
        });
    } ,
    addFolder : () => {
        options.add('folder');
    }  ,
    addFile : () => {
        options.add('file');
    }  ,
    rename : () => {
        let path = files.explorer.selected.parentElement.getAttribute('path');
        path = path.substring(path.indexOf('/')+1) ;
        let folder = path.substr(0 , path.lastIndexOf('/'));; 
        let type = files.explorer.selected.parentElement.getAttribute('type');

        $.dailog($('.body') , {
            title : 'Rename ' + type,
            subject : '' ,
            body : `
            <label>Enter new `+type+` Name : </label> <br/>
            <input type="text" class="text" id="name" />
            ` ,
            submitText : 'Rename' ,
            cancelText : 'Cancel' ,
            onSubmit : (dailog) => {

                let name = $.$( dailog , '#name').value;
                console.log(' name : '+ name);
                let newPath = folder + '/' + name;
                console.log(path+ ' , ' + newPath);

                axios.post('/repo/renameFile',{name:path , type:type , newName : newPath}).then((res)=>{
                    console.log('res:'+JSON.stringify(res));
                    files.refreshExplorer();
                }).catch((err)=>{
                    console.log('err :'+err);
                });
            }
        });
    } 
};