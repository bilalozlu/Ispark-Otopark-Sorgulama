var express = require('express');
var app = express();
var ejs = require('ejs');
var bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
var cors = require('cors');
app.use('/public',express.static(__dirname +"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', '');
app.set('view engine', 'ejs')
app.use(cors());

const request = require('request');
function getJson(url){
    return new Promise((resolve,reject) => {
        var options = {
            method:'GET',
            url: url
        };
        request(options, function(error, response, body) {
            if(error)
                console.log(error);
            var body = JSON.parse(body);
            resolve(body);
        })
    })
}

let districtList = [];
let parkList = [];
let chosenDistrict = "Choose district";
let chosenPark = ["Choose park",-1];

app.get('/', async (req,res) => {
    let body = await getJson('https://api.ibb.gov.tr/ispark/Park');
    let length = body.length;
    districtsList = [];
    chosenDistrict = "Choose district";
    chosenPark = ["Choose park",-1];
    for(let i= 0; i < length; i++) {
        districtList.push(body[i].district);
    }
    districtList = districtList.filter((x, i, a) => a.indexOf(x) == i);
    res.render('',{
        district: districtList,
        chosenD: chosenDistrict,
        park : [],
        chosenP: chosenPark,
        total: 0,
        empty: 0,
        lat: 0,
        lon: 0
    });
});

app.post('/parks',async (req,res) => {
    let input = req.body.input;
    if (input != "Choose district") {
        let body = await getJson('https://api.ibb.gov.tr/ispark/Park');
        let length = body.length;
        parkList = [];
        chosenDistrict = input;
        chosenPark = ["Choose park",-1];
        for(let i= 0; i < length; i++) {
            if (body[i].district == input)
                parkList.push([body[i].parkName, body[i].parkID]);
        }
        res.render('',{
            district: districtList,
            chosenD: chosenDistrict,
            park: parkList,
            chosenP: chosenPark,
            total: 0,
            empty: 0,
            lat: 0,
            lon: 0
        });
    }
    else {
        console.log("Choose district")
    }
})

app.post('/capacity',async (req,res)=> {
    let index = req.body.input;
    if (index > -1) {
        let body = await getJson('https://api.ibb.gov.tr/ispark/ParkDetay?id='+parkList[index][1]);
        chosenPark = [parkList[index][0], index];
        res.render('',{
            district: districtList,
            chosenD: chosenDistrict,
            park: parkList,
            chosenP: chosenPark,
            empty: body[0].emptyCapacity,
            total: body[0].capacity,
            lat: parseFloat(body[0].lat),
            lon: parseFloat(body[0].lng)
        });


    }
    else {
        console.log("Choose park")
    }
})

app.listen(port, () => {
    console.log('listening');
});
