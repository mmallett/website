var timeline = {items:[]};

var githubDone = false,
	bloggerDone = false;

$(document).ready(function(){

	hbUtils.init();

	doStaticData();

	doGithub();

	doBlogger();
	
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

		githubDone = true;

		dataSourceComplete();

	});

}

function doStaticData(){
	var staticData = [
		{
			title: 'Started playing with HTML and BBCode',
			date: '2005-01-01',
			subtext: 'Started a forum for Runescape (the horror) and started to learn HTML to add some custom content to the site',
			link: '#',
			icon: 'http://www.w3.org/html/logo/downloads/HTML5_Logo_512.png'
		},
		{
			title: 'Python course in high school',
			date: '2009-01-01',
			subtext: 'My first real exposure to programming. Unfortunately, all my work was lost in a tragic flash drive formatting disaster (shakes fist)',
			link: '#',
			icon: 'http://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/300px-Python-logo-notext.svg.png'
		},
		{
			title: 'The javasaur is born!',
			date: '2014-07-11',
			subtext: "I've finally fulfilled my lifelong dream of starting a blog.",			link: 'http://javasaur.blogspot.com',
			icon: 'img/javasaur.png'
		}
	]

	for(var i = 0; i < staticData.length; i++){
		timeline.items.push(staticData[i]);
	}

	dataSourceComplete();
}

function doBlogger(){

	$.get('http://javasaur.blogspot.com/feeds/posts/default', function(data){

		$(data).find('entry').each(function(){
			var el = $(this);

			var title = el.find('title').text();
			var link = el.find('link[rel=alternate]').text();
			var date = el.find('published').text();

			timeline.items.push({
				title: title,
				date: date,
				subtext: '',
				icon: 'img/javasaur.png'
			});

		});

		bloggerDone = true;

		dataSourceComplete();
	});


}

function dataSourceComplete(){

	if(githubDone){

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
