var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var app = express();

var cors = require('cors');
app.use(cors({origin: '*'}));
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
const config = require('./routes/config.json');

var route = require('./routes/apiRoutes');
var verifyRequest = require('./routes/auth');
var mongoose = require('mongoose');
var DB = 'mongodb://localhost:27017';
var fs = require('fs');
const csv = require('csv-parser')
const axios = require('axios');
const powerballApi = require('./controller/powerballApi');

var nrc = require('node-run-cmd');


async function run(){
    axios.get("https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp="+parseInt(Date.now()/1000)+"&closest=before&apikey=").then(async resp => {
        console.log(resp.data.result);
    
  var dataCallback = function(data) {
    console.log(data,"Executed")
  };
  var query1 = "ethereumetl export_token_transfers --start-block 8900141 --end-block "+resp.data.result+" --provider-uri http:/ --output token_transfers.csv --tokens ";
  console.log(query1)
  let response1 = await nrc.run(query1, { onData: dataCallback });
  console.log(response1);
    })
}


var cron = require('node-cron');
const { cwd } = require('process');



const contractAddress = config.contractAddress;

const abi = require('./controller/abi.json');

app.use(verifyRequest());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/eth', route);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

let declareWinnerNowCron = cron.schedule("5 * * * * *", function () {
  console.log("First Job");
  UpdateCronTime()
}).start();



let rewardsdistributionCron = cron.schedule("0 1 01 3/3 *", async function () {
  let rawdata = fs.readFileSync('./routes/config.json');
  let data = JSON.parse(rawdata);
  if ((new Date(data.dateOfDeployment * 1000)).getMonth() + 1 > 3) {
    await powerballApi.distributeReward();
  }
}).start();



let generateCSVCron = cron.schedule("0 0 01 3/3 *", function () {
  let rawdata = fs.readFileSync('./routes/config.json');
  let data = JSON.parse(rawdata);
  if ((new Date(data.dateOfDeployment * 1000)).getMonth() + 1 > 3) {
    run();
  }
}).start();



function UpdateCronTime() {
  axios.get('https://powerball.com/api/v1/estimates/powerball?_format=json').then(output => {
    console.log('time updated')
    let sd = new Date(output.data[0].field_next_draw_date);
    declareWinnerNowCron.destroy();
    let rawdata = fs.readFileSync('./routes/config.json');
    let data = JSON.parse(rawdata);
    if (data.lastWinnerDate==undefined || data.lastWinnerDate == '') {
      axios.get('https://powerball.com/api/v1/draw-summary/powerball?_format=json').then(output => {
        data.lastWinnerDate = output.data[0].field_draw_date;
        fs.writeFileSync('./routes/config.json', JSON.stringify(data));
        ExecuteCronTime(sd, true);
      });
    }
    else {
      axios.get('https://powerball.com/api/v1/draw-summary/powerball?_format=json').then(output => {
        let newDate = new Date(output.data[0].field_draw_date);
        if (newDate > new Date(data.lastWinnerDate)) {
          ExecuteCronTime(sd);
        }
        else {
          declareWinnerNowCron = cron.schedule('5 * * * *', () => {
            UpdateCronTime();
          });
        }
      })

    }
  })

  function ExecuteCronTime(sd, firstTime = false) {

    const min = sd.getMinutes(sd.setMinutes(sd.getMinutes() + 2));
    const hour = sd.getHours();
    const before2hrs = sd.getHours(sd.setHours(sd.getHours() - 2));
    const month = sd.getMonth() + 1;
    const day = sd.getDate();

    if (firstTime) {
      declareWinnerNowCron = cron.schedule(`${min} ${hour} ${day} ${month >= 12 ? 1 : month} *`, async () => {
        UpdateCronTime();
      }).start();
      return;
    }

    let WithdrawETHCron = cron.schedule(`${min} ${before2hrs} ${day} ${month >= 12 ? 1 : month} *`, async () => {
      await powerballApi.withdrawEth();
      WithdrawETHCron.destroy();
    }).start();

    declareWinnerNowCron = cron.schedule(`${min} ${hour} ${day} ${month >= 12 ? 1 : month} *`, async () => {
      await powerballApi.declareWinnerNow();
      let rawdata = fs.readFileSync('./routes/config.json');
      let data = JSON.parse(rawdata);
      axios.get('https://powerball.com/api/v1/draw-summary/powerball?_format=json').then(async output => {
        axios.get('https://powerball.com/api/v1/estimates/powerball?_format=json').then(async output2 => {
         await powerballApi.updateNextWithdrawTimeMethod((new Date(output2.data[0].field_next_draw_date).getTime() - new Date().getTime())/1000);
        data.lastWinnerDate = output.data[0].field_draw_date;
        fs.writeFileSync('./routes/config.json', JSON.stringify(data));
        UpdateCronTime();
         });
      });
    }).start();
  }
}




//data.setTime(new CronTime(`${min} ${hour} ${day} ${month} *`))

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err, res) => {
  if (res)
    return console.log("----------------->> MongoDB Connected! <<-----------------")
  else (err)
  return console.log("----------------> MongoDB Not Connected! <<---------------")
});

//For Swagger
const expressSwagger = require('express-swagger-generator')(app);
expressSwagger({
  swaggerDefinition: {
    info: {
      title: process.env.SWAGGER_TITLE,
      description: process.env.SWAGGER_DESCRIPTION,
      version: process.env.SWAGGER_VERSION,
    },
    host: process.env.SWAGGER_API_HOST,
    consumes: [
      "application/json"
    ],
    produces: [
      "application/json"
    ],
    schemes: ['http', 'https'],
    securityDefinitions: {
      "Basic Auth": {
        "type": "basic",
        "name": "authorization",
        "in": "header"
      }
    }
  },
  basedir: __dirname, //app absolute path
  files: [
    './routes/*.js'
  ]
});

module.exports = app;
