
var express = require('express');
var config = require('../routes/config.json');
var Txs = require('ethereumjs-tx').Transaction;
var request = require("request");
var Web3 = require('web3');
const httpEndPoint = config.connectionURL;
var web3 = new Web3(new Web3.providers.HttpProvider(httpEndPoint));
const contractAddress = config.contractAddress;
const abi = require('../controller/abi.json');
const axios = require('axios');

module.exports = {

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------------------------API FOR ERC20 FUNCTIONALITY------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------//

getTokenOwner: async (req, res) => {
    try {
        var newContract = await new web3.eth.Contract(abi,contractAddress);
        var resp = await newContract.methods.getowner().call();
        let response = {status:true, address:resp};
        res.send(response);
    } catch(err){
        let response = {status:false, message:"Unable to get Owner Address, Please Try Again!!!"};
        res.send(response);
    }
},

getTokenOwnerBalance: async (req, res) => {
    try {
        var newContract = await new web3.eth.Contract(abi,contractAddress);
        if(req.query.address && !req.query.address == ""){
            var resp = await newContract.methods.balanceOf(req.query.address).call();
            let response = {status:true, balance:resp};
            res.send(response);
        } else {
            let response = {status:false, message:"Enter Valid Address & Try Again!!!"};
            res.send(response);
        }
    } catch(err){
        let response = {status:false, message:"Unable to get Owner Token Balance, Please Try Again!!!"};
        res.send(response);
    }
},

getTokenName: async (req, res) => {
    try {
        var newContract = await new web3.eth.Contract(abi,contractAddress);
        var resp = await newContract.methods.name().call();
        let response = {status:true, name:resp};
        res.send(response);
    } catch(err){
        let response = {status:false, message:"Unable to get token Name, Please Try Again!!!"};
        res.send(response);
    }
},

getTokenSymbol: async (req, res) => {
    try {
        var newContract = await new web3.eth.Contract(abi,contractAddress);
        var resp = await newContract.methods.symbol().call();
        let response = {status:true, symbol:resp};
        res.send(response);
    } catch(err){
        let response = {status:false, message:"Unable to get Token Symbol, Please Try Again!!!"};
        res.send(response);
    }
},

getTokenTotalSupply: async (req, res) => {
    try {
        var newContract = await new web3.eth.Contract(abi,contractAddress);
        var resp = await newContract.methods.totalSupply().call();
        let response = {status:true, totalSupply:resp};
        res.send(response);
    } catch(err){
        let response = {status:false, message:"Unable to get Token Total Supply, Please Try Again!!!"};
        res.send(response);
    }
},

approveToken: async (req, res) => {
    try {
    var gasPrice = '0x09184e72a000';
    var gasLimit = 55000;
    var count = await web3.eth.getTransactionCount(req.body.fromAddress);
    var contract = await new web3.eth.Contract(abi,contractAddress,{from: req.body.fromAddress});    
    var chainId = 0x01;

    var rawTx = {
        "from": req.body.fromAddress,
        "nonce": "0x" + count.toString(16),
        "gasPrice": gasPrice,
        "gasLimit": gasLimit,
        "to": contractAddress,
        "value": "0x0", // Indication that we are not sending any ethers but our own tokens
        "data": contract.methods.approve(req.body.toAddress, req.body.amount).encodeABI(),
        "chainId": chainId
    };

    var privKeyBuffer = new Buffer(req.body.privateKey, 'hex');
    const tx = new Txs(rawTx,{'chain':'mainnet'});
    tx.sign(privKeyBuffer);
    web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), function(error, tHash) {

    if (error){
    let response = '{"status":"false","hash":"","error":"'+error+'"}';
    res.send(JSON.parse(response));
    }
    else {
    let response = '{"status":"true","hash":"'+tHash+'","error":""}';
    res.send(JSON.parse(response));
    }});
    } catch(err){
        let response = {status:false, message:"Unable to Approve Token, Please Try Again!!!"};
        res.send(response);
    }
},

