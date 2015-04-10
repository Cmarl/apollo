'use strict';

$(document).ready(init);

var players = {red: 'pRed'}
var players = {black: 'pBlack'}

function init(){
  $('.pBlack').click(select);
  $('.pRed').click(select);
}

function select(){
  console.log($(this).data());
}
