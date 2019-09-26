/*  Project 01_11_02

    Author: 
    Date:   

    Filename: script.js
*/

"use strict";

var httpRequest = false;
var entry = "MSFT";



function getRequestObject() {

    try {
        httpRequest = new XMLHttpRequest();
    } catch (requestError) {
        return false;
    }
    return httpRequest;
}

function stopSubmission(evt) {

    if (evt.preventDefault) {
        evt.preventDefault();
    } else {
        evt.returnValue = false;
    }
    getQuote();
}


function getQuote() {
    if (document.getElementsByTagName("input")[0].value) {
        entry = document.getElementsByTagName("input")[0].value;
        if (!httpRequest) {
            httpRequest = getRequestObject();
        }
        let current = new Date();

        let threeDaysAgo = new Date();
        threeDaysAgo.setDate(current.getDate() - 3);
        let dateOne = `2017-${getMonth(threeDaysAgo.getMonth())}-${threeDaysAgo.getDate()}`;
        let dateTwo = `2017-${getMonth(current.getMonth())}-${current.getDate()}`
        httpRequest.abort();
        httpRequest.open("get", `StockCheck.php?t=${entry}&s=${dateOne}&e=${dateTwo}`, true);
        httpRequest.send(null);
        httpRequest.onreadystatechange = displayData;
    }

    function getMonth(month) {
        var curMonth = month > 0 ? month + 1 : 12;
        return curMonth < 10 ? "0" + curMonth : curMonth;
    }

    function displayData() {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var stockResults = httpRequest.responseText;
            var stockItems;
            try {
                stockItems = JSON.parse(stockResults);
                document.getElementById("ticker").innerHTML = stockItems.dataset.dataset_code;
                document.getElementById("openingPrice").innerHTML = stockItems.dataset.data[0][1];
                document.getElementById("lastTrade").innerHTML = stockItems.dataset.data[1][4];
                document.getElementById("lastTradeDT").innerHTML = stockItems.dataset.data[1][0].replace("2017", new Date().getFullYear());
                document.getElementById("change").innerHTML = ((parseFloat(stockItems.dataset.data[1][4]) - parseFloat(stockItems.dataset.data[0][1]))).toFixed(2);
                document.getElementById("range").innerHTML = "Low " + stockItems.dataset.data[0][3] + "<br>High " + stockItems.dataset.data[0][2];
                document.getElementById("volume").innerHTML = stockItems.dataset.data[0][5];
                return;
            } catch (error) {
                console.log('test');
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

function formatTable() {
    var rows = document.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        rows[i].style.background = "#9FE098";
    }
}


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