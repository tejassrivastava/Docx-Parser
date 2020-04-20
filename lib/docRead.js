const StreamZip = require('node-stream-zip');
const parseString = require('xml2js').parseString;
module.exports = {

    open: function(filePath) {
        return new Promise(
            function(resolve, reject) {
                const zip = new StreamZip({
                    file: filePath,
                    storeEntries: true
                })

                zip.on('ready', () => {
                    var chunks = []
                    var content = ''
                    zip.stream('word/document.xml', (err, stream) => {
                        if (err) {
                            reject(err)
                        }
                        stream.on('data', function(chunk) {
                            chunks.push(chunk)
                        })
                        stream.on('end', function() {
                            content = Buffer.concat(chunks)
                            zip.close()
                            resolve(content.toString())
                        })
                    })
                })
            }
        )
    },

    extract: function(filePath) {
        return new Promise(
            function(resolve, reject) {
                module.exports.open(filePath).then(function (res, err) {
                    if (err) { 
                        reject(err) 
                    }
                    
                    var body = ''
                    var components = res.toString().split('<w:t')
                    // parseString(res, function (err, result) {
                    //     console.log(result);
                    // });
                    for(var i=0;i<components.length;i++) {
                        var tags = components[i].split('>')
                        var content = tags[1].replace(/<.*$/,"")
                        console.log(content);
                    }

                    resolve(body)
                })
            }
        )
    }

}

return module.exports