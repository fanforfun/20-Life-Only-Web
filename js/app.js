function setAccentColor(bgColor, fgColor) {
    var $blocks = document.getElementsByClassName('tile');
    
	for (var i = 0, length = $blocks.length; i < length; i++) {
		$blocks[i].style.backgroundColor = bgColor;
		$blocks[i].style.color = fgColor;
	}
}

function addClass(o, c){
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
    if (re.test(o.className)) return
    o.className = (o.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "")
}
 
function removeClass(o, c){
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
    o.className = o.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "")
}

var d = document,
	body = d.body,
	$ = function(className) {
		return d.getElementsByClassName(className);
	},
	INITIAL_LIFE = 20,
	changeLife = function(playerPicked, add) {
		var $life = playerPicked.getElementsByClassName('life')[0];
		
		$life.innerText = parseInt($life.innerText, 10) + add;
	},
	playerPicked = null,
	isUp = false,
	invert = false,
	playerChanged = false,
	mouseMoved = false;

function restart() {
	var $el = $('life');
	for (var i = 0, length = $el.length; i < length; i++) {
	    $el[i].innerHTML = INITIAL_LIFE;
	}
}

d.addEventListener('DOMContentLoaded', function(){

	body.addEventListener('touchstart', function(e){
		e.preventDefault(); 
	});

	body.addEventListener('touchmove', function(e){
		e.preventDefault(); 
	});

	restart();

	var $el = $('life_control');

	for (var i = 0, length = $el.length; i < length; i++) {
	    $el[i].addEventListener('mousedown', function(e){
			e.preventDefault(); 
			
			isUp = !!e.target.className.match(/_up/);

			playerPicked = e.target.parentNode;
			invert = !!playerPicked.className.match(/player_invert/);
		});
	}


    body.addEventListener('mouseup', function(e){
		e.preventDefault(); 
		
		if (!playerPicked) {
			return;
		}

		if (!playerChanged) {
			changeLife(playerPicked, isUp ? 1 : -1);
		}

		mouseMoved = false;
		playerChanged = false;
		playerPicked = null;

		setTimeout(function() {
			$el = $('player');
			for (var i = 0, length = $el.length; i < length; i++) {
				removeClass($el[i], 'player_up');
				removeClass($el[i], 'player_down');
			}
		}, 200);
	});


    body.addEventListener('mousemove', function(e){		
		if (!playerPicked) {
			return;
		}
		e.preventDefault(); 

		mousemove(e.y);
	});
});


function mousemove(y) {
	if (!playerPicked) {
		return;
	}

	y = +y;
    if (mouseMoved === false) {
		mouseMoved = y;
	}

	var diff = y - mouseMoved;
	if (invert) {
		diff = -diff;
	}

	if (Math.abs(diff) < 40) {
		return;
	}

	if (diff < 0 ) {
		//removeClass(playerPicked, 'player_down');
		//addClass(playerPicked, 'player_up');
	} else if (diff > 0)  {
		//removeClass(playerPicked, 'player_up');
		//addClass(playerPicked, 'player_down');
	}
	mouseMoved = y;
	playerChanged = true;

	changeLife(playerPicked, diff > 0 ? -1 : 1);
}
