var express = require('express');
var app = express();
var fs = require("fs");
var myList = require("./src/abis/MyList.json")
var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'HTTP://127.0.0.1:7545');


async function setupContract() {
    const netId = await web3.eth.net.getId();
   const deployedNetwork = myList.networks[netId];
    var contract = new web3.eth.Contract(myList.abi, deployedNetwork && deployedNetwork.address);
    return contract;
}


app.get('/health', function (req, res) {
   /*fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
   });*/
   res.end("health ok");
})

app.get('/getRecordCount', async(req, res) => {
    try {
        const contract = await setupContract();
        const cnt = await contract.methods.recordCount().call();
        res.json("number of records:"+cnt);
    }catch(error)
    {
        res.json("error:"+error);
    }
    
})

  app.get('/getAllRecords', async(req, res) => {
    try {
        const contract = await setupContract();
        const cnt = await contract.methods.recordCount().call();
        
        const recArr = new Array(cnt);
        for(var i = 1; i<=cnt; i++)
        {
            const x = await contract.methods.records(i).call();
            recArr[i-1] = {"id": x[0], "data": x[1], "timestamp": x[2]};
        }
        res.json(recArr);
    }catch(error)
    {
        res.json("error:"+error);
    }
    
})

app.use(express.json())
app.post('/addRecord', async(req, res) => {
    try {
        const contract = await setupContract();
        const {data, timestamp} = req.body;
        const result = await contract.methods.createNewRecord(data, timestamp).send({from: "0xBFDFf35eACeA2De204a6ed30a7dB69Da510b8952", gas: 3000000});
        console.log(result.events.RecordCreated.returnValues[0]);
        
        //event will return values according to its index
        res.json("record added! id:"+result.events.RecordCreated.returnValues[0]);
    }catch(error)
    {
        res.json("error:"+error);
    }
})

app.use(express.json())
app.post('/updateRecord', async(req, res) =>{
    try {
        const contract = await setupContract();
        const {id, data, timestamp} = req.body;
        const result = await contract.methods.updateRecord(id, data, timestamp).send({from: "0xBFDFf35eACeA2De204a6ed30a7dB69Da510b8952", gas: 3000000});
        var msg = "record updated! id:"+id;
        if(typeof result.events.RecordUpdated == 'undefined')
            msg = "Record Not Found. Id:"+id;
        
        res.json(msg);
    }catch(error)
    {
        res.json("error:"+error);
    }

})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
