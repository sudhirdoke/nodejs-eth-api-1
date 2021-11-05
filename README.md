# nodejs-eth-api-1
repository to help developing node js express api with Ganache block chain on local machine
keywords etherium github nodejs express api truffle

## Before start
make sure you have truffle/ganache installed and running on your local machine
then compile and migrate the project on local blockchain, open Ganache dashboad
and make sure it is running on post 7545, otherwise make change in truffle-config.js file
and change the port to appropriate port number

```bash
truffle compile
truffle migrate
```

once successfully migrated, run following command to start express api listening to port 8081

```bash
node appMain.js
```

use following url to check record, there should be first record added in the contract

```bash
http://127.0.0.1:8081/getAllRecords
```

**IMP**
change the Account address in appMain.js, with your address of first account, displayed on Ganache dashboard
