'use strict';

$(document).ready(init);

var current ='red';
var $source;
var $target;

function init(){
  initBoard();
  switchUser();
  $('table').on('click','.active',select);
  $('table').on('click','.empty', move);
}

function move(){
  if(!$source){
    return;
  }
  $target = $(this);
  var isKing = $source.is('.king');

  var src = {};
  var tgt = {};

  src.x = $source.data('x') * 1;
  src.y = $source.data('y') * 1;
  tgt.x = $target.data('x') * 1;
  tgt.y = $target.data('y') * 1;

  var compass = {};
  compass.north = (current === 'red') ? -1 : 1;
  compass.east = (current === 'red') ? 1 : -1;
  compass.west = compass.east * -1;
  compass.south = compass.north * -1;

  switch(moveType(src,tgt,compass,isKing)){
    case 'move':
      movePiece($target,$source);
      switchUser();
      break;
    case 'jump':
      movePiece($target,$source);
      killFucker(src,tgt,compass,isKing);
  }
}

function killFucker(src,tgt,compass,isKing){
  console.log('killing fucker actived');
  var $middle = inMiddle(src,tgt,compass,isKing);
  $($middle).removeClass().addClass('valid empty');

}

function movePiece($target,$source){
  var targetClasses = $target.attr('class');
  var sourceClasses = $source.attr('class');

  $target.attr('class', sourceClasses);
  $source.attr('class', targetClasses);
}

function moveType(src,tgt,compass,isKing){
  if (isJump(src,tgt,compass,isKing) && isEnemy(inMiddle(src,tgt,compass,isKing))){
    return 'jump';
  }
  if(isMove(src,tgt,compass,isKing)){
    return 'move';
  }
}

function isMove(src,tgt,compass,isKing){
  return (src.x + compass.east === tgt.x || src.x + compass.west === tgt.x) && (src.y + compass.north === tgt.y || (isKing && src.y + compass.south === tgt.y));
}

function isJump(src, tgt, compass, isKing){

  var checkEast = compass.east * 2;
  var checkWest = compass.west * 2;
  var checkNorth = compass.north * 2;
  var compassSouth = compass.south * 2;

  return (src.x + checkEast === tgt.x || src.x + checkWest === tgt.x) && (src.y + checkNorth === tgt.y) || (src.y + compassSouth === tgt.y) || (isKing && src.y + compassSouth === tgt.y);
}

function isEnemy($middle){
  if ($($middle).hasClass('black')&&($($source).hasClass('red')) || ($($middle).hasClass('red') && $($source).hasClass('black'))){
    return true;
  }
  else {
    return false;
  }
}

function inMiddle(src, tgt,compass, isKing){
  var checkX = (src.x + tgt.x) / 2;
  var checkY = (src.y + tgt.y) / 2;
  var $middle = ($('td[data-x='+checkX+']td[data-y='+checkY+']'));
  $middle = $middle[0];
  return $middle;
}

function select(){
  $source = $(this);
  $('.valid').removeClass('selected');
  $source.addClass('selected');
}

function canJump(compass, $source){

}

function isKing($target){
  
}

function initBoard(){
  $('tbody tr:lt(3) .valid').addClass('player black');
  $('tbody tr:gt(4) .valid').addClass('player red');
  $('tbody tr:lt(5):gt(2) .valid').addClass('empty');
}

function switchUser(){
  current = (current === 'black') ? 'red' : 'black';
  $('.valid').removeClass('active selected');
  $('.' + current).addClass('active');
}