transferToken: async (req, res) => {
    try {
    var gasPrice = '0x09184e72a000';
    var gasLimit = 55000;
    var count = await web3.eth.getTransactionCount(req.body.fromAddress);
    var contract = await new web3.eth.Contract(abi,contractAddress,{from: req.body.fromAddress});    
    var chainId = 0x01;

    var rawTx = {
        "from": req.body.fromAddress,
        "nonce": "0x" + count.toString(16),
        "gasPrice": gasPrice,
        "gasLimit": gasLimit,
        "to": contractAddress,
        "value": "0x0", // Indication that we are not sending any ethers but our own tokens
        "data": contract.methods.transfer(req.body.toAddress, req.body.amount).encodeABI(),
        "chainId": chainId
    };

    var privKeyBuffer = new Buffer(req.body.privateKey, 'hex');
    const tx = new Txs(rawTx,{'chain':'mainnet'});
    tx.sign(privKeyBuffer);
    web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), function(error, tHash) {

    if (error){
    let response = '{"status":"false","hash":"","error":"'+error+'"}';
    res.send(JSON.parse(response));
    }
    else {
    let response = '{"status":"true","hash":"'+tHash+'","error":""}';
    res.send(JSON.parse(response));
    }});
    } catch(err){
        let response = {status:false, message:"Unable to Transfer Token, Please Try Again!!!"};
        res.send(response);
    }
},

transferFrom: async (req, res) => {
    try {
    var gasPrice = '0x09184e72a000';
    var gasLimit = 55000;
    var count = await web3.eth.getTransactionCount(req.body.fromAddress);
    var contract = await new web3.eth.Contract(abi,contractAddress,{from: req.body.fromAddress});    
    var chainId = 0x01;

    var rawTx = {
        "from": req.body.fromAddress,
        "nonce": "0x" + count.toString(16),
        "gasPrice": gasPrice,
        "gasLimit": gasLimit,
        "to": contractAddress,
        "value": "0x0", // Indication that we are not sending any ethers but our own tokens
        "data": contract.methods.transferFrom(req.body.fromAddress, req.body.toAddress, req.body.amount).encodeABI(),
        "chainId": chainId
    };

    var privKeyBuffer = new Buffer(req.body.privateKey, 'hex');
    const tx = new Txs(rawTx,{'chain':'mainnet'});
    tx.sign(privKeyBuffer);
    web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), function(error, tHash) {

    if (error){
    let response = '{"status":"false","hash":"","error":"'+error+'"}';
    res.send(JSON.parse(response));
    }
    else {
    let response = '{"status":"true","hash":"'+tHash+'","error":""}';
    res.send(JSON.parse(response));
    }});
    } catch(err){
        console.log(err)
        let response = {status:false, message:"Unable to Transfer Token, Please Try Again!!!"};
        res.send(response);
    }
},

burnToken: async (req, res) => {
    try {
    var gasPrice = '0x09184e72a000';
    var gasLimit = 55000;
    var count = await web3.eth.getTransactionCount(req.body.fromAddress);
    var contract = await new web3.eth.Contract(abi,contractAddress,{from: req.body.fromAddress});    
    var chainId = 0x01;

    var rawTx = {
        "from": req.body.fromAddress,
        "nonce": "0x" + count.toString(16),
        "gasPrice": gasPrice,
        "gasLimit": gasLimit,
        "to": contractAddress,
        "value": "0x0", // Indication that we are not sending any ethers but our own tokens
        "data": contract.methods.burn(req.body.amount).encodeABI(),
        "chainId": chainId
    };

    var privKeyBuffer = new Buffer(req.body.privateKey, 'hex');
    const tx = new Txs(rawTx,{'chain':'mainnet'});
    tx.sign(privKeyBuffer);
    web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), function(error, tHash) {

    if (error){
    let response = '{"status":"false","hash":"","error":"'+error+'"}';
    res.send(JSON.parse(response));
    }
    else {
    let response = '{"status":"true","hash":"'+tHash+'","error":""}';
    res.send(JSON.parse(response));
    }});
    } catch(err){
        console.log(err)
        let response = {status:false, message:"Unable to Burn Token, Please Try Again!!!"};
        res.send(response);
    }
},

