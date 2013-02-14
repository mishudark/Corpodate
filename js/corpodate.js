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
				title : 'Calendar',
				onsuccess:function(){}
			};

			var options =  $.extend(defaults,options);

			parseISO8601 = function(dateStringInRange) {
	  		//IE='\v'=='v';
	  		if(typeof dateStringInRange !== 'string') return dateStringInRange;
	  		
				pedate=dateStringInRange.split("-");
				dateStringInRange = pedate[0]+"-"+((pedate[1].length==1?'0':'')+pedate[1])+"-"+((pedate[2].length==1?'0':'')+pedate[2]);
		    var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/,
		        date = new Date(NaN), month,
		        parts = isoExp.exec(dateStringInRange);

		    if(parts) {
		      month = +parts[2];
		      date.setFullYear(parts[1], month - 1, parts[3]);
		      if(month != date.getMonth() + 1) {
		        date.setTime(NaN);
		      }
		    }
		    return date;
			};

			getWeekNumber = function(d) {
    		d = new Date(d);
    		d.setHours(0,0,0);
    		d.setDate(d.getDate() + 4 - (d.getDay()||7));
    		var yearStart = new Date(d.getFullYear(),0,1);
    		var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    		var obj = {year: d.getFullYear(), week:weekNo};
    		return  obj;
  		};

  		addDays = function(date,days){
  			n = new Date(date);

  			n = new Date(n.setDate(date.getDate()+days));
  			return n;
  		};

  		findFirtDayofYear = function(year,date){
  			d = new Date(date);

  			WeekData = getWeekNumber(date);
  			if(WeekData.year === year){
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
  		formatShortDate = function(date){
					var d = new Date(date);
    			var curr_date = d.getDate();
    			var curr_month = d.getMonth() + 1; //Months are zero based
    			var curr_year = d.getFullYear();
    			return (curr_date<10?"0":"")+curr_date + " de  " + options.datelocale.month_names_short[curr_month-1] ;

  		}
  		setTextDate = function(id,valueA,valueB){
					var dateA = $(id+' .init-week-'+valueA).val();		
					var dateB = $(id+' .end-week-'+valueB).val();
					$(id+' .txt-initdate').val(formatDate(dateA));
					$(id+' .txt-enddate').val(formatDate(dateB));

  		};

  		buildCalendar = function(validinit,idate,fdate){
	  		var opt  = options;
		  	var currentDate = new Date();
		  	var currentWeek = getWeekNumber(currentDate);

		  	var validWeek = getWeekNumber(validinit);
		  	var year = idate.getFullYear();
		  	var innercontainer = $("<div>").attr({'class':'inner'});
		  	 
		  	var dayofweek = findFirtDayofYear(year,parseISO8601(year+"-1-1"));
		  	for(i =0;i<12;i++){
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
		  			var weekdata = getWeekNumber( dayofweek );
		  			var classweek ='';
						if(currentWeek.week == weekdata.week){
							classweek = 'selected';
						}

				  	var limonth = $("<li/>").addClass(classweek);
			 			if(weekdata.year==parseInt(year)){
			 				endweek = addDays(dayofweek,+6);
			 				$("<input>").attr({'type':'hidden','class':'init-week-'+weekdata.week}).val(dayofweek).appendTo(limonth);
			 				$("<input>").attr({'type':'hidden','class':'end-week-'+weekdata.week}).val(endweek).appendTo(limonth);
			 				$("<input>").attr({'type':'hidden','class':'value-week-'+weekdata.week}).val(weekdata.week).appendTo(limonth);
			 				statusweek = (weekdata.week>=validWeek.week  && weekdata.week <=currentWeek.week)?'enabled':'disabled';
							if(statusweek=='enabled'){
								active = true;
							}

							var daysofweek = formatShortDate(dayofweek)+" al "+formatShortDate(endweek); 
			  			$("<a>").attr({'href':'javascript:void(0)','class': ('week quarter-'+quarter+' month-'+options.datelocale.month_names_short[i]+" "+statusweek)+' week-'+weekdata.week,'id':'week-'+weekdata.week}).text(daysofweek).appendTo(limonth);
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

				if(!opt.initrange){
					d = new Date();
  				day = d.getDay();
      		diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
      		fdate = initdate = new Date(d.setDate(diff));	
					opt.initrange = initdate;
					opt.endrange = addDays(fdate,+6);
	  		}

		  	var idate = new Date(opt.initrange);
		  	var fdate = new Date(opt.endrange);
		  	var validinit = new Date(parseISO8601(opt.validinit));
		  	var today = new Date();
		  	var corpodateclick = true;

		  	var initYear = idate.getFullYear();
		  	var currentYear =today.getFullYear();

		  	var element = $('<div>').addClass('corpodate-range-dates').html(formatDate(opt.initrange)+" - "+formatDate(opt.endrange));
		  	var firstclick = true;
				element.click(function(){
					$(parent+' .corpodate-container').show();
					if(firstclick){
						var number = getWeekNumber(today).week;
						$(parent+' .inner').scrollTop((number-1)*20);
						firstclick = false;
					}
				});

		  	var calendar = $("<div>").addClass('corpodate-container');
		  	var asidecalendar = $("<aside/>").addClass('calendar');
		  	var headercalendar = $("<header/>");

		  	$("<h3/>").text(opt.title).appendTo(headercalendar);

		  	if(initYear < currentYear){
		  		select = $('<select/>').addClass('currentYear');
		  		for(y = initYear;y<=currentYear;y++){
		  			$('<option/>',{value:y,text:y}).appendTo(select);
		  		}
		  		select.change(function(){ 
		  			year = this.value;
		  			calendar = buildCalendar(validinit,new Date(year+'-1-1'),new Date(year+'-12-1'));
		  			$(parent+' .outer').html(calendar);
		  		});
		  		select.appendTo(headercalendar);
		  	}

		  	var close = $("<a/>").text("x").attr({'href':'javascript:void(0);','class':'close'});
		  	close.click(function(){$(parent+' .corpodate-container').hide();});
		  	close.appendTo(headercalendar);
		  	
		  	headercalendar.appendTo(asidecalendar);

		  	var outer = $("<div/>").addClass('outer');
		  	var year = $("<div/>").addClass('year');
		  	$("<a/>").attr({'href':'javascript:void(0);','class':'allyear'}).text("All the year").appendTo(year);

				var ulinsidecalendar = buildCalendar(validinit,idate,fdate);
				ulinsidecalendar.appendTo(outer);

		  	formsearch = $("<form>").addClass('top');
		  	$("<input>").attr({'type':'text','name':'initdate','class':'txt txt-initdate','readonly':'readonly'}).val(formatDate(idate)).appendTo(formsearch);
				$("<input>").attr({'type':'text','name':'enddate','class':'txt txt-enddate','readonly':'readonly'}).val(formatDate(fdate)).appendTo(formsearch);	
				$("<input>").attr({'type':'hidden','name':'typecalendar','class':'typecalendar','readonly':'readonly'}).val('week').appendTo(formsearch);	

				var search = $("<input>").attr({'type':'button','class':'search searchdate','id':'search-date'}).val("Aplicar").appendTo(formsearch);	

		  	search.click(function(){
		  		corpodateclick = true;
		  		$('.corpodate-container').hide();
					$(parent+' .corpodate-range-dates').html($('#'+$(obj).attr('id')+' .txt-initdate').val()+" - "+ $(parent+' .txt-enddate').val());
					opt.onsuccess();
		  	});

		  	formsearch.appendTo(asidecalendar);
		  	outer.appendTo(asidecalendar);
		  	year.appendTo(asidecalendar);
		  	asidecalendar.appendTo(calendar);

		  	$(obj).append(element);
		  	$(obj).append(calendar);
		  	var dateA = null;
		  	var dateB = null;
		  	var valueA = 0;
		  	var valueB = 0;
		  	
				$(parent+' .allyear').live("click",function(){
					$(parent+' .txt-initdate').val(formatDate(validinit));
					$(parent+' .txt-enddate').val(formatDate(today));
					$(parent+' .typecalendar').val('year');
				});

		  	$(parent+' .month.enabled').live("click",function(){
		  			var monthclass = '.month-'+$(this).attr('id');
						$(parent+' li.selected,'+parent+' a.selected').removeClass('selected');
		  			$(this).addClass('selected');
		  			var month = opt.datelocale.month_names_short.indexOf($(this).attr('id'));
		  			selectedYear = $(parent+' .currentYear').val();
		  			valueA = new Date(selectedYear,month,1);
		  			valueB = new Date(selectedYear,month+1,0);
			  		$(parent+' .txt-initdate').val(formatDate(valueA));
						$(parent+' .txt-enddate').val(formatDate(valueB));
						$(parent+' .typecalendar').val('month');
		  	});

		  	$(parent+' .quarter.enabled').live("click",function(){
						var quarterclass = '.'+$(this).attr('id');
						$(parent+' li.selected,'+parent+' a.selected').removeClass('selected');
						$(this).addClass('selected');

						var month = opt.datelocale.month_names_short.indexOf( $(this).parent().find('a.month:first').attr('id')  );
						var lastmonth = opt.datelocale.month_names_short.indexOf( $(this).parent().find('a.month:last').attr('id') );

						valueA =  $('.value-'+$(quarterclass+".enabled:first").attr('id')).val();
		  			valueB = 	$('.value-'+$(quarterclass+".enabled:last").attr('id')).val();

						setTextDate(parent,valueA,valueB);
		  			$(parent+' .typecalendar').val('quarter');	
		  	});

		  	$(parent+' .month.active li.enabled').live("click",function(){
		  			$(parent+' .typecalendar').val('week');
			  		if(corpodateclick){
			  				link = $(this).find("a");
			  				valueA = $('.value-'+$(link).attr('id')).val();
			  				valueB = $('.value-'+$(link).attr('id')).val();
			  				$(parent+' li.selected').removeClass('selected');
			  				$(this).addClass('selected');
			  				corpodateclick = false;
			  		}else{
			  				link = $(this).find("a");
								dateB = $('.end-'+$(link).attr('id')).val();
								valueB = $('.value-'+$(link).attr('id')).val();
								corpodateclick	= true;
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
			  		
			  		setTextDate(parent,valueA,valueB);
			  		
		  	});

	  	});
		}
});})(jQuery);
