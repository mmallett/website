	
$(document).ready(function(){
	
	$('#info').hide();

	$('.head-box button').click(function(){
		$('#info').slideToggle();
		$('.head-box button span').toggleClass('glyphicon-chevron-up glyphicon-chevron-down');
	});

	$('.top-spacer').height($('.head-box').height() + 40);
});

$(window).resize(function(){
	$('.top-spacer').height($('.head-box').height() + 40);
});

