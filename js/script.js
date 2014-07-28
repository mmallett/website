var timeline = {items:[]};

var githubDone = false,
	bloggerDone = false,
	linkedinDone = false;

$(document).ready(function(){

	$('#info').hide();

	$('.head-box button').click(function(){
		$('#info').slideToggle();
		$('.head-box button span').toggleClass('glyphicon-chevron-up glyphicon-chevron-down');
	});

	$('.top-spacer').height($('.head-box').height() + 50);

	hbUtils.init();

	doStaticData();

	doGithub();

	doBlogger();

	doLinkedin();
	
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
			subtext: "I've finally fulfilled my lifelong dream of starting a blog. </sarcasm>",
			link: 'http://javasaur.blogspot.com',
			icon: 'img/javasaur.png'
		}
	]

	for(var i = 0; i < staticData.length; i++){
		timeline.items.push(staticData[i]);
	}

	dataSourceComplete();
}

function doBlogger(){

	$.get('proxy/blogspot', function(data){

		$(data).find('entry').each(function(){
			var el = $(this);

			var title = el.find('title').text();
			var link = el.find('link[rel="alternate"]').attr('href');
			var date = el.find('published').text();

			timeline.items.push({
				title: title,
				date: date,
				subtext: '',
				link: link,
				icon: 'img/javasaur.png'
			});

		});

		bloggerDone = true;

		dataSourceComplete();
	});


}

function doLinkedin(){

	var linkedinLink = 'http://www.linkedin.com/in/mathewmallett';

	$.get('proxy/linkedin', function(data){

		$(data).find('div.experience').each(function(){
			var el = $(this);

			var title = el.find('span.title').text() + 
						' @ ' + el.find('span.org').text();
			var description = el.find('p.description').text();
			var date = el.find('abbr.dtstart').text();

			timeline.items.push({
				title: title,
				date: date,
				subtext: description,
				link: linkedinLink,
				icon: 'http://www.arcogent.com/wp-content/uploads/2012/12/transparent-Linkedin-logo-icon.png'
			});

		});
		$(data).find('div.education').each(function(){
			var el = $(this);

			var school = el.find('a').text();
			var description = el.find('span.degree').text() +
							' in ' + el.find('span.major').text();
			var start = el.find('abbr.dtstart').text();
			var end = el.find('abbr.dtend').text();

			timeline.items.push({
				title: 'Started @ ' + school,
				date: start,
				subtext: description,
				link: linkedinLink,
				icon: 'http://www.arcogent.com/wp-content/uploads/2012/12/transparent-Linkedin-logo-icon.png'
			});

			timeline.items.push({
				title: 'Graduated from ' + school,
				date: end,
				subtext: description,
				link: linkedinLink,
				icon: 'http://www.arcogent.com/wp-content/uploads/2012/12/transparent-Linkedin-logo-icon.png'
			});
		});

		linkedinDone = true;

		dataSourceComplete();


	});
}

function dataSourceComplete(){

	if(githubDone && bloggerDone && linkedinDone){

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
