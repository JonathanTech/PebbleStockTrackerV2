/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');
var _ = require('underscore.js');
var card = new UI.Card({
  title:'Jon\'s stock app',
  subtitle:'Fetching...'
});
var settings = _.extend({stocks:[
  {
    symbol:'FD',
    count: 4
  }, 
  {
    symbol:'GOOGL',
    count: 2
  }, 
  {
    symbol:'MSFT',
    count: 5
  }
], startInvestment:5000.00});

//Display the card
card.show();

var stocks = _.map(settings.stocks, function(item){return item.symbol;});
console.log('starting: Stocks count - ' + settings.stocks.length);
var stockUrlString = stocks.join(',');
var url = 'http://finance.yahoo.com/webservice/v1/symbols/'+ stockUrlString +'/quote?format=json&view=detail';

ajax({url:url, type:'json'}, successCallback, function(error){});

function successCallback (data){
  console.log('successCallback');
  card.subtitle = 'success';
  var stocks = _.indexBy(settings.stocks, 'symbol');
  for(var i =0; i<data.list.resources.length;i++)
  {
    var stock = data.list.resources[i].resource.fields;
    _.extend( stocks[stock.symbol], stock, {
      startPrice:  Number.parseFloat(stock.price) - Number.parseFloat(stock.change),
      change: Number.parseFloat(stock.change),
    });
    stock = stocks[stock.symbol];
    stock.changeValue = stock.change * stock.count;
    stock.currentValue = stock.price * stock.count;
    stock.startValue = stock.startPrice * stock.count;
  }
    
  var dailyChange =  _.reduce(stocks, 
                              function(memo, item){
                                //console.log('item.changeValue:' + item.changeValue + '');
                                //console.log('memo:' + memo + '');
                                
                                return memo + item.changeValue;
                              }, 0);
  console.log(dailyChange);
  card.subtitle = dailyChange;
}