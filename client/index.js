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
  //$('button').click(init);
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
      killMan(src,tgt,compass,isKing);
      $source = $target;
      $target = undefined;
      if (!jumpAvailable(compass)){
        switchUser();
      }
  }
}

function jumpAvailable(compass){
  var src = {};//source coordinates
  src.x = $source.data('x');
  src.y = $source.data('y');
  // coordinates of all spaces within 1 and 2 spaces of source
  var enemyChecks = {
    northEast: {x: (src.x + compass.east), y: (src.y + compass.north)},
    northWest: {x: (src.x + compass.west), y: (src.y + compass.north)},
    southEast: {x: (src.x + compass.east), y: (src.y + compass.south)},
    southWest: {x: (src.x + compass.west), y: (src.y + compass.south)}
  };
  var spaceChecks = {
    northEast: {x: (src.x + (compass.east * 2)), y: (src.y + (compass.north * 2))},
    northWest: {x: (src.x + (compass.west * 2)), y: (src.y + (compass.north * 2))},
    southEast: {x: (src.x + (compass.east * 2)), y: (src.y + (compass.south * 2))},
    southWest: {x: (src.x + (compass.west * 2)), y: (src.y + (compass.south * 2))},
  };

  //debugger;
  var keys = Object.keys(enemyChecks);
  var available = [];

  if (isKing()){
    available = checkKeys(keys,enemyChecks,spaceChecks);
    console.log(available);
  }
  else {
    available = checkKeys([keys[0],keys[1]],enemyChecks, spaceChecks);
  }
  if (available.length){
    return true;
  }
  else {
    return false;
  }
}

function checkKeys(keys,enemyChecks,spaceChecks){
  var available = [];
  console.log(enemyChecks);
  keys.forEach(function(key){
    var coords = enemyChecks[key];
    console.log(key);
    var $spot = ($('td[data-x='+coords.x+']td[data-y='+coords.y+']'));
    if (isEnemy($($spot))){
      var coords2 = spaceChecks[key];
      var $spot2 = ($('td[data-x='+coords2.x+']td[data-y='+coords2.y+']'));
      if ($spot2.hasClass('empty')){
        available.push($($spot2));
      }
    }
  });
  return available;
}


function killMan(src,tgt,compass,isKing){
  console.log('kill activated');
  var $middle = inMiddle(src,tgt,compass,isKing);
  $($middle).removeClass().addClass('valid empty');

}

function movePiece($target,$source){
  var targetClasses = $target.attr('class');
  var sourceClasses = $source.attr('class');

  $target.attr('class', sourceClasses);
  $source.attr('class', targetClasses);

  $target.data('y') === 0 ? $target.addClass('king redKing') : console.log('monkey gauntlet');
  $target.data('y') === 7 ? $target.addClass('king blackKinged') : console.log('giraffe attack');

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

  return (src.x + checkEast === tgt.x || src.x + checkWest === tgt.x) && (src.y + checkNorth === tgt.y) || (isKing && src.y + compassSouth === tgt.y);
}

function isEnemy($middle){
  if ($($middle).hasClass('black')&&($($source).hasClass('red')) || ($($middle).hasClass('red') && $($source).hasClass('black'))){
    return true;
  } else if ($($middle).hasClass('blackKinged')&&($($source).hasClass('redKing')) || ($($middle).hasClass('redKing') && $($source).hasClass('blackKinged'))){
    return true;
  } else if ($($middle).hasClass('black')&&($($source).hasClass('redKing')) || ($($middle).hasClass('red') && $($source).hasClass('blackKinged'))){
    return true;
  } else if ($($middle).hasClass('blackKinged')&&($($source).hasClass('red')) || ($($middle).hasClass('redKing') && $($source).hasClass('black'))){
    return true;
  } else {
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

function isKing(){
  return $source.hasClass('king');
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
