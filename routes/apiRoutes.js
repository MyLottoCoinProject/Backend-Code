const express = require('express');
const router = express.Router();
const mongooes = require('mongoose');

const genericApi = require('../controller/genericApi');
const contractApi = require('../controller/contractApi');
const powerballApi = require('../controller/powerballApi');
const databaseAPI = require('../controller/DatabaseAPI');
const DatabaseAPI = require('../controller/DatabaseAPI');

const ticketApi = require('../controller/ticketApi');
const { Router } = require('express');
//--------------------------------------------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------ROUTES FOR GENERIC FUNCTIONS---------------------------------------------------------------//
//--------------------------------------------------------------------------------------------------------------------------------------------------------//

// /**
// * @typedef createAccount
// */
// /**
// * @route GET /api/eth/createAccount
// * @group Generic_API
// * @security Basic Auth
// */
router.get('/createAccount', genericApi.createAccount);

// /**
// * @typedef getAccount
// * @property {String} address.required - Add address - eg: XdAUmwtig27HBG6WfYyHAzP8n6XC9jESEw
// */
// /**
// * @route GET /api/eth/getAccount
// * @param {getAccount.model} address.query
// * @group Generic_API
// * @security Basic Auth
// */
// router.get('/getAccount', genericApi.getAccount);

// /**
// * @typedef getETHBalance
// * @property {String} address.required - Add address - eg: XdAUmwtig27HBG6WfYyHAzP8n6XC9jESEw
// */
// /**
// * @route GET /api/eth/getETHBalance
// * @param {getETHBalance.model} address.query
// * @group Generic_API
// * @security Basic Auth
// */
router.get('/getETHBalance', genericApi.getETHBalance);

// /**
// * @typedef getTransactionByHash
// * @property {String} hash.required - Add hash - eg: XdAUmwtig27HBG6WfYyHAzP8n6XC9jESEw
// */
// /**
// * @route GET /api/eth/getTransactionByHash
// * @param {getTransactionByHash.model} hash.query
// * @group Generic_API
// * @security Basic Auth
// */
router.get('/getTransactionByHash', genericApi.getTransactionByHash);


// /**
// * @typedef getTransactionsByAddress
// * @property {String} address.required - Add address - eg: XdAUmwtig27HBG6WfYyHAzP8n6XC9jESEw
// */
// /**
// * @route GET /api/eth/getTransactionsByAddress
// * @param {getTransactionsByAddress.model} address.query
// * @group Generic_API
// * @security Basic Auth
// */
// router.get('/getTransactionsByAddress', genericApi.getTransactionsByAddress);                                   

// /**
// * @typedef getTransactionByBlock
// * @property {String} block.required - Add block - eg: XdAUmwtig27HBG6WfYyHAzP8n6XC9jESEw
// */
// /**
// * @route GET /api/eth/getTransactionByBlock
// * @param {getTransactionByBlock.model} block.query
// * @group Generic_API
// * @security Basic Auth
// */
router.get('/getTransactionByBlock', genericApi.getTransactionByBlock);

// /**
// * @typedef ETH_Status
// */
// /**
// * @route GET /api/eth/getStatus
// * @group Generic_API
// * @security Basic Auth
// */
router.get('/getStatus', genericApi.getStatus);


//--------------------------------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------ROUTES FOR POWERBALL GET FUNCTIONALITY-------------------------------------------------------//
//--------------------------------------------------------------------------------------------------------------------------------------------------------//

// /**
// * @typedef getRecentWinnerDetail
// */
// /**
// * @route GET /api/eth/getRecentWinnerDetail
// * @group Powerball_Get_API
// * @security Basic Auth
// */
router.get('/getRecentWinnerDetail', powerballApi.getRecentWinnerDetail);

// /**
// * @typedef getEstimateJackpotDetail
// */
// /**
// * @route GET /api/eth/getEstimateJackpotDetail
// * @group Powerball_Get_API
// * @security Basic Auth
// */
router.get('/getEstimateJackpotDetail', powerballApi.getEstimateJackpotDetail);

