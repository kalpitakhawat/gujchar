kakko = {"1_k":"&#2709;","2_kh":"&#2710;","3_g":"&#2711;","4_gh":"&#2712;","5_ch":"&#2714;","6_chh":"&#2715;","7_j":"&#2716;","8_z":"&#2717;","9_t":"&#2719;","10_th":"&#2720;"};
function random(min, max){
	return Math.floor(Math.random()*(max-min+1)+min);

}
reinit = false;


$(document).ready(function(){
	$('.modal').modal();
});

var s = function( p ) {

	p.setup = function() {
	  p.createCanvas(350, 400);
	  p.background(255);
	}
	p.draw = function(){
		if( reinit ){
			reinit = false;
			p.fill(255);
	 		p.stroke(255);
			p.rect(0,0,350,400);
	 		p.stroke(0);

		}
	}
	p.mouseDragged = function() {
	  p.strokeWeight(30);
	  p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
	}
};

var maxClass = function( classes ){
	var m = [];
	
  for ( i in classes ){
		if (classes[ i ].score > 0.9){
			m.push(classes[ i ])
		}
	}
  
  if( m.length > 1)
	 return [m[0],m[1]]
  return m
}
var myp5 = new p5(s, 'draw');

	var bar = $('.bar');
    var status = $('#status');
    var uploaded = false;


    $('form').ajaxForm({
        beforeSend: function() {
        	
          $('.btn').attr('disabled','true');
    	    $('.hideme').hide();
    	    $('.beforeu').show();

			   $('#modal1').modal('open');

            var percentVal = '0%';
            bar.width(percentVal);
        },
        uploadProgress: function(event, position, total, percentComplete) {
            var percentVal = percentComplete + '%';
            console.log(percentVal);
            if( percentComplete > 80 && !uploaded){
            	uploaded = true
    			$('.hideme').hide();
    			$('.afteru').show();
            }
            bar.width(percentComplete);
        },
        complete: function(xhr) {
        	$('.hideme').hide();

           var  response = JSON.parse(xhr.responseText);
           console.log(response);
           var cl = response.images[0].classifiers[0].classes;
           
           var mx = maxClass ( cl );
           console.log(mx);
           if ( mx.length ){
             if( mx.length == 1 ){
              $("#finale").html('\"'+kakko[ mx[0].class ]+'" Classified.' ); 
             }else{
                $("#finale").html('Multiple Possible Classification<hr>')
                 for( i in mx ){
                       $("#finale").append('<li>"'+kakko[ mx[i].class ]+'" - '+ (mx[i].score*100)+" %</li>" )
                 }
             }
           }else{
            $("#finale").html('Sorry, Classification failed :\'('); 
           } 
           $('.btn').removeAttr('disabled');
           $('.doneu').show();

        }
    });

function dwawing(){
	var canvas = document.getElementsByTagName("canvas")[0];
	var img    = canvas.toDataURL("image/jpeg");
			
	$('.btn').attr('disabled','true');
    $('.hideme').hide();
    $('.beforeu').show();

	$('#modal1').modal('open');

    var percentVal = '0%';
    bar.width(percentVal);
    var randStart = random(1,5)
   	bar.width(100/randStart );

    for( i = 2; i <= randStart; i++ ){
    	setTimeout(function(){
    		var w = bar.width();
    		bar.width( w + (100/randStart) );
    	},i*1000);
    }
	$('.hideme').hide();
	$('.afteru').show();

	$.post('/classifyCanvas',{imagebase: img}).done(function(response){
		$('.hideme').hide();
		$('.doneu').show();
		 response = JSON.parse(response);
           var cl = response.images[0].classifiers[0].classes;
           var mx = maxClass ( cl );
           console.log(mx);
          if ( mx.length ){
             if( mx.length == 1 ){
              $("#finale").html('\"'+kakko[ mx[0].class ]+'" Classified.' ); 
             }else{
                $("#finale").html('Multiple Possible Classification<hr>')
                 for( i in mx ){
                       $("#finale").append('<li>"'+kakko[ mx[i].class ]+'" - '+ (mx[i].score*100)+" %</li>" )
                 }
             }
          }
          else{
            $("#finale").html('Sorry, Classification failed :\'('); 
          } 
           $('.btn').removeAttr('disabled');
           $('.doneu').show();
	})

	
}

function clearCanvas(){
	reinit	= true;
}