const express = require('express');
const app = new express();

app.use(express.static('client'))
const cors_app = require('cors');

const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance(type,typeval){
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    
    const { IamAuthenticator } = require('ibm-watson/auth');
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-03-25',
        authenticator: new IamAuthenticator({
          apikey: api_key,
        }),
        serviceUrl: api_url /*'{url}'*/
    });

    const analyzeParams = {
        type: typeval,
        'features': {
            'categories': {
                'limit': 3
            }
        }
    };

    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
        console.log(JSON.stringify(analysisResults, null, 2));
    })
    .catch(err => {
        console.log('error:', err);
    });
    
    return analysisResults;
}





app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
    //let data = getNLUInstance("text","who are you");
    //res.send(data);
  });

app.get("/url/emotion", (req,res) => {

    //return res.send({"happy":"90","sad":"10"});
    let data = getNLUInstance('url', req.query.url);
    return res.send(data);
});

app.get("/url/sentiment", (req,res) => {
    return res.send("url sentiment for "+req.query.url);
    let data = getNLUInstance('url', req.query.url);
    return res.send(data);
});

app.get("/text/emotion", (req,res) => {
    //return res.send({"happy":"10","sad":"90"});
    let data = getNLUInstance('text', req.query.text);
    return res.send(data);
});

app.get("/text/sentiment", (req,res) => {
    //return res.send("text sentiment for "+req.query.text);
    let data = getNLUInstance('text', req.query.text);
    return res.send(data);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

