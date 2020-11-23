const web3 = require('web3');
const express = require('express');
const Tx = require('ethereumjs-tx');
const config = require('../routes/config.json');
const app = express();

//Infura HttpProvider Endpoint
web3js = new web3(new web3.providers.HttpProvider(config.connectionURL));


module.exports = {

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------API FOR ETH FUNCTIONALITY-------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------//
    

createAccount:  async (req, res) => {
    let account = await web3js.eth.accounts.create();
    let response = {status:true, data:account};
    res.send(response);
},
    
// getAccount: async (req, res) => {

//         let return_val = {
//             status: false,
//             data: ""  }

//             if (req.query.address && !req.query.address == "") {
//             await  web3js.eth.getAccount(req.query.address).then(output => {
//                 return_val.status = true;
//                 return_val.data = output;
//                 res.send(return_val);
//             }).catch(err => {
//                 let response = {status:false, message:"Unable to get account detail, Please Try Again!!!"};
//                 res.send(response);
//             });
//         } else {
//             let response = {status:false, message:"Enter valid Address & Try Again!!!"};
//             res.send(response);
//         }
//     },

getETHBalance:  async(req, res) => {

        if (req.query.address && !req.query.address == "") {
            await  web3js.eth.getBalance(req.query.address).then(output => {
                let balance = output/1000000000000000000;
                let response = {status:true, address:req.query.address, balance:balance};
                res.send(response);
            }).catch(err => {
                let response = {status:false, message:"Unable to get Balance Details, Please Try Again!!!"};
                res.send(response);
            });
        } else {
            let response = {status:false, message:"Enter valid Address & Try Again!!!"};
            res.send(response);
        }
},
    
getTransactionByHash: async (req, res) => {
        let return_val = {
            status: false,
            data: "" }    
        if (req.query.hash && !req.query.hash == "") {
          await  web3js.eth.getTransaction(req.query.hash).then(output => {
                return_val.status = true;
                return_val.data = output;
                res.send(return_val);
            }).catch(err => {
                let response = {status:false, message:"Unable to get Transaction Details by Hash, Please Try Again!!!"};
                res.send(response);
            });
        } else {
            let response = {status:false, message:"Enter valid Hash & Try Again!!!"};
            res.send(response);
        }
},
    
// getTransactionsByAddress: async (req, res) => {
        
//         if (req.query.address && !req.query.address == "") {
//             axios.get('https://api.shasta.trongrid.io/v1/accounts/'+req.query.address+'/transactions').then(output=>{
//                res.send(output.data);
//             }).catch(err => {
//                 let response = {status:false,message:"Unable to get Transaction Details by Address, Please Try Again!!!"};
//                 res.send(response);
//             });
//         } else {
//             let response = {status:false, message:"Enter valid Address & Try Again!!!"};
//             res.send(response);
//         }
//     },
    
getTransactionByBlock: async (req, res) => {

        let return_val = {
            status: false,
            data: "" }
        if (req.query.block && !req.query.block == "") {
            await web3js.eth.getTransactionFromBlock(req.query.block,10).then(async output => {
                return_val.status = true;
                return_val.data = output;
                res.send(return_val);
            }).catch(err => {
                let response = {status:false, message:"Unable to get Transaction Details by Block, Please Try Again!!!"};
                res.send(response);
            });
        } else {
            let response = {status:false, message:"Enter valid Block Height & Try Again!!!"};
            res.send(response);
        }
},
    
getStatus: async (req, res) => {

        let return_val = {
            status: false,
            data: ""}
        await web3js.eth.getNodeInfo().then(output => {
            return_val.status = true;
            return_val.data = output;
            res.send(return_val);
        }).catch(err => {
            let response = {status:false, message:"Unable to get Status, Please Try Again!!!"};
            res.send(response);
        })
},
}