// /**
// * @typedef getWinnerSummaryDetail
// */
// /**
// * @route GET /api/eth/getWinnerSummaryDetail
// * @group Powerball_Get_API
// * @security Basic Auth
// */
router.get('/getWinnerSummaryDetail', powerballApi.getWinnerSummaryDetail);

//  /**
//     * @typedef getNextJackpotDetails
//     */
//     /**
//     * @route GET /api/eth/getNextJackpotDetails
//     * @group Powerball_Get_API
//     * @security Basic Auth
//     */
router.get('/getNextJackpotDetails', powerballApi.getNextJackpotDetails);

/**
   * @typedef declareWinnerNow
   */
/**
* @route GET /api/eth/declareWinnerNow
* @group Powerball_Get_API
* @security Basic Auth
*/
router.get('/declareWinnerNow', powerballApi.declareWinnerNow);


/**
   * @typedef distributeReward
   */
/**
* @route GET /api/eth/distributeReward
* @group Powerball_Get_API
* @security Basic Auth
*/
router.get('/distributeReward', powerballApi.distributeReward);

/**
   * @typedef withdrawEth
   */
/**
* @route GET /api/eth/withdrawEth
* @group Powerball_Get_API
* @security Basic Auth
*/
router.get('/withdrawEth', powerballApi.withdrawEth);




//  /**
//     * @typedef withdrawEth
//     */
//     /**
//     * @route GET /api/eth/withdrawEth
//     * @group Powerball_Get_API
//     * @security Basic Auth
//     */
router.get('/withdrawEth', powerballApi.withdrawEth);

    /**
    * @typedef calculateEstimatedGas
    * @property {String} numberOfTicket.required - Add numberOfTicket - eg: 10
    */
    /**
    * @route POST /api/eth/calculateEstimatedGas
    * @group Powerball_Get_API
    * @param {calculateEstimatedGas.model} req.body
    * @security Basic Auth
    */
    router.post('/calculateEstimatedGas', powerballApi.calculateEstimatedGas);

    /**
        * @typedef exportCSV
        */
        /**
        * @route GET /api/eth/exportCSV
        * @group Powerball_Get_API
        * @security Basic Auth
        */
    router.get('/exportCSV', powerballApi.exportCSV);

    /**
        * @typedef updateNextWithdrawTime
        * @property {String} nextTimeDiff.required - Add nextTimeDiff - eg: 1605845509
        */
        /**
        * @route POST /api/eth/updateNextWithdrawTime
        * @group Powerball_Get_API
        * @param {updateNextWithdrawTime.model} req.body
        * @security Basic Auth
        */
       router.post('/updateNextWithdrawTime', powerballApi.updateNextWithdrawTime);

    

    

//--------------------------------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------ROUTES FOR ERC20 FUNCTIONALITY---------------------------------------------------------------//
//--------------------------------------------------------------------------------------------------------------------------------------------------------//

// /**
// * @typedef getTokenOwner
// */
// /**
// * @route GET /api/eth/getTokenOwner
// * @group Smart_Contract_API
// * @security Basic Auth
// */
router.get('/getTokenOwner', contractApi.getTokenOwner);

// /**
// * @typedef getTokenOwnerBalance
// * @property {String} address.required - Add address - eg: XdAUmwtig27HBG6WfYyHAzP8n6XC9jESEw
// */
// /**
// * @route GET /api/eth/getTokenOwnerBalance
// * @param {getTokenOwnerBalance.model} address.query
// * @group Smart_Contract_API
// * @security Basic Auth
// */
router.get('/getTokenOwnerBalance', contractApi.getTokenOwnerBalance);

// /**
// * @typedef getTokenName
// */
// /**
// * @route GET /api/eth/getTokenName
// * @group Smart_Contract_API
// * @security Basic Auth
// */
router.get('/getTokenName', contractApi.getTokenName);

//    /**
//    * @typedef getTokenSymbol
//    */
//    /**
//    * @route GET /api/eth/getTokenSymbol
//    * @group Smart_Contract_API
//    * @security Basic Auth
//    */
router.get('/getTokenSymbol', contractApi.getTokenSymbol);