transferOwnership: async (req, res) => {
    try {
    var gasPrice = '0x09184e72a000';
    var gasLimit = 55000;
    var count = await web3.eth.getTransactionCount(req.body.fromAddress);
    var contract = await new web3.eth.Contract(abi,contractAddress,{from: req.body.fromAddress});    
    var chainId = 0x01;

    var rawTx = {
        "from": req.body.fromAddress,
        "nonce": "0x" + count.toString(16),
        "gasPrice": gasPrice,
        "gasLimit": gasLimit,
        "to": contractAddress,
        "value": "0x0", // Indication that we are not sending any ethers but our own tokens
        "data": contract.methods.transferOwnership(req.body.newAddress).encodeABI(),
        "chainId": chainId
    };

    var privKeyBuffer = new Buffer(req.body.privateKey, 'hex');
    const tx = new Txs(rawTx,{'chain':'mainnet'});
    tx.sign(privKeyBuffer);
    web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), function(error, tHash) {

    if (error){
    let response = '{"status":"false","hash":"","error":"'+error+'"}';
    res.send(JSON.parse(response));
    }
    else {
    let response = '{"status":"true","hash":"'+tHash+'","error":""}';
    res.send(JSON.parse(response));
    }});
    } catch(err){
        console.log(err)
        let response = {status:false, message:"Unable to Transfer Ownership, Please Try Again!!!"};
        res.send(response);
    }
},


//-------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------------------API FOR POWERBALL FUNCTIONALITY----------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------//

getSaleIdNow: async (req, res) => {
    try {
        var newContract = await new web3.eth.Contract(abi,contractAddress);
        var resp = await newContract.methods.getSaleIdNow().call();
        let response = {status:true, Id:resp};
        res.send(response);
    } catch(err){
        let response = {status:false, message:"Unable to get Sale ID , Please Try Again!!!"};
        res.send(response);
    }
},

getStartTime: async (req, res) => {
    try {
        var newContract = await new web3.eth.Contract(abi,contractAddress);
        if(req.query.saleId && !req.query.saleId == ""){
            var resp = await newContract.methods.getStartTime(req.query.saleId).call();
            let response = {status:true, time:resp};
            res.send(response);
        } else {
            let response = {status:false, message:"Enter Valid Sale Id & Try Again!!!"};
            res.send(response);
        }
    } catch(err){
        let response = {status:false, message:"Unable to get Start Time by Sale ID, Please Try Again!!!"};
        res.send(response);
    }
},

getEndTime: async (req, res) => {
    try {
        var newContract = await new web3.eth.Contract(abi,contractAddress);
        if(req.query.saleId && !req.query.saleId == ""){
            var resp = await newContract.methods.getEndTime(req.query.saleId).call();
            let response = {status:true, time:resp};
            res.send(response);
        } else {
            let response = {status:false, message:"Enter Valid Sale Id & Try Again!!!"};
            res.send(response);
        }
    } catch(err){
        let response = {status:false, message:"Unable to get End Time by Sale ID, Please Try Again!!!"};
        res.send(response);
    }
},

getWinningNumber: async (req, res) => {
    try {
        var newContract = await new web3.eth.Contract(abi,contractAddress);
        // if(req.query.saleId && !req.query.saleId == ""){
            // var resp1 = await newContract.methods.getSaleIdNow().call();
            // var resp = await newContract.methods.getWinningNumber(resp1-1).call();
            await axios.get('https://www.powerball.com/api/v1/numbers/powerball/recent10?_format=json').then(async output => {
            //let response = { status: true, data: output.data };
            var winningNumb = (output.data[0].field_winning_numbers).split(',');
            let response = {status:true, number:winningNumb.slice(0, 5) , powerballNumber : winningNumb[5]};
            res.send(response);
            }).catch(err => {
                console.log(err)
                let response = { status: false, message: "Unable to get Recent Winners, Please Try Again!!!" };
                res.send(response);
            });
            
        // } else {
        //     let response = {status:false, message:"Enter Valid Sale Id & Try Again!!!"};
        //     res.send(response);
        // }
    } catch(err){
        console.log(err)
        let response = {status:false, message:"Unable to get Winning Number by Sale ID, Please Try Again!!!"};
        res.send(response);
    }
},

getWinningAmount: async (req, res) => {
    try {
        var newContract = await new web3.eth.Contract(abi,contractAddress);
        // if(req.query.saleId && !req.query.saleId == ""){
            var resp1 = await newContract.methods.getSaleIdNow().call();
            var resp = await newContract.methods.getWinningAmount(resp1-1).call();
            let response = {status:true, amount:resp};
            res.send(response);
        // } else {
        //     let response = {status:false, message:"Enter Valid Sale Id & Try Again!!!"};
        //     res.send(response);
        // }
    } catch(err){
        let response = {status:false, message:"Unable to get Winning Amount by Sale ID, Please Try Again!!!"};
        res.send(response);
    }
},

