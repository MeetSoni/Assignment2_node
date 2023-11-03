/****************************************************************************** ***
* ITE5315 – Assignment 2
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students. *
* Name: Meet B Soni Student ID: n01545343 Date: 03/11/2023*
* ****************************************************************************** **/

// Import required modules and set up the Express application
var express = require('express');
var http = require('http');
var fs=require('fs');
var path = require('path');
var app = express();
const exphbs = require('express-handlebars');
const customHelpers = require('./custom_helper');


const port = process.env.PORT || 3000; // Use all caps for 'PORT'

// Serve files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure the Express Handlebars view engine
app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main',  handlebars: customHelpers }));
app.set('view engine', 'hbs');



// Define a route for the root URL
app.get('/', function(req, res) {
  res.render('index', { title: 'Express', layout: 'main' });
});

app.get('/data', function(req, res) {
    let myData=fs.readFileSync('superSales.json');
    contacts = JSON.parse(myData);
    console.log(contacts);
    res.write(`<html><body><h1>JSON data is loaded and ready</h1></body></html>`);
    res.end();
  });


  app.get('/data/invoiceNo/:index', function(req, res) {
    console.log(req.url);

    const indexNo = req.params.index;; // Get the index number from the URL
    console.log(indexNo);

    const jsonData = fs.readFileSync('superSales.json', 'utf8');
    const superSalesdata = JSON.parse(jsonData);

    if (indexNo >= 0 && indexNo < superSalesdata.length) {
      const invoiceNo = superSalesdata[indexNo]["Invoice ID"];
      
        res.render('invoice', { title: 'Express', layout: 'main', data: { indexNo: indexNo , invoiceNo: invoiceNo} });
    //   res.writeHead(200, { 'Content-Type': 'text/html' });
    //   res.write(`<html><body><h1>Invoice No for Record ${indexNo} is: ${invoiceNo}</h1></body></html>`);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.write('<html><body><h1>Error: Record not found</h1></body></html>');
    }
  }
  
  );

  
  
  
  app.get('/search/invoiceNo', (req, res) => {
   res.render('search')
  });
  
  // Handle the POST request for '/search/invoiceNo'
  app.post('/search/invoiceNo/:index', (req, res) => {
    const searchInvoiceNo = req.params.index
    console.log(searchInvoiceNo);
  
    try {
      const jsonData = fs.readFileSync('superSales.json', 'utf8');
      const superSales = JSON.parse(jsonData)[searchInvoiceNo]["Invoice ID"];
      console.log(superSales);
  
      if (superSales !== '') {
        res.render('searchedinvoice',{layout:'main', data :{ searchInvoiceNo , superSales}});
      } else {
        res.status(404).send(`
          <html>
            <body>
              <h1>Error: InvoiceNo not found</h1>
            </body>
          </html>
        `);
      }
    } catch (error) {
      res.status(500).send(`
        <html>
          <body>
            <h1>Error: ${error.message}</h1>
          </body>
        </html>
      `);
    }
  });

  const jsonData = fs.readFileSync('superSales.json', 'utf8');
  const salesData = JSON.parse(jsonData);
  
  // Define the "/viewData" route
  app.get('/viewData', (req, res) => {
    const salesDataInfo = salesData;
  res.render('viewData', { salesData: salesDataInfo });
});


app.get('/zeroRating', (req, res) => {
  const salesDataInfo = salesData;   
  const modifiedSalesData = salesDataInfo.map((data) => {
      if (data.Rating === 0) {
          data.Rating = 'zero';
      }
      return data;
  }); 
  res.render('rating', { salesData: modifiedSalesData });
});


app.get('/filterData', (req, res) => {
  const salesDataInfo = salesData;    
  res.render('filteredSales_data', { salesData: salesDataInfo });
});

app.get('/users', function(req, res) {
  res.send('respond with a resource');
});

app.get('*', function (req, res) {
  res.render('error', { title: 'Error', message: 'Wrong Route' });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
