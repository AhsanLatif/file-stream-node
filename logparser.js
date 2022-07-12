const myargs = process.argv.slice(2);
const inputfile = myargs[1];
const outputfile = myargs[3];

if (inputfile && outputfile)
    getErrorsJsonFile(inputfile, outputfile);
else
    console.log("Input and output file name required")

function getErrorsJsonFile(inputfile, outputfile) {
    try {
        var fs = require('fs'),
            path = require('path'),
            inputFilePath = path.join(__dirname, inputfile),
            outputFilePath = path.join(__dirname, outputfile);

        const stream = require('stream');

        const readStream = fs.createReadStream(inputFilePath);
        const writeStream = fs.createWriteStream(outputFilePath);

        let xtream = new stream.Transform();

        let chunkNo = 0;
        xtream._transform = function (chunk, encoding, done) {
            let strData = chunk.toString();

            if (this._invalidLine) {
                strData = this._invalidLine + strData;
            };

            var objLines = strData.split("\n");
            this._invalidLine = objLines.splice(objLines.length - 1, 1)[0];
            let jsonError = '';
            objLines.forEach(line => {
                let data = line.split(' - ');
                let transactionDetail = JSON.parse(data[2])
                const date = new Date(data[0]);
                const timestamp = date.getTime();
                if (data[1] === 'error') {
                    let log = {
                        "timestamp": timestamp,
                        "loglevel": data[1],
                        "transactionId": transactionDetail['transactionId'],
                        "err": transactionDetail['details']
                    }
                    let sentence = JSON.stringify(log);
                    if (jsonError == '')
                        if (chunkNo == 0)
                            jsonError = '[' + sentence;
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

        xtream._flush = function (done) {
            if (this._invalidLine) {
                this.push(this._invalidLine);
            };

            this._invalidLine = null;
            this.push(']')
            done();
        };

        readStream.pipe(xtream).pipe(writeStream).on('finish', () => {
            console.log("Errors are written in " + outputFilePath)
        });
    } catch (exception_var) {
        console.log(exception_var);
    }
}