getWinningAddress: async (req, res) => {
    try {
        var newContract = await new web3.eth.Contract(abi,contractAddress);
        // if(req.query.saleId && !req.query.saleId == ""){
            var resp1 = await newContract.methods.getSaleIdNow().call();
            var resp = await newContract.methods.getWinningAddress(resp1-1).call();
            let response = {status:true, address:resp};
            res.send(response);
        // } else {
        //     let response = {status:false, message:"Enter Valid Sale Id & Try Again!!!"};
        //     res.send(response);
        // }
    } catch(err){
        let response = {status:false, message:"Unable to get Winning Address by Sale ID, Please Try Again!!!"};
        res.send(response);
    }
},

getAllSaleAddresses: async (req, res) => {
    try {
        var newContract = await new web3.eth.Contract(abi,contractAddress);
        if(req.query.saleId && !req.query.saleId == ""){
            var resp = await newContract.methods.getAllSaleAddressesBySaleID(req.query.saleId).call();
            let response = {status:true, addresses:resp};
            res.send(response);
        } else {
            let response = {status:false, message:"Enter Valid Sale Id & Try Again!!!"};
            res.send(response);
        }
    } catch(err){
        let response = {status:false, message:"Unable to get All Sale Addresses by Sale ID, Please Try Again!!!"};
        res.send(response);
    }
},

getAllParticipantAddresses: async (req, res) => {
    try {
        var newContract = await new web3.eth.Contract(abi,contractAddress);
        var resp = await newContract.methods.getAllParticipantAddresses().call();
        let response = {status:true, Addresses:resp};
        res.send(response);
    } catch(err){
        let response = {status:false, message:"Unable to get All Participant Addresses , Please Try Again!!!"};
        res.send(response);
    }
},

getTotalSaleAmountBySaleID: async (req, res) => {
    try {
        var newContract = await new web3.eth.Contract(abi,contractAddress);
        if(req.query.saleId && !req.query.saleId == ""){
            var resp = await newContract.methods.getTotalSaleAmountBySaleID(req.query.saleId).call();
            let response = {status:true, totalSaleAmount:resp};
            res.send(response);
        } else {
            let response = {status:false, message:"Enter Valid Sale Id & Try Again!!!"};
            res.send(response);
        }
    } catch(err){
        let response = {status:false, message:"Unable to get Total Sale Amount by Sale ID, Please Try Again!!!"};
        res.send(response);
    }
},

getTotalSaleAmountForAllSale: async (req, res) => {
    try {
        var newContract = await new web3.eth.Contract(abi,contractAddress);
        var resp = await newContract.methods.getTotalSaleAmountForAllSale().call();
        let response = {status:true, allSaleAmount:resp};
        res.send(response);
    } catch(err){
        let response = {status:false, message:"Unable to get All Sale Total Amount, Please Try Again!!!"};
        res.send(response);
    }
},

getParticipantCountBySaleId: async (req, res) => {
    try {
        var newContract = await new web3.eth.Contract(abi,contractAddress);
        if(req.query.saleId && !req.query.saleId == ""){
            var resp = await newContract.methods.getParticipantCountBySaleId(req.query.saleId).call();
            let response = {status:true, participantCount:resp};
            res.send(response);
        } else {
            let response = {status:false, message:"Enter Valid Sale Id & Try Again!!!"};
            res.send(response);
        }
    } catch(err){
        let response = {status:false, message:"Unable to get Participant Count by Sale ID, Please Try Again!!!"};
        res.send(response);
    }
},

getPriceOfOneTicket: async (req, res) => {
    try {
        var newContract = await new web3.eth.Contract(abi,contractAddress);
        var resp = await newContract.methods.getPriceOfOneTicket().call();
        let response = {status:true, price: resp/1000000000000000000};
        res.send(response);
    } catch(err){
        let response = {status:false, message:"Unable to get Price of One Ticket, Please Try Again!!!"};
        res.send(response);
    }
},

