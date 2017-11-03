var s = function( p ) {


  var x = 100; 
  var y = 100;

	p.setup = function() {
	  p.createCanvas(350, 400);
	  p.background(255);
	}
	p.mouseDragged = function() {
	  p.strokeWeight(40);
	  p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
	}
};

var myp5 = new p5(s, 'draw');