/*  Project 01_11_02

    Author: 
    Date:   

    Filename: script.js
*/

"use strict";

var httpRequest = false;
var entry = "MSFT";


// Instantiate a new request in variable httpRequest
function getRequestObject() {

    try {
        httpRequest = new XMLHttpRequest();
    } catch (requestError) {
        return false;
    }
    return httpRequest;
}
//prevent the default action from happening
function stopSubmission(evt) {

    if (evt.preventDefault) {
        evt.preventDefault();
    } else {
        evt.returnValue = false;
    }
    getQuote();
}


function getQuote() {
    //if there is input, make entry equal to the entered string
    if (document.getElementsByTagName("input")[0].value) {
        entry = document.getElementsByTagName("input")[0].value;
        //if there is no httpRequest, make one
        if (!httpRequest) {
            httpRequest = getRequestObject();
        }
        //set up conditions for getting data three, two, and one days ago, and current day
        let current = new Date();
        let threeDaysAgo = new Date();
        threeDaysAgo.setDate(current.getDate() - 3);
        let dateOne = `2017-${getMonth(threeDaysAgo.getMonth())}-${threeDaysAgo.getDate()}`;
        let dateTwo = `2017-${getMonth(current.getMonth())}-${current.getDate()}`
        //abort any outstanding requests, open a new one to the url, and send it
        httpRequest.abort();
        httpRequest.open("get", `StockCheck.php?t=${entry}&s=${dateOne}&e=${dateTwo}`, true);
        httpRequest.send(null);
        //when the ready state change is changed, run displayData()
        httpRequest.onreadystatechange = displayData;
    }

    //get the month for data requests
    function getMonth(month) {
        var curMonth = month > 0 ? month + 1 : 12;
        return curMonth < 10 ? "0" + curMonth : curMonth;
    }

    function displayData() {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            //put the data response into a variable and open the stockItems variable
            var stockResults = httpRequest.responseText;
            var stockItems;
            try {
                //parse stock results and store in stock items
                stockItems = JSON.parse(stockResults);
                //input data into the table in correct slots
                document.getElementById("ticker").innerHTML = stockItems.dataset.dataset_code;
                document.getElementById("openingPrice").innerHTML = stockItems.dataset.data[0][1];
                document.getElementById("lastTrade").innerHTML = stockItems.dataset.data[1][4];
                document.getElementById("lastTradeDT").innerHTML = stockItems.dataset.data[1][0].replace("2017", new Date().getFullYear());
                document.getElementById("change").innerHTML = ((parseFloat(stockItems.dataset.data[1][4]) - parseFloat(stockItems.dataset.data[0][1]))).toFixed(2);
                document.getElementById("range").innerHTML = "Low " + stockItems.dataset.data[0][3] + "<br>High " + stockItems.dataset.data[0][2];
                document.getElementById("volume").innerHTML = stockItems.dataset.data[0][5];
                return;
            } catch (error) {
                //Error message is the code doesn't work
                document.getElementById("ticker").innerHTML = "Error: Invalid Ticker.";
                document.getElementById("openingPrice").innerHTML = "-";
                document.getElementById("lastTrade").innerHTML = "-";
                document.getElementById("lastTradeDT").innerHTML = "-";
                document.getElementById("change").innerHTML = "-";
                document.getElementById("range").innerHTML = "-";
                document.getElementById("volume").innerHTML = "-";
                return;

            }
        }
    }
}

//create the table
function formatTable() {
    var rows = document.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        rows[i].style.background = "#9FE098";
    }
}


//event listeners for eah function that needs one
var form = document.getElementsByTagName("form")[0];
if (form.addEventListener) {
    form.addEventListener("submit", stopSubmission, false);
    window.addEventListener("load", formatTable, false);
    window.addEventListener("load", getQuote, false);
} else if (form.attachEvent) {
    form.attachEvent("onsubmit", stopSubmission);
    window.attachEvent("onload", formatTable);
    window.attachEvent("onload", getQuote);
}