getticketNumberByAddress: async (req, res) => {
    try {
        var newContract = await new web3.eth.Contract(abi,contractAddress);
        if(req.query.saleId && !req.query.saleId == "" && req.query.address && !req.query.address == ""){
            var resp = await newContract.methods.getticketNumberByAddress(req.query.saleId, req.query.address).call();
            let response = {status:true, ticketNumber:resp};
            res.send(response);
        } else {
            let response = {status:false, message:"Enter Valid Sale Id or Address & Try Again!!!"};
            res.send(response);
        }
    } catch(err){
        let response = {status:false, message:"Unable to get Ticket Number by Sale ID, Please Try Again!!!"};
        res.send(response);
    }
},

getpurchaseTokenAmount: async (req, res) => {
    try {
        var newContract = await new web3.eth.Contract(abi,contractAddress);
        var resp = await newContract.methods.getpurchaseTokenAmount().call();
        let response = {status:true, tokenAmount:resp};
        res.send(response);
    } catch(err){
        let response = {status:false, message:"Unable to get Purchased token Amount, Please Try Again!!!"};
        res.send(response);
    }
},

getbuyerPoolAddress: async (req, res) => {
    try {
        var newContract = await new web3.eth.Contract(abi,contractAddress);
        var resp = await newContract.methods.getbuyerPoolAddress().call();
        let response = {status:true, address:resp};
        res.send(response);
    } catch(err){
        let response = {status:false, message:"Unable to get Buyer pool Address, Please Try Again!!!"};
        res.send(response);
    }
},

purchaseTicket: async (req, res) => {
    try {
    var convert = req.body.value * 1000000000000000000;
    var val = web3.utils.toHex(convert);
    var gasPrice = '0x09184e72a000';
    var gasLimit = 60000;
    var count = await web3.eth.getTransactionCount('0xf49ddDB0019ED8b03C03e75a9329a98746847dE5');
    var contract = await new web3.eth.Contract(abi,contractAddress,{from: req.body.fromAddress});    
    var chainId = 0x01;

    var rawTx = {
        "from": req.body.fromAddress,
        "nonce": "0x" + count.toString(16),
        "gasPrice": gasPrice,
        "gasLimit": gasLimit,
        "to": contractAddress,
        "value": val, 
        "data": contract.methods.purchaseTicket(req.body.ticketNumber).encodeABI(),
        "chainId": chainId
        };

    var privKeyBuffer = new Buffer(req.body.privateKey, 'hex');
    const tx = new Txs(rawTx,{'chain':'mainnet'});
    tx.sign(privKeyBuffer);
    web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), function(error, tHash) {

    if (error){
    let response = '{"status":"false","hash":"","error":"'+error+'"}';
    res.send(JSON.parse(response));
    }
    else{
    let response = '{"status":"true","hash":"'+tHash+'","error":""}';
    res.send(JSON.parse(response));
    }});
    } catch(err){
         console.log(err)
        let response = {status:false, message:"Unable to Purchase Ticket, Please Try Again!!!"};
        res.send(response);
    }
},

declareWinner: async (req, res) => {
    try {
    var convert = req.body.value * 1000000000000000000;
    var val = web3.utils.toHex(convert);
    var gasPrice = '0x09184e72a000';
    var gasLimit = 60000;
    var count = await web3.eth.getTransactionCount('0xf49ddDB0019ED8b03C03e75a9329a98746847dE5');
    var contract = await new web3.eth.Contract(abi,contractAddress,{from: req.body.fromAddress});    
    var chainId = 0x01;

    var rawTx = {
        "from": req.body.fromAddress,
        "nonce": "0x" + count.toString(16),
        "gasPrice": gasPrice,
        "gasLimit": gasLimit,
        "to": contractAddress,
        "value": val, 
        "data": contract.methods.declareWinner(req.body.winningSequence, req.body.powerballNumber, req.body.winnerAddressArray, req.body.winnerPositions, req.body.winnerAmountInWei).encodeABI(),
        "chainId": chainId
        };

    var privKeyBuffer = new Buffer(req.body.privateKey, 'hex');
    const tx = new Txs(rawTx,{'chain':'mainnet'});
    tx.sign(privKeyBuffer);
    web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), function(error, tHash) {

    if (error){
    let response = '{"status":"false","hash":"","error":"'+error+'"}';
    res.send(JSON.parse(response));
    }
    else{
    let response = '{"status":"true","hash":"'+tHash+'","error":""}';
    res.send(JSON.parse(response));
    }});
    } catch(err){
         console.log(err)
        let response = {status:false, message:"Unable to Declare Winner, Please Try Again!!!"};
        res.send(response);
    }
},
 
}
