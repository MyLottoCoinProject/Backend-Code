const express = require('express');
const Web3 = require("web3");
const config = require('../routes/config.json');
const axios = require('axios');
const mongoose = require('mongoose');
var db = require('../db/db.js');
const JackpotDetails = mongoose.model('JackpotDetails');
var arrayFindDuplicates = require("array-find-duplicates")
const exactMath = require('exact-math');
const delay = require('delay');
var nrc = require('node-run-cmd');
var fromExponential = require("from-exponential")

//Contract Details
var Txs = require('ethereumjs-tx').Transaction;
var request = require("request");
const httpEndPoint = config.connectionURL;
var web3 = new Web3(new Web3.providers.HttpProvider(httpEndPoint));
const contractAddress = config.contractAddress;
const abi = require('../controller/abi.json');

// const ownerFromAddress = "0xB01662F17bdaA443b599fd32Ce4Dc97657B6080A";
// const ownerPrivateKey = "c67720cd6677d9244e59ff164dc3c2262b2c2e75d394cdb1a9ba7822de7ad735";
// const opexWallet = "0x1C8bB984468c26A0eF5e83b35cC4dEA5215ba5e0";
// const profitWallet = "0x3959907Ca87bcF914E55114b317c3BBEc4e5678e";
// const profitWalletPvtKey = "090e5782c564b5ce4647c7ea8be1a3a6c96c03e86a60b9b967b7eb3a6150123d";
const ownerFromAddress = config.ownerFromAddress;
const ownerPrivateKey = config.ownerPrivateKey;
const opexWallet = config.opexWallet;
const profitWallet = config.profitWallet;
const profitWalletPvtKey = config.profitWalletPvtKey;


var fs = require('fs');
const csv = require('csv-parser')



