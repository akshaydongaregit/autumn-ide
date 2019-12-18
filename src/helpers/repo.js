let fs = require('fs');
let fse = require('fs-extra');
let path = require('path');

exports.save = (data) =>{
    try { 
        console.log('data'+JSON.stringify(data));
        fs.writeFile(global.root + '/repos/'+data.filename , data.content , (err) => {
            console.log('err '+err);
            if(err!=null)    
                return {result:'err:'+err};
            else 
                return {result:'sucess'};
        });
    }catch(err) {
        console.log(err);
    }

};
exports.get = (data) => {
    try { 
    let filename = data.filename;
    console.log();
    res.send();
    }catch(err){
        console.log(err);
        res.send('');
    }
}

const dirTree = (filename) => {
    try { 
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
    }catch(err) {
        console.log(err);
        return err;
    }

};

exports.create = ( file ) => {
    try { 
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
    }catch(err) {
        console.log(err);
    }
};

exports.delete = ( file ) => {
    try { 
        let path = global.root + '/repos/' + file.name;
        if(file.type == 'folder') {
            if(fs.existsSync(path))
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
    }catch(err) {
        console.log(err);
    }
};
exports.rename = ( file ) => {
    try { 
        let path = global.root + '/repos/' + file.name;
        let newPath = global.root + '/repos/' + file.newName;
        
        if(file.type == 'folder') {
            if(fs.existsSync(path))
                fs.rename(path, newPath , (err)=>{
                    console.log('renamed '+path + ' to '+newPath + ' '+err);
                });
        }
        else if(file.type == 'file' ) {
            if(fs.existsSync(path)) {
                fs.rename(path, newPath , (err)=>{
                    console.log('renamed '+path + ' to '+newPath+' '+err);
                });
            }
        }
    }catch(err) {
        console.log(err);
    }
};

exports.dirTreeByLogin = (login) => {
    try { 
        console.log(dirTree(global.root + '/repos/'+login ));
        return dirTree(global.root + '/repos/'+login );
    }catch(err){
        console.log(err);
        return {};
    }

}


exports.dirTree = dirTree;