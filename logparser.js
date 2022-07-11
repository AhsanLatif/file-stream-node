const readline = require('readline');
const myargs = process.argv.slice(2);
const inputfile = myargs[1];
const outputfile = myargs[3];
// console.log(inputfile)
// console.log(outputfile)
var fs = require('fs'),
    path = require('path'),    
    filePath = path.join(__dirname, inputfile);
    console.log(filePath);

const file = readline.createInterface({
    input: fs.createReadStream(filePath),
    output: process.stdout,
    terminal: false
});

file.on('line', (line) => {
    let data = line.split(' - ');
    let transactionDetail = JSON.parse(data[2])
    const date = new Date(data[0]);
    const timestamp = date.getTime();
    let log = {
        "timestamp": timestamp,
        "loglevel": data[1],
        "transactionId": transactionDetail['transactionId'],
        "err": transactionDetail['details']
    }
    console.log(log);
});

// {"timestamp":1628475171259,"loglevel":"error","transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","err":"Not found"}


// [{"timestamp": <Epoch Unix Timestamp>, "loglevel": "<loglevel>", "transactionId: "<UUID>", "err": "<Error message>" }]

// let abc = [1,2,3,4,5];
// // abc.forEach(item => {
// //     console.log(item)
// // })
// let ghi = {}
// for (let item of abc){
//     // console.log(item)
// }

// for (let item in abc){
//     ghi[item] = 'test';
    
// }

// // for (let item in ghi){

// //     console.log(ghi[item])
// // }

// let res = abc.map(item => {
//     return item * 2;
    
// })

// console.log(res)