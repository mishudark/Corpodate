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
				}
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
  		setDate = function(valueA,valueB){
					var dateA = $('.init-week-'+valueA).val();		
					var dateB = $('.end-week-'+valueB).val();
					$('#txt-initdate').val(formatDate(dateA));
					$('#txt-enddate').val(formatDate(dateB));

  		};

	  	return this.each(function(){
		  	var opt  = options;
		  	var obj = $(this);

		  	var idate = new Date(opt.initrange);
		  	var fdate = new Date(opt.endrange);
		  	var validinit = new Date(opt.validinit);

		  	var currentDate = new Date();
		  	var currentWeek = getWeekNumber(currentDate);

		  	var validWeek = getWeekNumber(validinit);
		  	var year = idate.getFullYear();

		  	var element = $('<div>').addClass('range-dates').html(formatDate(opt.initrange)+" - "+formatDate(opt.endrange));

		  	element.click(function(){$('.corpodate-container').show();});

		  	var calendar = $("<div>").addClass('corpodate-container');
		  	var ulquarter = $("<ul>").addClass('quarter-ul');
		  

		  	var dayofweek = findFirtDayofYear(year,year+"-1-1");

		  	for(i in options.datelocale.month_names){
		  		if(i%3===0){
		  			var liquarter=$("<li/>");
		  			quarter = (i/3+1);
		  			var linkquarter = $("<a>").attr({'href':'javascript:void(0)','id':'quarter'+quarter,'class':'quarter-selection disabled'}).text("Quarter "+(i/3+1)).appendTo(liquarter);
		  		}

 			  	var ulmonth = $("<ul>").addClass('month-ul');
		  		var limonth = $("<li/>");
		  		var linkmonth = $("<a>").attr({'href':'javascript:void(0)','class':'month-selection','id':options.datelocale.month_names_short[i]}).text(options.datelocale.month_names[i]).appendTo(limonth);

		  		inthismonth= true;
		  		
		  		var ulweek = $("<ul>").addClass('week-ul');
		  		var active = false;
		  		while(inthismonth){
				  	var liweek = $("<li/>");

			 			var weekdata = getWeekNumber(dayofweek);
			 			if(weekdata.year==parseInt(year)){
			 				endweek = addDays(dayofweek,+6);
			 				$("<input>").attr({'type':'hidden','class':'init-week-'+weekdata.week}).val(dayofweek).appendTo(liweek);
			 				$("<input>").attr({'type':'hidden','class':'end-week-'+weekdata.week}).val(endweek).appendTo(liweek);
			 				$("<input>").attr({'type':'hidden','class':'value-week-'+weekdata.week}).val(weekdata.week).appendTo(liweek);
			 				statusweek = (weekdata.week>=validWeek.week  && weekdata.week <=currentWeek.week)?'enabled':'disabled';
							if(statusweek=='enabled'){
								active = true;
							}
			  			$("<a>").attr({'href':'javascript:void(0)','class': ('week-selection weekof-quarter'+quarter+' weekof-'+options.datelocale.month_names_short[i]+" "+statusweek),'id':'week-'+weekdata.week}).text("Week "+weekdata.week).appendTo(liweek);
			  			liweek.appendTo(ulweek);	
			  		}		  		
		  			dayofweek = addDays(dayofweek,+7);
			  		inthismonth= dayofweek.getMonth()===parseInt(i)?true:false;
		  		}
		  		if(!active){
		  			linkmonth.addClass('disabled');
		  		}else{
		  			linkmonth.addClass('enabled');
		  			linkquarter.removeClass('disabled');
		  			linkquarter.addClass('enabled');
		  		}
		  		ulweek.appendTo(limonth);

		  		limonth.appendTo(ulmonth);
		  		ulmonth.appendTo(liquarter);
		  		if(i%3===0){
		  			liquarter.appendTo(ulquarter);
		  		}
		  	}

		  	formsearch = $("<div>");
		  	$("<input>").attr({'type':'input','class':'inputdate','id':'txt-initdate'}).val(formatDate(idate)).appendTo(formsearch);
				$("<input>").attr({'type':'input','class':'inputdate','id':'txt-enddate'}).val(formatDate(fdate)).appendTo(formsearch);	
				var search = $("<input>").attr({'type':'button','class':'searchdate','id':'search-date'}).val("Search").appendTo(formsearch);	

		  	search.click(function(){
		  		$('.corpodate-container').hide();
					$('.range-dates').html($('#txt-initdate').val()+" - "+ $("#txt-enddate").val());
		  	});

		  	formsearch.appendTo(calendar);
		  	ulquarter.appendTo(calendar);

		  	$(obj).append(element);
		  	$(obj).append(calendar);
		  	var click = true;
		  	var dateA =null;
		  	var valueA = 0;
		  	var dateB = null;
		  	var valueB = 0;
		  	
		  	$('.month-selection.enabled').live("click",function(){
						$('.week-selection.selected').removeClass('selected');
		  			$('.weekof-'+$(this).attr('id')+'.enabled').addClass('selected');
		  			valueA =  $('.value-'+$('.weekof-'+$(this).attr('id')+".enabled:first").attr('id')).val();
		  			valueB = 	$('.value-'+$('.weekof-'+$(this).attr('id')+".enabled:last").attr('id')).val();
		  			if(typeof valueA!="undefined")
		  				setDate(valueA,valueB);
		  	});

		  	$('.quarter-selection.enabled').live("click",function(){
						$('.week-selection.selected').removeClass('selected');
		  			$('.weekof-'+$(this).attr('id')+'.enabled').addClass('selected');
		  			valueA =  $('.value-'+$('.weekof-'+$(this).attr('id')+".enabled:first").attr('id')).val();
		  			valueB = 	$('.value-'+$('.weekof-'+$(this).attr('id')+".enabled:last").attr('id')).val();
		  			if(typeof valueA!="undefined")
		  				setDate(valueA,valueB);
		  	});

		  	$('.week-selection.enabled').live("click",function(){
		  		if(click){
		  				$('.week-selection.selected').removeClass('selected');
		  				valueA = $('.value-'+$(this).attr('id')).val();
		  				valueB = 0;
		  				$(this).addClass('selected');
		  				click = false;
		  		}else{
							dateB = $('.end-'+$(this).attr('id')).val();
							valueB = $('.value-'+$(this).attr('id')).val();
							click	= true;
		  		}
		  		if(valueB!=0){
			  		var tmp = valueA;
			  		if(valueB<valueA){
			  			valueA = valueB;
			  			valueB = tmp;
			  		}
			  		for(i=parseInt(valueA);i<=parseInt(valueB);i++){
			  			$('#week-'+i).addClass('selected');
			  		}
		  		}
		  		if(click){
		  			setDate(valueA,valueB);
		  		}
		  	});

	  	});
		}
});})(jQuery);