module.exports = {

    calculateEstimatedGas: async (req, res) => {
        try {
            console.log(req.body)
            let gasPrice = await web3.eth.getGasPrice();
            let total = 534171 * (req.body.numberOfTicket);
            res.send({ gasPrice: 2500000000, gasFees: parseInt(total) });
        }
        catch (err) {
            console.log(err)
        }
    },

    /**
    * @dev get recent Winner details
    * @return winning numbers and multiplier
    */
    getRecentWinnerDetail: async (req, res) => {

        await axios.get('https://www.powerball.com/api/v1/numbers/powerball/recent10?_format=json').then(async output => {
            let response = { status: true, data: output.data };
            res.send(response);
        }).catch(err => {
            let response = { status: false, message: "Unable to get Recent Winners, Please Try Again!!!" };
            res.send(response);
        });
    },

    /**
    * @dev get estimate Jackpot details
    * @return estimate jackpot price
    */
    getEstimateJackpotDetail: async (req, res) => {

        await axios.get('https://powerball.com/api/v1/estimates/powerball?_format=json').then(async output => {
            let response = { status: true, data: output.data };
            res.send(response);
        }).catch(err => {
            let response = { status: false, message: "Unable to get Estimated Jakpot Details, Please Try Again!!!" };
            res.send(response);
        });
    },

    /**
    * @dev get number of winner summary details
    * @return draw summary, primary winner state and secondary winner state
    */
    getWinnerSummaryDetail: async (req, res) => {

        await axios.get('https://powerball.com/api/v1/draw-summary/powerball?_format=json').then(async output => {
            let response = { status: true, data: output.data };
            res.send(response);
        }).catch(err => {
            let response = { status: false, message: "Unable to get Estimated Jakpot Details, Please Try Again!!!" };
            res.send(response);
        });
    },

    /**
    * @dev get price of next jackpot
    * @return price of next jackpot
    */
    getNextJackpotDetails: async (req, res) => {
        try {

            await web3js.eth.getBalance(contractAddress).then(async bal2 => {
                var newContract = await new web3.eth.Contract(abi, contractAddress);//creating contract object
                var saleIdNow = await newContract.methods.getSaleIdNow().call();
                var jackpotEndTime = await newContract.methods.getEndTime(saleIdNow - 1).call();
                await axios.get('https://www.powerball.com/api/v1/numbers/powerball/recent10?_format=json').then(async output1 => {
                    await axios.get('https://powerball.com/api/v1/estimates/powerball?_format=json').then(output => {
                        res.send({
                            data: [
                                {
                                    LastEndTime: new Date(output1.data[0].field_draw_date).getTime() / 1000,
                                    NextJackpotTime: (new Date(output.data[0].field_next_draw_date).getTime() / 1000) + 3,
                                    JackpotPrice: (bal2 / 1000000000000000000).toFixed(6)
                                }
                            ], status: true, err: ''
                        })
                    });
                });
            });
            // await JackpotDetails.find(async (err, docs) => {
            //     var newContract = await new web3.eth.Contract(abi, contractAddress);
            //     var saleIdNow = await newContract.methods.getSaleIdNow().call();
            //     var jackpotAmount = await newContract.methods.getTotalSaleAmountBySaleID(saleIdNow).call();
            //     var jackpotEndTime = await newContract.methods.getEndTime(saleIdNow - 1).call();
            //     res.send({
            //         data: [
            //             {
            //                 LastEndTime: jackpotEndTime,
            //                 NextJackpotTime: parseInt(jackpotEndTime) + 259200,
            //                 JackpotPrice: jackpotAmount / 1000000000000000000
            //             }
            //         ], status: true, err: ''
            //     })
            // })
        }
        catch (err) {
            res.send({ data: err.message, status: false, err: '' })
        }
    },


    declareWinnerNow: async (req, res, add) => {



        // var gasPrice = '0x09184e72a000';
        // var gasLimit = 55000;
        // var count = await web3.eth.getTransactionCount(ownerFromAddress);
        // var contract = await new web3.eth.Contract(abi,contractAddress,{from: ownerFromAddress});    
        // var chainId = 0x01;

        // var rawTx = {
        //     "from": ownerFromAddress,
        //     "nonce": "0x" + count.toString(16),
        //     "gasPrice": gasPrice,
        //     "gasLimit": gasLimit,
        //     "to": contractAddress,
        //     "value": "0x0", // Indication that we are not sending any ethers but our own tokens
        //     "data": contract.methods.setElapsedTime(req.body.time).encodeABI(),
        //     "chainId": chainId
        // };

        // var privKeyBuffer = new Buffer(ownerPrivateKey, 'hex');
        // const tx = new Txs(rawTx,{'chain':'mainnet'});
        // tx.sign(privKeyBuffer);
        // web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), function(error, tHash) {});



        console.log("Started the winner diclaration")
        try {
            await axios.get('https://www.powerball.com/api/v1/numbers/powerball/recent10?_format=json').then(async output => {
                // var output1 = '22,11,12,23,10,5' //For Testing Only
                // console.log("Started the winner diclaration")
                // output.data[0].field_winning_numbers = output1
                var winnerSrs = (((output.data[0].field_winning_numbers).split(',')).map(i => Number(i)));
                var d1 = (((output.data[0].field_winning_numbers).split(',')).map(i => Number(i))).slice(0, 5) // array from powerball website
                var newContract = await new web3.eth.Contract(abi, contractAddress);//creating contract object
                var preWinnerArray = {};//raw array for all participants
                var saleIdNow = await newContract.methods.getSaleIdNow().call();//get current sale id

                var allAddressesBySaleID = await newContract.methods.getAllSaleAddressesBySaleID(saleIdNow).call();//get list of all participants in this address
                var nextSaleIdAmount = await newContract.methods.getTotalSaleAmountBySaleID(saleIdNow + 1).call();//get the amount from the next sale which needs not to be included
                var totalSaleAmount = await web3js.eth.getBalance(contractAddress)-nextSaleIdAmount;
                // var totalSaleAmount = await newContract.methods.getTotalSaleAmountBySaleID(saleIdNow).call(); //total sale amount
                let unique = [...new Set(allAddressesBySaleID)];//get unique addresses from the list
                let counter = 0; //counter for functions balancing
                console.log(unique)
                // await unique.forEach(async element => {
                var b = 0;
                for (var l = 0; l <= unique.length; l++) {
                    console.log(unique[l])
                    if (unique[l]) {
                        var totalTicketsPurchased = await newContract.methods.getticketNumberByAddress(saleIdNow, unique[l]).call(); //get array of all purchases
                        var finalArr = await totalTicketsPurchased.map(i => Number(i)); //converting array of strings to number
                        for (i = 0; i < finalArr.length / 6; i++) {
                            preWinnerArray[b] = await { [unique[l]]: finalArr.slice(i * 6, ((i + 1) * 6)) } //slicing elements by 6 and pushing in an object
                            b = b + 1;
                        }

                        counter = counter + 1;
                    }
                    // if(unique.length == counter){
                    // console.log(preWinnerArray)
                    // }

                    if (unique.length == counter) {
                        var winnerData = [];
                        for (var key in preWinnerArray) {
                            for (var key2 in preWinnerArray[key]) {   //ex : { '0x0b78E45Ef37769cA074a7A49d9B4d20f4d9c836F': [ 6, 10, 8, 9, 18, 15 ] } 
                                var series = preWinnerArray[key][key2];
                                var d2 = await (preWinnerArray[key][key2]).slice(0, 5)                                             // array formed by user's data 
                                var comp = await d1.filter(element1 => d2.includes(element1))
                                if (comp.length > 2)                                                   // array comparision 
                                {
                                    if (winnerSrs[5] == series[5]) {

                                        await winnerData.push({ [key2]: { length: comp.length, powerball: true } })
                                    }
                                    else {
                                        await winnerData.push({ [key2]: { length: comp.length, powerball: false } })
                                    }
                                }
                            }
                        }

                        var winnerAddArray = [];
                        var winnerAmtArry = [];
                        var winnerPrize = [];
                        for (var key3 in winnerData) {
                            for (var key4 in winnerData[key3]) {
                                if (winnerData[key3][key4].length == 5 && winnerData[key3][key4].powerball == true) {
                                    await winnerAddArray.push(key4)
                                    await winnerAmtArry.push(totalSaleAmount * 0.888)
                                    await winnerPrize.push(1)
                                }
                                else if (winnerData[key3][key4].length == 5 && winnerData[key3][key4].powerball == false) {
                                    await winnerAddArray.push(key4)
                                    await winnerAmtArry.push(totalSaleAmount * 0.0888)
                                    await winnerPrize.push(2)
                                }
                                else if (winnerData[key3][key4].length == 4 && winnerData[key3][key4].powerball == true) {
                                    await winnerAddArray.push(key4)
                                    await winnerAmtArry.push(totalSaleAmount * 0.0188)
                                    await winnerPrize.push(3)
                                }
                                else if (winnerData[key3][key4].length == 4 && winnerData[key3][key4].powerball == false) {
                                    await winnerAddArray.push(key4)
                                    await winnerAmtArry.push(totalSaleAmount * 0.0022)
                                    await winnerPrize.push(4)
                                }
                                else if (winnerData[key3][key4].length == 3 && winnerData[key3][key4].powerball == true) {
                                    await winnerAddArray.push(key4)
                                    await winnerAmtArry.push(totalSaleAmount * 0.0022)
                                    await winnerPrize.push(5)
                                }
                            }
                        }
                        var ethToSend = await web3.utils.toHex((winnerAmtArry.reduce((a, b) => a + b, 0)));
                        var finalAmtToSend = [];
                        await winnerAmtArry.forEach(async data => {
                            await finalAmtToSend.push(await web3.utils.toHex(data))
                        })
                        var winningArrPre = await (((output.data[0].field_winning_numbers).split(',')).map(i => Number(i))).slice(0, 6)
                        var winningArr = (await ((output.data[0].field_winning_numbers).split(',')).map(i => Number(i))).slice(0, 5)
                        var pwrbl = winningArrPre[5]
                        // console.log("This is winner prize1", winnerPrize)

                        var finalPositions = [...winnerPrize];

                        // console.log("This is winner prize2", finalPositions)

                        let dividend = []
                        finalPositions.forEach(element => {
                            let counter = 0;
                            if (!dividend.some(e => e.position == element)) {
                                finalPositions.forEach(e => {
                                    if (element == e) {
                                        counter++
                                    }
                                });
                                dividend.push({ position: element, occurence: counter })
                            }
                        })

                        // var sorted_arr = finalPositions.sort();  //Finding duplicate winner to divide price
                        // var results = [];
                        // for (var i = 0; i < finalPositions.length - 1; i++) {
                        //     if (sorted_arr[i + 1] == sorted_arr[i]) {
                        //         results.push(sorted_arr[i]);
                        //     }
                        // }


                        // var res = [...results];
                        // var data = []
                        // var j = 0;
                        // res.forEach(async resp =>{
                        // for(i = 0; i < winnerPrize.length ; i++){

                        // if(resp == winnerPrize[i]){
                        //  data.push({[resp] : i})
                        // }
                        // }
                        // j++;
                        // if(res.length == j){
                        // }
                        // })
                        // var dividend = []
                        // res.forEach(logging =>{
                        //     let counter = 1;
                        //     for(var k = 0; k < results.length ; k++){
                        //         if(logging == results[k]){
                        //             counter = counter + 1;
                        //         }
                        //         if(k == results.length -1){
                        //             dividend.push({position : logging,occurence:counter })
                        //         }

                        //     }

                        // })
                        // console.log("This is winner prize", winnerPrize)

                        var finalAmtArray = [...winnerAmtArry];


                        // console.log("This is dividends", dividend);
                        // console.log("This is winner prize", winnerPrize);
                        // console.log("winner Amount", winnerAmtArry);

                        dividend.forEach((e, i) => {
                            winnerPrize.forEach((x, index) => {
                                if (x == e.position) {
                                    finalAmtArray[index] = parseInt(winnerAmtArry[index] / e.occurence);
                                }
                            });
                        });

                        // console.log("winner Amount", finalAmtArray);

                        var finalArrWithAmt = []
                        await finalAmtArray.forEach(async data => {
                            finalArrWithAmt.push(await web3.utils.toHex(parseInt(data)))
                        })


                        // dividend.forEach(async data =>{
                        //     for(var keyValue1 in data){
                        //         for(i = 0; i<finalPrizeArray.length; i++){
                        //             if(finalPrizeArray[i] == parseInt(keyValue1)){
                        //                 finalAmtArray[i] = await finalAmtArray[i]/data[keyValue1];
                        //             }
                        //         }
                        //     }
                        // })


                        // var finalAmontArray = [];
                        // var iterator = 0;
                        // for(var keyValue1 in dividend){
                        //     console.log(dividend[keyValue1])
                        //     winnerPrize.forEach(rslt =>{
                        //         var k = parseInt(keyValue1);
                        //         if (k == rslt){
                        //             console.log(winnerAmtArry[iterator],iterator)
                        //             winnerAmtArry[iterator] = winnerAmtArry[iterator]/5
                        //             if(iterator == winnerPrize.length+1){
                        //                 console.log(winnerAmtArry)
                        //             }
                        //         }
                        //         iterator ++;
                        //     })
                        // }
                        // console.log("Before Transaction Block")

                        // if (winnerAddArray.length == winnerAmtArry.length && winnerAmtArry.length == winnerPrize.length) {
                        try {
                            // console.log("Inside Transaction Block", winnerAddArray)
                            var gasPrice = 200;
                            var gasLimit = 5500000;
                            var count = await web3.eth.getTransactionCount(ownerFromAddress);
                            var contract = await new web3.eth.Contract(abi, contractAddress, { from: ownerFromAddress });
                            var chainId = 0x01;
                            var rawTx = {
                                "from": ownerFromAddress,
                                "nonce": "0x" + count.toString(16),
                                "gasPrice": gasPrice,
                                "gasLimit": gasLimit,
                                "to": contractAddress,
                                "value": '0x0',   //This displays that we are not sending any value from the msg sender except fees
                                "data": contract.methods.declareWinner(winningArr, pwrbl, winnerAddArray, winnerPrize, finalArrWithAmt).encodeABI(),
                                "chainId": chainId
                            };
                            var privKeyBuffer = new Buffer(ownerPrivateKey, 'hex');
                            const tx = new Txs(rawTx, { 'chain': 'mainnet' });
                            await tx.sign(privKeyBuffer);
                            await web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), function (error, tHash) {

                                if (error) {
                                    let response = '{"status":"false","hash":"","error":"' + error + '"}';
                                    if (res)
                                        res.send(JSON.parse(response));
                                }
                                else {
                                    let response = '{"status":"true","hash":"' + tHash + '","error":""}';
                                    if (res)
                                        res.send(JSON.parse(response));
                                }
                            });
                        } catch (err) {
                            console.log(err)
                            let response = { status: false, message: "Unable to Declare Winner, Please Try Again!!!" };
                            if (res)
                                res.send(response);
                        }
                        // }
                        // else {
                        //     if (res)
                        //         res.send("No winner elegible")
                        // }
                    }
                    // });
                }
            });
        } catch (err) {
            console.log(err)
            let response = { status: false, message: "Unable to Declare Winner, Please Try Again!!!" };
            res.send(response);
        }
    },

    distributeReward: async (req, res) => {
        // var addie = [ '0x09ced8ceb9b68db859a979b78eb49a25bb0697d6','0x0b78e45ef37769ca074a7a49d9b4d20f4d9c836f','0xb34afb91eeb2267fd243afa2f4b89ee3ebdd7a16'];
        // var amti = [1000,1000,1000];
        let datas = [];
        let unique = [];
        await fs.createReadStream('token_transfers.csv')
            .pipe(csv())
            .on('data', (data) => datas.push.apply(datas, [data.from_address.trim(), data.to_address.trim()]))
            .on('end', async () => {
                console.log(datas.length);
                let unique = [...new Set(datas)];
                datas = undefined;
                console.log(unique.length);

                let addwithBal = [];

                //For Demo

                // addwithBal = unique.map((e) => { return { add: e, bal: 5 } });

                const newContract = await new web3js.eth.Contract(abi, contractAddress);
                for (const address of unique) {
                    const resp = await newContract.methods.balanceOf(address).call();

                    if (resp / 1000000000000000000 >= 100 && address.toLowerCase() != ownerFromAddress.toLowerCase() && address.toLowerCase() != opexWallet.toLowerCase() && address.toLowerCase() != profitWallet.toLowerCase())
                        addwithBal.push({ add: address, bal: resp });

                    // addwithBal.push({ add: address, bal: 50000 })
                }
                unique = undefined;
                console.log(addwithBal);

                const totalTokenBalance = fromExponential(addwithBal.reduce((a, b) => exactMath.add(a, (b.bal || 0)), 0));
                console.log(totalTokenBalance);
                //if (req.query.address && !req.query.address == "") {
                await web3js.eth.getBalance(profitWallet).then(async output => {
                    let ethBalance = parseInt(output - output / 100);
                    console.log(ethBalance);
                    let value = fromExponential((exactMath.div(ethBalance, totalTokenBalance)));
                    console.log("This is the value now", value);
                    // let newBalance = [];
                    // console.log("here1")
                    // balance.forEach(async out1 => {
                    //     var finl = out1 * value * 1000000000000000000;
                    //     newBalance.push(parseInt(finl));
                    // })

                    addwithBal = addwithBal.map(x => {
                        x.bal = (x.bal * value);
                        return x;
                    })



                    // console.log("here2", newBalance)
                    // let totalNewBalance =fromExponential(addwithBal.reduce((a, b) => a + (toInt(b.bal) || 0), 0));
                    // console.log("totalNewBalance", totalNewBalance)
                    // console.log("This is new balance", newBalance)
                    // console.log("here3")
                    // var convert = totalNewBalance;
                    // var immediateBalance = newBalance.map(String)


                    //Start Paging Here

                    let pageSize = 20;
                    let pages = parseInt(addwithBal.length / pageSize) + ((addwithBal.length % pageSize) > 0 ? 1 : 0);


                    for (let index = 1; index <= pages; index++) {
                        await SendDataToBlockChainWithPagination(addwithBal, res, pageSize, index);
                        await new Promise(r => setTimeout(r, 60 * 1000));
                    }
                    // End Paging

                }).catch(err => {
                    console.log("here7")
                    console.log(err)
                });
            });
    },

    withdrawEth: async (req, res) => {
        try {
            var gasPrice = '0x09184e72a000';   //Gas price as per safe and static values
            var gasLimit = 55000;              //Gas limit for max gas to be used
            var count = await web3js.eth.getTransactionCount(ownerFromAddress);
            var contract = await new web3js.eth.Contract(abi, contractAddress, { from: ownerFromAddress });
            var chainId = 0x01;
            var contractBalance = await web3js.eth.getBalance(contractAddress);
            var saleIdNow = await contract.methods.getSaleIdNow().call();
            var totalLastSale = await contract.methods.getTotalSaleAmountBySaleID(saleIdNow).call();
            var deductingLastSaleLogic = contractBalance - (totalLastSale * 0.1);
            // console.log("This is contract balance", contractBalance)
            var profit = totalLastSale * 0.1;
            var opex = deductingLastSaleLogic * 0.05;
            var rawTx = {
                "from": ownerFromAddress,
                "nonce": "0x" + count.toString(16),
                "gasPrice": gasPrice,
                "gasLimit": gasLimit,
                "to": contractAddress,
                "value": "0x0", // Indication that we are not sending any ethers but our own tokens
                "data": contract.methods.withdrawETHFromContract(profit.toString(), ownerFromAddress, opex.toString(), opexWallet).encodeABI(),
                "chainId": chainId
            };

            var privKeyBuffer = new Buffer(ownerPrivateKey, 'hex');
            const tx = new Txs(rawTx, { 'chain': 'mainnet' });
            tx.sign(privKeyBuffer);
            await web3js.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), function (error, tHash) {
                res.send(tHash)
            });
            // await delay(1000000);//Profit Wallet
            // await web3js.eth.getBalance(ownerFromAddress).then(async bal => {
            // let status = await signTransaction(ownerFromAddress, profitWallet, parseInt(contractBalance * 0.1), ownerPrivateKey);
            // console.log("Here1")
            // var transaction = await web3js.eth.sendSignedTransaction(status, function (error, transactionHash){
            //     console.log("Profit Wallet Credited",transactionHash)
            // });
            // });

            // await delay(1000000);//Opex Wallet
            // await web3js.eth.getBalance(contractAddress).then(async bal2 => {
            // var rawTx = {
            //     "from": ownerFromAddress,
            //     "nonce": "0x" + count.toString(16),
            //     "gasPrice": gasPrice,
            //     "gasLimit": gasLimit,
            //     "to": contractAddress,
            //     "value": "0x0", // Indication that we are not sending any ethers but our own tokens
            //     "data": contract.methods.withdrawETHFromContract(bal2 * 0.05,opexWallet).encodeABI(),
            //     "chainId": chainId
            // };
            // var privKeyBuffer = new Buffer(ownerPrivateKey, 'hex');
            // const tx = new Txs(rawTx,{'chain':'mainnet'});
            // tx.sign(privKeyBuffer);
            // web3js.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), function(error, tHash) {
            //     res.send(tHash)
            // });
            // let status = await signTransaction(contractAddress, opexWallet, parseInt(bal2 * 0.05), ownerPrivateKey);
            // console.log("Here2")
            // var transaction = await web3js.eth.sendSignedTransaction(status, function (error, transactionHash){
            //     console.log("Opex Wallet Credited",transactionHash)
            //     res.send({Lasthash:transactionHash})
            // });
            // });
        } catch (err) {
            console.log(err)
        }

    },

    updateNextWithdrawTime: async (req, res) => {
        var gasPrice = '0x09184e72a000';   //Gas price as per safe and static values
        var gasLimit = 55000;              //Gas limit for max gas to be used
        var count = await web3js.eth.getTransactionCount(ownerFromAddress);
        var contract = await new web3js.eth.Contract(abi, contractAddress, { from: ownerFromAddress });
        var chainId = 0x01;
        var rawTx = {
            "from": ownerFromAddress,
            "nonce": "0x" + count.toString(16),
            "gasPrice": gasPrice,
            "gasLimit": gasLimit,
            "to": contractAddress,
            "value": "0x0", // Indication that we are not sending any ethers but our own tokens
            "data": contract.methods.setElapsedTime(req.body.nextTimeDiff - 7200).encodeABI(),
            "chainId": chainId
        };

        var privKeyBuffer = new Buffer(ownerPrivateKey, 'hex');
        const tx = new Txs(rawTx, { 'chain': 'mainnet' });
        tx.sign(privKeyBuffer);
        await web3js.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), function (error, tHash) {
            res.send(tHash)
        });
    },

    async updateNextWithdrawTimeMethod(dateElapse) {
        var gasPrice = '0x09184e72a000';   //Gas price as per safe and static values
        var gasLimit = 55000;              //Gas limit for max gas to be used
        var count = await web3js.eth.getTransactionCount(ownerFromAddress);
        var contract = await new web3js.eth.Contract(abi, contractAddress, { from: ownerFromAddress });
        var chainId = 0x01;
        var rawTx = {
            "from": ownerFromAddress,
            "nonce": "0x" + count.toString(16),
            "gasPrice": gasPrice,
            "gasLimit": gasLimit,
            "to": contractAddress,
            "value": "0x0", // Indication that we are not sending any ethers but our own tokens
            "data": contract.methods.setElapsedTime(parseInt(dateElapse) - 7200).encodeABI(),
            "chainId": chainId
        };

        var privKeyBuffer = new Buffer(ownerPrivateKey, 'hex');
        const tx = new Txs(rawTx, { 'chain': 'mainnet' });
        tx.sign(privKeyBuffer);
        await web3js.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), function (error, tHash) {
            console.log(tHash)
        });
    },

    exportCSV: async (req, res) => {
        axios.get("https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=" + parseInt(Date.now() / 1000) + "&closest=before&apikey=P67JC5SI1VAH8SUZ7T3R99PIQ1SNMTUDTM").then(async resp => {
            console.log(resp.data.result);
            var dataCallback = function (data) {
                console.log(data, "Executed")
                res.send(data)
            };
            var query1 = "ethereumetl export_token_transfers --start-block 8900141 --end-block " + resp.data.result + " --provider-uri http://35.183.116.112:8546 --output token_transfers.csv --tokens " + contractAddress;
            console.log(query1)
            let response1 = await nrc.run(query1, { onData: dataCallback });
            console.log(response1);
            if (response1[0] == 0) {
                res.send({ response: "query executed successfully" });
            }
        })
    }
}