//    /**
//    * @typedef getTokenTotalSupply
//    */
//    /**
//    * @route GET /api/eth/getTokenTotalSupply
//    * @group Smart_Contract_API
//    * @security Basic Auth
//    */
router.get('/getTokenTotalSupply', contractApi.getTokenTotalSupply);

// /**
// * @typedef approveToken
// * @property {String} privateKey.required - Add privateKey - eg: 90d6bfe121ca841b624028284687917843a03f88b84943d1d4d20336ab67fbb6
// * @property {String} fromAddress.required - Add fromAddress - eg: 0x98A000309527D55031238457A95b80B6AdD3CcaB
// * @property {String} toAddress.required - Add toAddress - eg: 0xf49ddDB0019ED8b03C03e75a9329a98746847dE5
// * @property {String} amount.required - Add amount - eg: 5
// */
// /**
// * @route POST /api/eth/approveToken
// * @param {approveToken.model} req.body
// * @group Smart_Contract_API
// * @security Basic Auth
// */
router.post('/approveToken', contractApi.approveToken);

//    /**
//    * @typedef transferToken
//    * @property {String} privateKey.required - Add privateKey - eg: 90d6bfe121ca841b624028284687917843a03f88b84943d1d4d20336ab67fbb6
//    * @property {String} fromAddress.required - Add fromAddress - eg: 0x98A000309527D55031238457A95b80B6AdD3CcaB
//    * @property {String} toAddress.required - Add toAddress - eg: 0xf49ddDB0019ED8b03C03e75a9329a98746847dE5
//    * @property {String} amount.required - Add amount - eg: 5
//    */
//    /**
//    * @route POST /api/eth/transferToken
//    * @param {transferToken.model} req.body
//    * @group Smart_Contract_API
//    * @security Basic Auth
//    */
router.post('/transferToken', contractApi.transferToken);

//    /**
//    * @typedef transferFrom
//    * @property {String} privateKey.required - Add privateKey - eg: 90d6bfe121ca841b624028284687917843a03f88b84943d1d4d20336ab67fbb6
//    * @property {String} fromAddress.required - Add fromAddress - eg: 0x98A000309527D55031238457A95b80B6AdD3CcaB
//    * @property {String} toAddress.required - Add toAddress - eg: 0xf49ddDB0019ED8b03C03e75a9329a98746847dE5
//    * @property {String} amount.required - Add amount - eg: 5
//    */
//    /**
//    * @route POST /api/eth/transferFrom
//    * @param {transferFrom.model} req.body
//    * @group Smart_Contract_API
//    * @security Basic Auth
//    */
router.post('/transferFrom', contractApi.transferFrom);

//    /**
//    * @typedef burnToken
//    * @property {String} privateKey.required - Add privateKey - eg: 90d6bfe121ca841b624028284687917843a03f88b84943d1d4d20336ab67fbb6
//    * @property {String} fromAddress.required - Add fromAddress - eg: 0x98A000309527D55031238457A95b80B6AdD3CcaB
//    * @property {String} amount.required - Add amount - eg: 5
//    */
//    /**
//    * @route POST /api/eth/burnToken
//    * @param {burnToken.model} req.body
//    * @group Smart_Contract_API
//    * @security Basic Auth
//    */
router.post('/burnToken', contractApi.burnToken);

//    /**
//    * @typedef transferOwnership
//    * @property {String} privateKey.required - Add privateKey - eg: 90d6bfe121ca841b624028284687917843a03f88b84943d1d4d20336ab67fbb6
//    * @property {String} fromAddress.required - Add fromAddress - eg: 0x98A000309527D55031238457A95b80B6AdD3CcaB
//    * @property {String} newAddress.required - Add newAddress - eg: asdfghjkkkjhgfd
//    */
//    /**
//    * @route POST /api/eth/transferOwnership
//    * @param {transferOwnership.model} req.body
//    * @group Smart_Contract_API
//    * @security Basic Auth
//    */
router.post('/transferOwnership', contractApi.transferOwnership);


