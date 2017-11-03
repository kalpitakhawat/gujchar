var s = function( p ) {

  var x = 100; 
  var y = 100;

	p.setup = function() {
	    p.createCanvas(500, 410);
	  // size(400, 400); // second try this
	  background(-1);
	}
	p.mouseDragged = function() {
	  p.strokeWeight(6);
	  p.line(pmouseX, pmouseY, mouseX, mouseY);
	}
};

var myp5 = new p5(s, 'canvasContainer');