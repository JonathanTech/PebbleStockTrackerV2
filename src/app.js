/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');
var _ = require('underscore.js');

var settings = _.extend({stocks:[
  {
    symbol:'FB',
    count: 4
  }, 
  {
    symbol:'GOOGL',
    count: 2
  }, 
  {
    symbol:'MSFT',
    count: 5
  },
  {
    
  }
], startInvestment:5000.00});
var card = new UI.Card({
  title:'Jon\'s stock app',
  subtitle:'fetching...'
});
//Display the card
card.show();

var stocks = _.map(settings.stocks, function(item){return item.symbol;});
var stockUrlString = stocks.join(',');
var url = 'http://finance.yahoo.com/webservice/v1/symbols/'+ stockUrlString +'/quote?format=json&view=detail';

ajax({url:url, type:'json'}, successCallback, function(error){console.log(JSON.stringify(error));});

function successCallback (data){ 
  var stocks = _.indexBy(settings.stocks, 'symbol');
  var mergedStocks = {};
  _.each(data.list.resources, function(stockResource){
    var stock = stockResource.resource.fields;
    var mergedStock = _.extend({}, stocks[stock.symbol], stock, {
      startPrice:  Number.parseFloat(stock.price) - Number.parseFloat(stock.change),
      change: Number.parseFloat(stock.change),
    });
    mergedStock.changeValue = mergedStock.change * mergedStock.count;
    mergedStock.currentValue = mergedStock.price * mergedStock.count;
    mergedStock.startValue = mergedStock.startPrice * mergedStock.count;
    mergedStocks[mergedStock.symbol] = mergedStock;
  });
  
  var dailyChange =  _.reduce(mergedStocks, 
                              function(memo, item){
                                var changeValue = item.changeValue;
                                if(!_.isNumber(changeValue) || _.isNaN(changeValue))
                                  changeValue = 0;
                                return memo + changeValue;
                              }, 0);
  card.subtitle(dailyChange);
}