//-------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------ROUTES FOR POWERBALL FUNCTIONALITY--------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//    /**
//    * @typedef getSaleIdNow
//    */
//    /**
//    * @route GET /api/eth/getSaleIdNow
//    * @group Smart_Contract_API
//    * @security Basic Auth
//    */
router.get('/getSaleIdNow', contractApi.getSaleIdNow);

// /**
// * @typedef getStartTime
// * @property {String} saleId.required - Add saleId - eg: 1
// */
// /**
// * @route GET /api/eth/getStartTime
// * @param {getStartTime.model} saleId.query
// * @group Smart_Contract_API
// * @security Basic Auth
// */
router.get('/getStartTime', contractApi.getStartTime);

// /**
// * @typedef getEndTime
// * @property {String} saleId.required - Add saleId - eg: 1
// */
// /**
// * @route GET /api/eth/getEndTime
// * @param {getEndTime.model} saleId.query
// * @group Smart_Contract_API
// * @security Basic Auth
// */
router.get('/getEndTime', contractApi.getEndTime);

// /**
// * @typedef getWinningNumber
// */
// /**
// * @route GET /api/eth/getWinningNumber
// * @group Smart_Contract_API
// * @security Basic Auth
// */
router.get('/getWinningNumber', contractApi.getWinningNumber);

// /**
// * @typedef getWinningAmount
// */
// /**
// * @route GET /api/eth/getWinningAmount
// * @group Smart_Contract_API
// * @security Basic Auth
// */
router.get('/getWinningAmount', contractApi.getWinningAmount);

// /**
// * @typedef getWinningAddress
// */
// /**
// * @route GET /api/eth/getWinningAddress
// * @group Smart_Contract_API
// * @security Basic Auth
// */
router.get('/getWinningAddress', contractApi.getWinningAddress);

// /**
// * @typedef getAllSaleAddresses
// * @property {String} saleId.required - Add saleId - eg: 1
// */
// /**
// * @route GET /api/eth/getAllSaleAddresses
// * @param {getAllSaleAddresses.model} saleId.query
// * @group Smart_Contract_API
// * @security Basic Auth
// */
router.get('/getAllSaleAddresses', contractApi.getAllSaleAddresses);

//    /**
//    * @typedef getAllParticipantAddresses
//    */
//    /**
//    * @route GET /api/eth/getAllParticipantAddresses
//    * @group Smart_Contract_API
//    * @security Basic Auth
//    */
router.get('/getAllParticipantAddresses', contractApi.getAllParticipantAddresses);

// /**
// * @typedef getTotalSaleAmountBySaleID
// * @property {String} saleId.required - Add saleId - eg: 1
// */
// /**
// * @route GET /api/eth/getTotalSaleAmountBySaleID
// * @param {getTotalSaleAmountBySaleID.model} saleId.query
// * @group Smart_Contract_API
// * @security Basic Auth
// */
router.get('/getTotalSaleAmountBySaleID', contractApi.getTotalSaleAmountBySaleID);

//    /**
//    * @typedef getTotalSaleAmountForAllSale
//    */
//    /**
//    * @route GET /api/eth/getTotalSaleAmountForAllSale
//    * @group Smart_Contract_API
//    * @security Basic Auth
//    */
router.get('/getTotalSaleAmountForAllSale', contractApi.getTotalSaleAmountForAllSale);

// /**
// * @typedef getParticipantCountBySaleId
// * @property {String} saleId.required - Add saleId - eg: 1
// */
// /**
// * @route GET /api/eth/getParticipantCountBySaleId
// * @param {getParticipantCountBySaleId.model} saleId.query
// * @group Smart_Contract_API
// * @security Basic Auth
// */
router.get('/getParticipantCountBySaleId', contractApi.getParticipantCountBySaleId);

//    /**
//    * @typedef getPriceOfOneTicket
//    */
//    /**
//    * @route GET /api/eth/getPriceOfOneTicket
//    * @group Smart_Contract_API
//    * @security Basic Auth
//    */
router.get('/getPriceOfOneTicket', contractApi.getPriceOfOneTicket);