async function SendDataToBlockChainWithPagination(addwithBal, res, pageSize, pageNumber) {
    // var val = web3.utils.toHex(totalNewBalance);
    var gasPrice = await web3.eth.getGasPrice() * 3;
    var gasLimit = 81000;
    var count = await web3.eth.getTransactionCount(profitWallet);
    var contract = await new web3.eth.Contract(abi, contractAddress, { from: profitWallet });
    var chainId = 0x01;
    var sendValue = paginate(addwithBal, pageNumber, pageSize).map(x => x.bal).reduce((a, b) => a + (b || 0), 0)
    console.log(await web3.utils.toHex(fromExponential(sendValue)));
    console.log(paginate(addwithBal, pageNumber, pageSize).map(x => x.add), paginate(addwithBal, pageNumber, pageSize).map(x => fromExponential(x.bal)))
    var rawTx = {
        "from": profitWallet,
        "nonce": "0x" + count.toString(16),
        "gasPrice": web3.utils.toHex(gasPrice),
        "gasLimit": gasLimit,
        "to": contractAddress,
        "value": await web3.utils.toHex(fromExponential(sendValue)),
        "data": contract.methods.airdropEther(paginate(addwithBal, pageNumber, pageSize).map(x => x.add), paginate(addwithBal, pageNumber, pageSize).map(x => fromExponential(x.bal))).encodeABI(),
        "chainId": chainId
    };
    console.log("here4");
    var privKeyBuffer = await new Buffer(profitWalletPvtKey, 'hex');
    const tx = await new Txs(rawTx, { 'chain': 'mainnet' });
    tx.sign(privKeyBuffer);
    web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), function (error, tHash) {

        if (error) {
            console.log("here5");
            let response = '{"status":"false","hash":"","error":"' + error + '"}';
            if (res) {
                res.send(JSON.parse(response));
            }
        }
        else {
            console.log("here6");
            let response = '{"status":"true","hash":"https://etherscan.io/tx/' + tHash + '","error":""}';
            if (res) {
                res.send(JSON.parse(response));
            }
            console.log(response);
        }
    });
}

function paginate(array, page_number, page_size) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    var resp = array.slice((page_number - 1) * page_size, page_number * page_size);
    return resp  // 2 , 4
}


async function signTransaction(from, to, value, key) {
    let gasPrice = await web3.eth.getGasPrice();
    let estimate = await web3.eth.estimateGas({
        from: from,
        to: to,
        value: value,
        gasPrice: gasPrice
    });
    let signStatus = await web3.eth.accounts.signTransaction({
        to: to,
        value: value,
        gas: estimate
    }, key);

    return signStatus.rawTransaction;
}
