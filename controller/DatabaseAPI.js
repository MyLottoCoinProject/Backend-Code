
var express = require('express');
var config = require('../routes/config.json');
var Txs = require('ethereumjs-tx').Transaction;
var request = require("request");
var Web3 = require('web3');
var db = require('../db/db.js');
const axios = require('axios');
var cron = require('node-cron');
const mongoose = require('mongoose');
const httpEndPoint = config.connectionURL;
var web3 = new Web3(new Web3.providers.HttpProvider(httpEndPoint));
const contractAddress = config.contractAddress;
const abi = require('../controller/abi.json');

const SalesSessionDetails = mongoose.model('SalesSessionDetails');
const saleGenericDetails = mongoose.model('saleGenericDetails');
const JackpotDetails = mongoose.model('JackpotDetails');

module.exports ={

pushDataUpdateForSaleSession :async (req, res) => { 
    try{
        var arrayForPurchases = [];
        //Get Sale Id Now
        var newContract = await new web3.eth.Contract(abi,contractAddress);
        
        var saleIdNow = await newContract.methods.getSaleIdNow().call();
        // console.log(saleIdNow)
        //Get All addresses by sale Id
        var allAddressesBySaleID = await newContract.methods.getAllSaleAddressesBySaleID(saleIdNow).call();
        let unique = [...new Set(allAddressesBySaleID)];
        // console.log(allAddressesBySaleID)
        //Total Tickets by address
        unique.forEach(async element => {
            var totalTicketsPurchased = await newContract.methods.getticketNumberByAddress(saleIdNow, element).call();
            totalTicketsPurchased.forEach(async element2 =>{
                console.log(element2)
                arrayForPurchases.push(element2);
            })
        });
        console.log(saleIdNow,allAddressesBySaleID,arrayForPurchases)

        
        // console.log(unique)
        }
    catch(err){
        res.send({data : err.message, status : false, err : ''})
    }
},

getSaleSessionDetails : async (req, res) => { 
    try{
        await SalesSessionDetails.find((err, docs) => {
            res.send({data : docs, status : true, err : ''})
        })
    }
    catch(err){
        res.send({data : err.message, status : false, err : ''})
        }
    },

getSaleGenericDetails: async (req, res) => { 
    try{
        await SalesSessionDetails.find((err, docs) => {
            res.send({data : docs, status : true, err : ''})
        })
    }
    catch(err){
        res.send({data : err.message, status : false, err : ''})
        }
    },


    pushJackpotDetails : async (req, res) => { 
        try{
            var obj = {LastEndTime :req.body.LastEndTime,JackpotPrice :req.body.JackpotPrice}
            await JackpotDetails.findOneAndUpdate({LastEndTime:req.body.LastEndTime},obj,{new: true, upsert: true},(err, doc) => {
                if (!err){
                    console.log("New Entry Added in whitelist database") 
                    res.send("New Entry Added in whitelist database");                    
                }
                else{
                    console.log({error :'Error during Json insertion insertion : ' + err});
                }
            });
        }
        catch(err){   
            console.log(err)
        }
    },
    
    getContractAddress : async (req,res) =>{
        res.send({ContractAddress : contractAddress});
    },

}