// /**
// * @typedef getticketNumberByAddress
// * @property {String} saleId.required - Add saleId - eg: 1
// * @property {string} address.required - Add address - eg: qwertyuiolkjhgfd
// */
// /**
// * @route GET /api/eth/getticketNumberByAddress
// * @param {getticketNumberByAddress.model} saleId.query
// * @param {getticketNumberByAddress.model} address.query
// * @group Smart_Contract_API
// * @security Basic Auth
// */
router.get('/getticketNumberByAddress', contractApi.getticketNumberByAddress);

//    /**
//    * @typedef getpurchaseTokenAmount
//    */
//    /**
//    * @route GET /api/eth/getpurchaseTokenAmount
//    * @group Smart_Contract_API
//    * @security Basic Auth
//    */
router.get('/getpurchaseTokenAmount', contractApi.getpurchaseTokenAmount);

//    /**
//    * @typedef getbuyerPoolAddress
//    */
//    /**
//    * @route GET /api/eth/getbuyerPoolAddress
//    * @group Smart_Contract_API
//    * @security Basic Auth
//    */
router.get('/getbuyerPoolAddress', contractApi.getbuyerPoolAddress);

//    /**
//    * @typedef purchaseTicket
//    * @property {String} privateKey.required - Add privateKey - eg: 0x3e2b296f55b5768b0b6e28fa318e613a4c4bfa3a26142e89453eb6a89f7f5978
//    * @property {String} fromAddress.required - Add fromAddress - eg: 0x98A000309527D55031238457A95b80B6AdD3CcaB
//    * @property {String} value.required - Add value - eg: 1
//    * @property {[object]} ticketNumber.required - Add ticketNumber - eg: 5
//    */
//    /**
//    * @route POST /api/eth/purchaseTicket
//    * @param {purchaseTicket.model} req.body
//    * @group Smart_Contract_API
//    * @security Basic Auth
//    */
router.post('/purchaseTicket', contractApi.purchaseTicket);

//    /**
//    * @typedef declareWinner
//    * @property {String} privateKey.required - Add privateKey - eg: 0x3e2b296f55b5768b0b6e28fa318e613a4c4bfa3a26142e89453eb6a89f7f5978
//    * @property {String} fromAddress.required - Add fromAddress - eg: 0x98A000309527D55031238457A95b80B6AdD3CcaB
//    * @property {String} value.required - Add value - eg: 1
//    * @property {[object]} winningSequence.required - Add winningSequence - eg: 5
//    * @property {[object]} powerballNumber.required - Add powerballNumber - eg: 5
//    * @property {[object]} winnerAddressArray.required - Add winnerAddressArray - eg: 5
//    * @property {[object]} winnerPositions.required - Add winnerPositions - eg: 5
//    * @property {[object]} winnerAmountInWei.required - Add winnerAmountInWei - eg: 5
//    */
//    /**
//    * @route POST /api/eth/declareWinner
//    * @param {declareWinner.model} req.body
//    * @group Smart_Contract_API
//    * @security Basic Auth
//    */
router.post('/declareWinner', contractApi.declareWinner);



///////////////////////////////////////////////////////Database API Routes/////////////////////////////////////////////////////////

// /**
// * @typedef getSaleSessionDetails
// * @property {String} saleId.required - Add saleId - eg: 1
// */
// /**
// * @route GET /api/eth/getSaleSessionDetails
// * @param {getSaleSessionDetails.model} saleId.query
// * @group Database_API
// * @security Basic Auth
// */
router.get('/getSaleSessionDetails', databaseAPI.getSaleSessionDetails)

// /**
// * @typedef pushDataUpdateForSaleSession
// * @property {String} saleId.required - Add saleId - eg: 1
// */
// /**
// * @route GET /api/eth/pushDataUpdateForSaleSession
// * @param {pushDataUpdateForSaleSession.model} saleId.query
// * @group Database_API
// * @security Basic Auth
// */
router.get('/pushDataUpdateForSaleSession', databaseAPI.pushDataUpdateForSaleSession)


