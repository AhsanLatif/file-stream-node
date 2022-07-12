const myargs = process.argv.slice(2);
const inputfile = myargs[1];
const outputfile = myargs[3];

var fs = require('fs'),
    path = require('path'),    
    inputFilePath = path.join(__dirname, inputfile),
    outputFilePath = path.join(__dirname, outputfile);

const stream = require('stream');
const readStream = fs.createReadStream(inputFilePath);  
const writeStream = fs.createWriteStream(outputFilePath);

var xtream = new stream.Transform( );
writeStream.write('[');
var chunkNo = 0;
xtream._transform = function(chunk, encoding, done) {
	var strData = chunk.toString();

	if (this._invalidLine) {
		strData = this._invalidLine + strData;
	};

	var objLines = strData.split("\n"); 
	this._invalidLine = objLines.splice(objLines.length-1, 1)[0];  
    console.log(this._invalidLine);
    let jsonError = '';
    objLines.forEach(line => {
        let data = line.split(' - ');
        let transactionDetail = JSON.parse(data[2])
        const date = new Date(data[0]);
        const timestamp = date.getTime();
        if (data[1] === 'error'){
            let log = {
                "timestamp": timestamp,
                "loglevel": data[1],
                "transactionId": transactionDetail['transactionId'],
                "err": transactionDetail['details']
            }
            let sentence = JSON.stringify(log);
            if(jsonError == '')
                if(chunkNo == 0)
                    jsonError = sentence;
                else    
                    jsonError = ',' + sentence;
            else
                jsonError = jsonError + ',' + sentence;
        }
    });
    if (jsonError != '')
        chunkNo++;
	this.push(jsonError);
    
	done();
};

xtream._flush = function(done) {
	if (this._invalidLine) {   
		this.push(this._invalidLine); 
	};

	this._invalidLine = null;
    this.push(']')
	done();
};

readStream.pipe(xtream).pipe(writeStream).on('finish', () => {

        });
