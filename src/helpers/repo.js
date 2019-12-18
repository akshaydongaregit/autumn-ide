let fs = require('fs');
let fse = require('fs-extra');
let path = require('path');

exports.save = (data) =>{
    console.log('data'+JSON.stringify(data));
    fs.writeFile(global.root + '/repos/'+data.filename , data.content , (err) => {
        console.log('err '+err);
        if(err!=null)    
            return {result:'err:'+err};
        else 
            return {result:'sucess'};
    });
};
exports.get = (data) => {
    let filename = data.filename;
    console.log();
    res.send();
}

const dirTree = (filename) => {
    var stats = fs.lstatSync(filename),
        info = {
            path: filename,
            name: path.basename(filename)
        };

    if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(filename).map(function(child) {
            return dirTree(filename + '/' + child);
        });
    } else {
        // Assuming it's a file. In real life it could be a symlink or
        // something else!
        info.type = "file";
    }

    return info;
};

exports.create = ( file ) => {
    let path = global.root + '/repos/' + file.name;
    if(file.type == 'folder') {
        if(!fs.existsSync(path))
            fs.mkdirSync(path);
    }
    else if(file.type == 'file' ) {
        if(!fs.existsSync(path)) { 
            let stream = fs.createWriteStream(path);
            stream.end();
        }
    }
};

exports.delete = ( file ) => {
    let path = global.root + '/repos/' + file.name;
    if(file.type == 'folder') {
        if(!fs.existsSync(path))
            fse.remove(path,()=>{
                console.log('deleted '+path);
            });
    }
    else if(file.type == 'file' ) {
        if(fs.existsSync(path)) {
            fs.unlink(path , (err) => {
                console.log('err '+ err);
            } );
        }
    }
};

exports.dirTreeByLogin = (login) => {
    console.log(dirTree(global.root + '/repos/'+login ));
    return dirTree(global.root + '/repos/'+login );
}


exports.dirTree = dirTree;