//    /**
//    * @typedef pushJackpotDetails
//    * @property {String} JackpotPrice.required - Add JackpotPrice - eg: 10
//    * @property {String} LastEndTime.required - Add LastEndTime - eg: 189098337
//    */
//    /**
//    * @route POST /api/eth/pushJackpotDetails
//    * @param {pushJackpotDetails.model} req.body
//    * @group Database_API
//    * @security Basic Auth
//    */
router.post('/pushJackpotDetails', DatabaseAPI.pushJackpotDetails);


/**
* @typedef getContractAddress
*/
/**
* @route GET /api/eth/getContractAddress
* @group Database_API
* @security Basic Auth
*/
router.get('/getContractAddress', databaseAPI.getContractAddress)


/**
    * @typedef TransactionDetail
    * @property {string} Serial.required
    * @property {string} TransactionHash.required
    * @property {string} FromAccount.required
    * @property {string} AmountETH.required
    * @property {string} TicketNumber.required
    * @property {string} TransactionStatus.required
    * @property {string} Time.required  - format $date-time -eg:2020-11-02T09:41:31.385Z
    * @property {string} SaleId.required
    * @property {string} Status.required
    * @property {string} TotalTickets.required
    *  
*/
/**
/**
* @route POST /api/eth/createTransaction
* @param {TransactionDetail.model} req.body
* @group Transactioin_API
* @security Basic Auth
*/
router.post('/createTransaction', ticketApi.SaveTransactionDetail);


/**
    * @route GET /api/eth/getTransactions
    * @group Transactioin_API
    * @security Basic Auth
    */
router.get('/getTransactions', ticketApi.GetTransactions)



/**
 * @typedef TicketDetail
 * @property {string} SaleId.required
 * @property {string} StartDate.required  - format $date-time -eg:2020-11-02T09:41:31.385Z
 * @property {string} EndDate.required  - format $date-time -eg:2020-11-02T09:41:31.385Z
 * @property {string} Winneraddress.required
 * @property {string} Winningamount.required
 * @property {string} Transactionhash.required
 * @property {string} WinningNumber.required
*/

/**
* @route POST /api/eth/saveTicketDetail
* @param {TicketDetail.model} req.body
* @group Transactioin_API
* @security Basic Auth
*/
router.post('/saveTicketDetail', ticketApi.SaveTicketDetail);


/**
    * @route GET /api/eth/getTicketDetails
    * @group Transactioin_API
    * @security Basic Auth
    */
router.get('/getTicketDetails', ticketApi.GetTicketDetails)


/**
* @typedef address
* @property {string} address.required - Add address - eg: XdAUmwtig27HBG6WfYyHAzP8n6XC9jESEw
*/
/**
* @route GET /api/eth/getTrasactionByUserAddress
* @param {address.model} address.query
* @group Transactioin_API
* @security Basic Auth
*/

router.get('/GetTrasactionByUserAddress', ticketApi.GetTrasactionByUserAddress)



/**
* @typedef saleId
* @property {string} saleId.required - Add address - eg: 1,2,3
*/
/**
* @route GET /api/eth/getTransactioinBySaleId
* @param {saleId.model} saleId.query
* @group Transactioin_API
* @security Basic Auth
*/

router.get('/getTransactioinBySaleId', ticketApi.GetTransactioinBySaleId)

/**
* @typedef saleId
* @property {string} saleId.required - Add address - eg: 1,2,3
*/
/**
* @route GET /api/eth/GetTicketBySaleId
* @param {saleId.model} saleId.query
* @group Transactioin_API
* @security Basic Auth
*/

router.get('/GetTicketBySaleId', ticketApi.GetTicketBySaleId)


/**
* @typedef saleId
* @property {string} saleId.required - Add address - eg: 1,2,3
* @property {string} ticketNumber.required - Add address - eg: 1,2,3
*/
/**
* @route GET /api/eth/getTransactioinBySaleIdAndTicketNumber
* @param {saleId.model} saleId.query
* @param {sale.model} ticketNumber.query
* @group Transactioin_API
* @security Basic Auth
*/

router.get('/getTransactioinBySaleIdAndTicketNumber', ticketApi.GetTransactioinBySaleIdAndTicketNumber)

module.exports = router
