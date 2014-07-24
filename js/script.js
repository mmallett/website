var timeline = {items:[]};

$(document).ready(function(){

	hbUtils.init();

	doGithub();
	
});

function doGithub(){

	var githubIcon = 'https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png';

	$.get('https://api.github.com/users/mmallett/repos', function(data){
		$.each(data, function(i, repo){
			var toAdd = {
				title: 'Created repo '  + repo.name,
				date: repo.created_at,
				subtext: repo.description,
				link: repo.html_url,
				icon: githubIcon
			};
			timeline.items.push(toAdd);
		});

		dataSourceComplete();

	});

}

function dataSourceComplete(){

	timeline.items.sort(function(a, b){
		var keyA = new Date(a.date);
		var keyB = new Date(b.date);

		return (keyA < keyB) ? 1 : -1;
	});

	// render timeline
	$.get('templates/timeline.hbs', function(source){
		var template = Handlebars.compile(source);
		var html = template(timeline);
		$('#tl-container').html(html);
		
		$('#tl-container').children('div').each(function(i, div){
			$(div).click(function(){
				window.location = timeline.items[i].link;
			});
		});
	});
}

var hbUtils = {

	init : function(){
		Handlebars.registerHelper('tlGetPositionClasses', function(index){
			var classes = '';
			if(index % 2){
				classes += 'col-xs-10 col-xs-offset-1 col-sm-5 col-sm-offset-6 right';
			}
			else{
				classes += 'col-xs-10 col-xs-offset-1 col-sm-5 col-sm-offset-1 left';
			}

			if(index == 0){
				classes += ' first';
			}
			return classes;
		});

		Handlebars.registerHelper('tlGetCalloutClass', function(index){
			return (index % 2) ? 'callout-left' : 'callout-right';
		});

		Handlebars.registerHelper('formatDate', function(date){
			return '';
		});
	}

}
