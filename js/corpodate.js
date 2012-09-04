(function ($) {
	$.fn.extend({
		Corpodate:function(options){
			var defaults = {
				initrange : null,
				endrange : null,
				validinit : '2012-1-1',
				datelocale : {
					month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
					month_names_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
				},
				title : 'Calendar'
			};
			var options =  $.extend(defaults,options);

			getWeekNumber = function(d) {
    		d = new Date(d);
    		d.setHours(0,0,0);
    		d.setDate(d.getDate() + 4 - (d.getDay()||7));
    		var yearStart = new Date(d.getFullYear(),0,1);
    		var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
    		return {year: d.getFullYear(), week:weekNo};
  		};
  		addDays = function(date,days){
  			n = new Date(date);
  			n = new Date(n.setDate(date.getDate()+days));
  			return n;
  		};

  		findFirtDayofYear = function(year,date){
  			d = new Date(date);
  			WeekData = getWeekNumber(date);
  			if(WeekData.year == year){
  				return d;
  			}
				n = addDays(d,1);
  			return findFirtDayofYear(d.getFullYear(),n);
  		};

  		formatDate = function(date){
					var d = new Date(date);
    			var curr_date = d.getDate();
    			var curr_month = d.getMonth() + 1; //Months are zero based
    			var curr_year = d.getFullYear();
    			return (curr_date<10?"0":"")+curr_date + "/" + (curr_month<10?"0":"") + curr_month + "/" + curr_year;
  		};
  		setTextDate = function(id,valueA,valueB){
  			
					var dateA = $(id+' .init-week-'+valueA).val();		
					var dateB = $(id+' .end-week-'+valueB).val();
					$(id+' .txt-initdate').val(formatDate(dateA));
					$(id+' .txt-enddate').val(formatDate(dateB));

  		};
  		buildCalendar = function(){
	  		var opt  = options;

		  	var idate = new Date(opt.initrange);
		  	var fdate = new Date(opt.endrange);
		  	var validinit = new Date(opt.validinit);

		  	var currentDate = new Date();
		  	var currentWeek = getWeekNumber(currentDate);

		  	var validWeek = getWeekNumber(validinit);
		  	var year = idate.getFullYear();

		  	var innercontainer = $("<div>").attr({'class':'inner'});
		  	var dayofweek = findFirtDayofYear(year,year+"-1-1");

		  	for(i in options.datelocale.month_names){
		  		if(i%3===0){
		  			var mainul=$("<ul/>").addClass('quarter');
		  			quarter = (i/3+1);
		  			var linkquarter = $("<a>").attr({'href':'javascript:void(0)','id':'quarter-'+quarter,'class':'quarter disabled'}).html("<span>"+"Quarter "+(i/3+1)+"</span>").appendTo(mainul);
		  		}
		  		var limainul = $("<li>");
 			  	var ulmonth = $("<ul>").addClass('month');
		  		var linkmonth = $("<a>").attr({'href':'javascript:void(0)','title':options.datelocale.month_names[i],'class':'month','id':options.datelocale.month_names_short[i]}).html("<span>"+options.datelocale.month_names_short[i]+"<span>").appendTo(ulmonth);

		  		inthismonth= true;
		  		
		  		var ulweek = $("<ul>").addClass('week');
		  		var active = false;
		  		while(inthismonth){
				  	var limonth = $("<li/>");

			 			var weekdata = getWeekNumber(dayofweek);
			 			if(weekdata.year==parseInt(year)){
			 				endweek = addDays(dayofweek,+6);
			 				$("<input>").attr({'type':'hidden','class':'init-week-'+weekdata.week}).val(dayofweek).appendTo(limonth);
			 				$("<input>").attr({'type':'hidden','class':'end-week-'+weekdata.week}).val(endweek).appendTo(limonth);
			 				$("<input>").attr({'type':'hidden','class':'value-week-'+weekdata.week}).val(weekdata.week).appendTo(limonth);
			 				statusweek = (weekdata.week>=validWeek.week  && weekdata.week <=currentWeek.week)?'enabled':'disabled';
							if(statusweek=='enabled'){
								active = true;
							}
			  			$("<a>").attr({'href':'javascript:void(0)','class': ('week quarter-'+quarter+' month-'+options.datelocale.month_names_short[i]+" "+statusweek)+' week-'+weekdata.week,'id':'week-'+weekdata.week}).text(weekdata.week).appendTo(limonth);
			  			limonth.addClass(statusweek);
			  			limonth.appendTo(ulmonth);	
			  		}		  		
		  			dayofweek = addDays(dayofweek,+7);
			  		inthismonth= dayofweek.getMonth()===parseInt(i)?true:false;
		  		}

		  		if(!active){
		  			linkmonth.addClass('disabled');		  			
		  		}else{
		  			linkmonth.addClass('enabled');
		  			ulmonth.addClass('active');
		  			linkquarter.removeClass('disabled');
		  			linkquarter.addClass('enabled');
		  		}
		  		ulweek.appendTo(limonth);

		  		limonth.appendTo(ulmonth);
		  		ulmonth.appendTo(limainul);
		  		limainul.appendTo(mainul);
		  		if(i%3===0){
		  			mainul.appendTo(innercontainer);
		  		}
		  	}
		  	return innercontainer;
  		};


	  	return this.each(function(){
		  	var opt  = options;
		  	var obj = $(this);
		  	var parent = '#'+$(obj).attr('id');

		  	var idate = new Date(opt.initrange);
		  	var fdate = new Date(opt.endrange);
		  
		  	var element = $('<div>').addClass('corpodate-range-dates').html(formatDate(opt.initrange)+" - "+formatDate(opt.endrange));
				element.click(function(){$(parent+' .corpodate-container').show();});

		  	var calendar = $("<div>").addClass('corpodate-container');
		  	
		  	var asidecalendar = $("<aside/>").addClass('calendar');

		  	var headercalendar = $("<header/>");
		  	$("<h3/>").text(opt.title).appendTo(headercalendar);
		  	var close = $("<a/>").text("x").attr({'href':'javascript:void(0);','class':'close'});
		  	close.click(function(){$(parent+' .corpodate-container').hide();});
		  	close.appendTo(headercalendar);
		  	headercalendar.appendTo(asidecalendar);

		  	var outer = $("<div/>").addClass('outer');

				var ulinsidecalendar = buildCalendar();
				ulinsidecalendar.appendTo(outer);

		  	formsearch = $("<div>").addClass('top');
		  	$("<input>").attr({'type':'input','class':'txt txt-initdate','readonly':'readonly'}).val(formatDate(idate)).appendTo(formsearch);
				$("<input>").attr({'type':'input','class':'txt txt-enddate','readonly':'readonly'}).val(formatDate(fdate)).appendTo(formsearch);	
				var search = $("<input>").attr({'type':'button','class':'search searchdate','id':'search-date'}).val("Search").appendTo(formsearch);	

		  	search.click(function(){
		  		$('.corpodate-container').hide();
					$(parent+' .corpodate-range-dates').html($('#'+$(obj).attr('id')+' .txt-initdate').val()+" - "+ $(parent+' .txt-enddate').val());
		  	});

		  	formsearch.appendTo(asidecalendar);
		  	outer.appendTo(asidecalendar);
		  	asidecalendar.appendTo(calendar);

		  	$(obj).append(element);
		  	$(obj).append(calendar);

		  	var click = true;
		  	var dateA = null;
		  	var dateB = null;
		  	var valueA = 0;
		  	var valueB = 0;
		  	
		  	$(parent+' .month.enabled').live("click",function(){
		  			var monthclass = '.month-'+$(this).attr('id');
						$(parent+' li.selected,'+parent+' a.selected').removeClass('selected');
		  			$(this).addClass('selected');
		  			$(parent+' '+monthclass+'.enabled').parent().addClass('selected');

		  			valueA =  $('.value-'+$(monthclass+".enabled:first").attr('id')).val();
		  			valueB = 	$('.value-'+$(monthclass+".enabled:last").attr('id')).val();
		  			if(typeof valueA!="undefined")
		  				setTextDate(parent,valueA,valueB);
		  	});

		  	$(parent+' .quarter.enabled').live("click",function(){
						var quarterclass = '.'+$(this).attr('id');
						$(parent+' li.selected,'+parent+' a.selected').removeClass('selected');
						$(this).addClass('selected');
		  			$(parent+' '+quarterclass+'.enabled').parent().addClass('selected');

		  			valueA =  $('.value-'+$(quarterclass+".enabled:first").attr('id')).val();
		  			valueB = 	$('.value-'+$(quarterclass+".enabled:last").attr('id')).val();
		  			if(typeof valueA!="undefined")
		  				setTextDate(parent,valueA,valueB);
		  	});

		  	$(parent+' .month.active li.enabled').live("click",function(){
			  		if(click){
			  				link = $(this).find("a");
			  				valueA = $('.value-'+$(link).attr('id')).val();
			  				valueB = 0;
			  				$(parent+' li.selected').removeClass('selected');
			  				$(this).addClass('selected');
			  				click = false;
			  		}else{
			  				link = $(this).find("a");
								dateB = $('.end-'+$(link).attr('id')).val();
								valueB = $('.value-'+$(link).attr('id')).val();
								click	= true;
			  		}

			  		if(valueB!=0){
				  		var tmp = valueA;
				  		if(valueB<valueA){
				  			valueA = valueB;
				  			valueB = tmp;
				  		}
				  		for(i=parseInt(valueA);i<=parseInt(valueB);i++){
				  			$(parent+' .week-'+i).parent().addClass('selected');
				  		}
			  		}
			  		if(click){
			  			setTextDate(parent,valueA,valueB);
			  		}
		  	});

	  	});
		}
});})(jQuery);