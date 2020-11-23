const express = require('express');
const mongooes = require('mongoose');
const transactionDetails = mongooes.model('TransactionDetails');
const ticketDetails = mongooes.model('TicketDetails');

module.exports = {

  //Transaction Apis
  SaveTransactionDetail: async (req, res) => {
    req.body.Serial=( (await transactionDetails.count())+1).toString();
    const data = new transactionDetails(req.body);
    try {
      await data.save();
      res.send({message:"Transaction Save Successfully"})
    }
    catch (err) {
      res.status(500).send({
        message:
          err.message
      });
    };
  },

  GetTransactions: async (req, res) => {
    transactionDetails.find().then(data => {
      res.send(data);
    })
      .catch(err => {
        res.status(500).send({
          message:
            err.message 
        });
      });
  },

  GetTrasactionByUserAddress: async (req, res) => {
    transactionDetails.find({ "FromAccount": req.query.address }).then(data => {
      res.send(data);
    })
      .catch(err => {
        res.status(500).send({
          message:
            err.message 
        });
      });

  },

  //Get transaction details by sale Id

  GetTransactioinBySaleId: async (req, res) => {
    transactionDetails.find({ "SaleId": req.query.saleId }).then(data => {
      res.send(data);
    }).catch(err => {
      res.status(500).send({
        message:
          err.message
      });
    });
  },

  GetTransactioinBySaleIdAndTicketNumber: async (req, res) => {
    transactionDetails.find({ $and: [{ "SaleId": req.query.saleId }, { "TicketNumber": req.query.ticketNumber }] }).sort({ SaleId: -1 }).then(data => {
      res.send(data);
    }).catch(err => {
      res.status(500).send({
        message:
          err.message
      });
    });
  },

  // Ticket Api
  SaveTicketDetail: async (req, res) => {
    const data = new ticketDetails(req.body);
    try {
      await data.save();
      res.send({message:"Ticket Save Successfully"});
    }
    catch (err) {
      res.status(500).send({
        message:
          err.message
      });
    };
  },

  GetTicketDetails: async (req, res) => {
    ticketDetails.find().then(data => {
      res.send(data);
    })
      .catch(err => {
        res.status(500).send({
          message:
            err.message
        });
      });
  },


  GetTicketBySaleId: async (req, res) => {
    ticketDetails.find({ "SaleId": req.query.saleId }).then(data => {
      res.send(data);
    }).catch(err => {
      res.status(500).send({
        message:
          err.message
      });
    });
  },

}