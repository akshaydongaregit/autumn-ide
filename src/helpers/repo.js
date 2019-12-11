let fs = require('fs');
let path = require('path');

exports.save = (data) =>{
    console.log('data'+JSON.stringify(data));
    fs.writeFile('../../repos/'+data.file , data.content , (err) => {
        if(err)    
            return {result:'err:'+err};
        else 
            return {result:'sucess'};
    });
};

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

exports.dirTreeByLogin = (login) => {
    console.log(dirTree(global.root + '/repos/'+login ));
    return dirTree(global.root + '/repos/'+login );
}

exports.dirTree = dirTree;