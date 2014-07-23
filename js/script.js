$(document).ready(function(){

	$.get('https://api.github.com/users/mmallett/repos', function(data){
		console.log(data);
	});
	
});