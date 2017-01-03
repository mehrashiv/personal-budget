/////////////////////////////
/////////// ROUTER //////////
/////////////////////////////
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

// 'home' page
Router.route('/', function () {
  this.render("navbar", {to:"header"});
  this.render("home", {to:"main"});  
});

Router.route('/home', function () {
  this.render("navbar", {to:"header"});
  this.render("home", {to:"main"});  
});

// individual document page
Router.route('/summarychart', function () {
  this.render("navbar", {to:"header"});
  this.render("summaryChart", {to:"main"});  
});

Router.route('/addcate',function(){
	this.render("navbar",{to:"header"});
	this.render("addCate",{to:"main"});
});

Router.route("addExp", function (){
	this.render("navbar",{to:"header"});
	this.render("addExp",{to:"main"});
});

Router.route("upload", function (){
	this.render("navbar",{to:"header"});
	this.render("upload",{to:"main"});
});



//////////////////////////////
/////////// Session //////////
//////////////////////////////
Session.setDefault("isCreateSubCat", false);
Session.setDefault('selected_cat',undefined);
Session.setDefault("showSubcate", false);
Session.setDefault('selected_date',null);
Session.setDefault('totalSum',null);
Session.setDefault('yearSnapshot',null);
Session.setDefault('monthSnapshot',null);
Session.setDefault('uploading',false);
Session.set('nullCate',false);
Session.setDefault('filters_cat_value','ALL')
Session.setDefault('filters_subcat_value','ALL')
Session.setDefault('allCat',true);
Session.setDefault('filters_date',new Date());
Session.setDefault('danger_delExpid',null);
Session.setDefault('search_value',null);



Meteor.subscribe('total')
Meteor.subscribe('category')
Tracker.autorun(function() {
	Meteor.subscribe('expenses', Session.get('filters_date'), Session.get('filters_cat_value'), Session.get('filters_subcat_value'))
	//$('#datetimepicker2').datetimepicker({ format: 'MM/DD/YYYY',defaultDate:Session.get('selected_date') });
})


//////////////////////////////////////////////
/////////// TEMPLATE INITIALIZATION //////////
//////////////////////////////////////////////
Template.addExp.rendered = function(){
    $('#datetimepicker1').datetimepicker({ format: 'MM/DD/YYYY' });
};
// DISABLED FOR NOW SINCE SINGLE EXP EDIT HAS DATE FIELD DISABLED
// Template.editingExpenses.rendered = function() {
// 	$('#datetimepicker2').datetimepicker({ format: 'MM/DD/YYYY',defaultDate:Session.get('selected_date') });

// }

Template.summaryChart.rendered = function () {
	// Session.setDefault('filters_cat_value','ALL')
	// Session.setDefault('filters_subcat_value','ALL')
	$('#datetimepicker3').datetimepicker({ format: 'YYYY', defaultDate:Session.get('filters_date') });
	fetchdata({date: Session.get('filters_date'), cate:'ALL', subcate:'ALL'})
	ySnapshot({date: Session.get('filters_date'), cate:'ALL', subcate:'ALL'})
	mSnapshot({date: Session.get('filters_date'), cate:'ALL', subcate:'ALL'})

	//$('#datetimepicker2').datetimepicker({ format: 'MM/DD/YYYY',defaultDate:Session.get('selected_date') });
}

//////////////////////////////
/////////// HELPERS //////////
//////////////////////////////

/////////// UPLOAD //////////
Template.upload.helpers({
	uploading:function(){
		return Session.get('uploading')
	},// end of uploading:function()
}); // end of Template.upload.helpers

Template.detailExp.helpers({
	selector:function() {
		gte = new Date(moment(Session.get('filters_date')).format('ddd MMM DD YYYY h:mm:ss ZZ z'))
		lt = new Date(moment(Session.get('filters_date')).add(1,'y').format('ddd MMM DD YYYY h:mm:ss ZZ z'))
		if (Session.get('filters_cat_value') == 'ALL') {
			return {'date':{$gte:gte,$lt:lt}}
		}
		else if (Session.get('filters_cat_value') != 'ALL' && Session.get('filters_subcat_value') == 'ALL') {
			return {'date':{$gte:gte,$lt:lt},cate:Session.get('filters_cat_value')};
		}
		else {
			return {'date':{$gte:gte,$lt:lt},cate:Session.get('filters_cat_value'), subcate:Session.get('filters_subcat_value')}
		}
	} // end of selector
}) // end of Template.detailExp.helpers

/////////// ADDCATE //////////
Template.addCate.helpers({
	cat_list:function(){
		return Category.find();
		//return Category.find({cate: {$in:['Housing']}})
	}, // end of cat_list:function()
	isCreateSubCat:function(){
		return Session.get('isCreateSubCat')
	}, // end of isCreateSubCat
}); // end of Template.addCate.helpers

/////////// SUMMARY CHART //////////
Template.summaryChart.helpers({
	expenses:function() {
		return Expenses.find()
	}, // end of expenses:function()
	editExp:function(){
		return Session.get('editExpid') === this._id
	}, // end of editExp:function
	totalSum:function(){
		if (Session.get('totalSum') != null) {
			return Session.get('totalSum').total;
		}
		else {return false}
		
	},
	danger_delExp:function() {
		return (Session.get('danger_delExpid') === this._id)
	}, // end of danger_delExp
	// cat_list:function(){
		// if (Session.get('filters_cat_value') === 'ALL') {
		// 	return Category.find();
		// }
		// else if (Session.get('filters_cat_value') != 'ALL' && Session.get('filters_subcat_value') === 'ALL') {
		// return Category.find({cate:Session.get('filters_cat_value')});
		// }
		// else {
		// 	return Category.find({cate:Session.get('filters_cat_value'), subcate:Session.get('filters_subcat_value')})
		// }
	// }, // end of cat_list:function()
		
}); // end of Template.summaryChart.helpers

/////////// EDITING EXPENSES //////////
Template.editingExpenses.helpers({
	cat_list:function(){
			return Category.find();
	}, // end of cat_list:function()
	subcat_list:function(){
		selected_cat = Session.get('selected_cat');
		
			return Category.findOne({cate:selected_cat});
		}, // end of subcat_list:function
		nullCate:function() {
		return Session.get('nullCate');
	}, // end if nullcate
	exp_entry:function(){
		return Expenses.findOne({_id:Session.get('editExpid')})
	},
	// selected_date:function (){
	// 	return Session.get('selected_date')
	// }, // end of selected_date
	// comment:function(){
	// 	return Session.get('comment')
	// }, // end of comment
	// expense:function(){
	// 	return Session.get('expense')
	// }, // end of comment
}); // end of Template.editingExpenses.helpers

/////////// FILTERS //////////
Template.filters.helpers({
	allCat:function (){
		return Session.get('allCat')
	},
}); // end of Template.filters.helpers

/////////// ADD EXP //////////
Template.addExp.helpers({
	cat_list:function(){
		return Category.find();
	}, // end of cat_list:function()
	subcat_list:function(){
		selected_cat = Session.get('selected_cat');
		if (selected_cat === "Choose Category") {
			Session.set('showSubcate',false)
		}
		else {
			return Category.findOne({cate:selected_cat});
		}
		
	}, // end of subcat_list:function()
	showSubcate:function () {
		return Session.get('showSubcate')
	}, // end of showSubcate:function
}); // end of Template.addExp.helpers


Template.filteredCharts.helpers({
	topGenresChart1:function() {
		if (Session.get('totalSum') != null) {
			data = data = Session.get('totalSum').pieTotal
		}
		else {
			data = null
	}
		
	return {
		chart: {
            plotBackgroundColor: null,
            //plotBorderWidth: 1,
            //plotBorderColor:'#FF8300',
            plotShadow: false
        },
        title: {
            text: 'Aggregate for Category/Subcategory'
        },
        tooltip: {
            pointFormat: '$<b>{point.y}</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    connectorColor: 'silver'
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'genre',
            data: data
        }]
   
	} // end of return
}, // end of topGenresChart1
}) // end of Template.filteredCharts.helpers 

Template.yearTotalCharts.helpers({
topGenresChart2:function() {
		
		totals2 = Total.find({},{_id:0, cate:1, total:1}).fetch()
	return {
		chart: {
            type: 'column',
            //borderWidth:1,
            //borderColor:'#FF8300'
        },
        
        title: {
            text: 'Year Summary'
        },
        
        subtitle: {
            text: 'Snapshot of Budget'
        },
        
        credits: {
            enabled: false
        },
        
        xAxis: {
            categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ]
        },
        
        yAxis: {
            min: 0,
            title: {
                text: 'Expenses ($)'
            }
        },
        
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>${point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        
        series: totals2
        // [{
        //     name: 'Tokyo',
        //     data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

        // }, {
        //     name: 'New York',
        //     data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

        // }, {
        //     name: 'London',
        //     data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

        // }, {
        //     name: 'Berlin',
        //     data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

        // }]
   
	} // end of return
}, // end of topGenresChart2
}) // end of Template.yearTotalCharts.helpers

Template.monthTotalCharts.helpers({
topGenresChart3:function() {
	return {
		chart: {
            type: 'column',
            //borderWidth:1,
            //borderColor:'#FF8300'
        },
        
        title: {
            text: 'Monthly Total Snapshot'
        },
        
        subtitle: {
            text: 'Snapshot of Monthly Budget'
        },
        
        credits: {
            enabled: false
        },
        
        xAxis: {
            categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ]
        },
        
        yAxis: {
            min: 0,
            title: {
                text: 'Expenses ($)'
            }
        },
        
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>${point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        
        series: Session.get('monthSnapshot')
        // [{
        //     name: 'Tokyo',
        //     data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

        // }, {
        //     name: 'New York',
        //     data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

        // }, {
        //     name: 'London',
        //     data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

        // }, {
        //     name: 'Berlin',
        //     data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

        // }]
   
	} // end of return
}, // end of topGenresChart3
}) // end of Template.monthTotalCharts.helpers

//////////////////////////////
/////////// EVENTS ///////////
//////////////////////////////

/////////// ADD CATE //////////
Template.addCate.events({
	'submit .js_add_cat':function(evt){
		// prevent the page from reloading when value is submitted 
		evt.preventDefault();
		// get the value entered and get rid of the white spaces using trim()
		cat_value = evt.target.add_cat.value.trim();
        	Meteor.call('newcatInsert', cat_value, Meteor.userId(), function (err, res) {
        		if (err) {
        			Bert.alert(err,'danger')
        		}
        		else {
        			Bert.alert('Category ' + cat_value + ' added!!','success')
        		}
        	}) // end of Meteor call
		
		evt.target.add_cat.value = '';
	},
	'submit .js-selected-cat':function(evt, tpl){
      	evt.preventDefault();
      	selected_cat = tpl.$("select[name=chosen_cat]").val();
      	if (selected_cat == 'Choose a Category') {
      		Session.set('isCreateSubCat', false);
      	} // end of if
      	else {
      	Session.set('isCreateSubCat', true);
      	Session.set('selected_cat', selected_cat)
      }
  }, // end of submit .js-choose-cat
  'submit .js_add_subcat':function(evt){
		// prevent the page from reloading when value is submitted 
		evt.preventDefault();
		// get the value entered and get rid of the white spaces using trim()
		selected_cat = Session.get('selected_cat')
		subcat_value = evt.target.add_subcat.value.trim();
		// get all sub categories for the selected category
		subcat_list = Category.findOne({cate:selected_cat}).subcate
		cat_id = Category.findOne({cate:selected_cat})._id
		if ($.inArray(subcat_value, subcat_list) != -1) { 
			Bert.alert('Sub Category already exist', 'danger')
		} // end of if
		else if (!subcat_value) {
			Bert.alert('Enter a valid Sub Category', 'danger')
		}
			else {
			subcat_list = subcat_list.concat(subcat_value)
			Meteor.call('newsubcateInsert',cat_id, subcat_list, Meteor.userId(), function(err,res){
				if (err) {
        			Bert.alert(err,'danger')
        		}
        		else {
        			Bert.alert('SucCategory ' + subcat_value + ' added!!','success')
        		}
			}) // end of Meteor.call
		}// end of else
		evt.target.add_subcat.value = '';
		Session.set('isCreateSubCat',false)
	},
}); // end of Template.addCate.events

/////////// ADD EXP //////////
Template.addExp.events({
	'submit #add-date':function(evt,tpl){
		evt.preventDefault();
		if (tpl.find('.test').value.trim()) {
			Bert.alert('Enter a valid date', 'danger')
		}
		date = new Date (moment(tpl.find('.test').value, "MM.DD.YYYY").format('ddd MMM DD YYYY h:mm:ss ZZ z'));
		cate = tpl.find('#cat_value').value;
		subcate = tpl.find('#subcat_value').value;
		comment = evt.target.comment_value.value;
		expense = evt.target.expense_value.value;
		user = Meteor.userId();
		Meteor.call("reutrn_exp",date,cate,subcate,comment,expense,user, function(err,res){
			if (err){
				Bert.alert(err.reason,'warning')
			}
			else {
				Session.set('showSubcate',false)
				tpl.find('.test').value = '';
				tpl.find('#cat_value').value = '';
				evt.target.comment_value.value = '';
				evt.target.expense_value.value = '';
				Bert.alert('Your Expense has been successfully added','success', 'growl-top-right')
				return res;
			}
		}) // end of Meteor.call
		// Expenses.insert({
		// 	date: date,
		// 	val:Number(evt.target.add_subcat_1.value.trim())
		//}); // end of Expenses.insert
	},
	"change .selected_cat":function(evt,tpl) {
		evt.preventDefault();
		selected_cat = tpl.find('#cat_value').value;
		Session.set('selected_cat',selected_cat);
		Session.set('showSubcate',true)		
	} // end of change .selected_cat
	
}); // end of Template.addExp.event

/////////// SUMMARY CHART //////////
Template.summaryChart.events({
	'click .js_del_sel_exp':function(evt,tpl) {
		evt.preventDefault();
		Meteor.call("del_checked_exp", function(err, res){
			if(err) {
				console.log(err)
			}
			else {
				tpl.$('#myModal').modal('hide')
				fetchdata({date: Session.get('filters_date'), cate:Session.get('filters_cat_value'),subcate:Session.get('filters_subcat_value')});
				ySnapshot({date: Session.get('filters_date'), cate:Session.get('filters_cat_value'),subcate:Session.get('filters_subcat_value')});
				mSnapshot({date: Session.get('filters_date'), cate:Session.get('filters_cat_value'),subcate:Session.get('filters_subcat_value')});


			}
		}) // end of Meteor.call

	} // end of click .js_del_sel_exp

}); // end of Template.summarychart.events

/////////// checkBoxes //////////
Template.checkBoxes.events({
	'change .toggle-checked':function(evt,tpl) {
			Meteor.call('checkExpenses', this.item._id,this.item.checked)
	}, // end of 'click .toggle-checked'
}) // end of Template.checkBoxes.events


/////////// upDelexp //////////
Template.upDelexp.events({
	"click #btn_del_exp":function(evt,tpl) {
		evt.preventDefault();
		Session.set('delExpid', this._id)
		
	}, // end of click .js_del_exp
	'click .js_del_exp':function(evt,tpl) {
		Meteor.call("del_exp", Session.get('delExpid'), Meteor.userId(), function(err, res){
			if(err) {
				Bert.alert(err, 'danger')
			}
			else {
				console.log(res)
				tpl.$('#removeModal').modal('hide')
				fetchdata({date: Session.get('filters_date'), cate:Session.get('filters_cat_value'),subcate:Session.get('filters_subcat_value')});
				ySnapshot({date: Session.get('filters_date'), cate:Session.get('filters_cat_value'),subcate:Session.get('filters_subcat_value')});
				mSnapshot({date: Session.get('filters_date'), cate:Session.get('filters_cat_value'),subcate:Session.get('filters_subcat_value')});


			}
		}) // end of Meteor.call
	}, // end of click .js_del_exp

	"click #btn_edit_exp":function(evt,tpl) {
		evt.preventDefault();
			cate_match = Category.find({cate:{$in:[this.cate]}}).count()
			if (!cate_match) {
				Session.set('nullCate',true)
			}

		Session.set('editExpid',this._id);
		Session.set('selected_cat',this.cate);
		Session.set('selected_subcat',this.subcate)
		Session.set('selected_date',this.date)
	}, // end of click .js_edit_exp
}) // end of Template.upDelexp.events


/////////// EDITING EXP //////////
Template.editingExpenses.events({
	'click .js_save_editExp':function(evt,tpl) {
		evt.preventDefault();
		// DONT USE this._id. It seems to give the id of the first row of the table
		id = Session.get('editExpid');
		date = new Date (); // SENDING DUMMY VALUE FOR NOW..ACTUAL date variable is at next line
		//date = new Date (moment(tpl.find('.selected_date').value, "MM.DD.YYYY").format('ddd MMM DD YYYY h:mm:ss ZZ z'));
		cate = tpl.find('#cat_value').value;
		subcate = tpl.find('#subcat_value').value;
		comment = tpl.$('input[name=comment]').val();
		expense = tpl.$('input[name=expense_value]').val()
		user = Meteor.userId();
		Meteor.call('save_editedExp', id, date, cate, subcate, comment, expense, user, function(err,res) {
			if (err) {
				Bert.alert(err.reason + ' - Expense NOT updated', 'danger')
			}
			else {
				Bert.alert('Expense successfully update', 'success', 'growl-top-right')
			}
		}); // end of Meteor.call
		Session.set('editExpid',null);
		fetchdata({date: Session.get('filters_date'), cate:Session.get('filters_cat_value'),subcate:Session.get('filters_subcat_value')});
		ySnapshot({date: Session.get('filters_date'), cate:Session.get('filters_cat_value'),subcate:Session.get('filters_subcat_value')}); 
		mSnapshot({date: Session.get('filters_date'), cate:Session.get('filters_cat_value'),subcate:Session.get('filters_subcat_value')}); 
		$('#updateModal').modal('hide')
	}, // end of click .js_save_editExp
	"change .selected_cat":function(evt,tpl) {
		evt.preventDefault();
		selected_cat = tpl.find('#cat_value').value;
		Session.set('selected_cat',selected_cat);		
	}, // end of change .selected_cat
	'click .js_cancel_editExp':function (evt,tpl) {
		evt.preventDefault();
		Session.set('editExpid',null);
	}, // end of click .js_cancel_editExp
}); // end of Template.editingExpenses.events

/////////// FILTERS //////////
Template.filters.events({
	"change .filters_get_filter_cat":function(evt,tpl) {
		evt.preventDefault();
		selected_cat = tpl.find('#filters_cat_value').value;
		Session.set('filters_cat_value',selected_cat)
		// Always reset subcat filter to default ALL on selection of cate so no stale value is left over
		Session.set('filters_subcat_value','ALL')
		Session.set('allCat',false);
	}, // end of change .filters_get_filter_cat
	"change .filters_get_filter_subcat":function(evt,tpl) {
		evt.preventDefault();
		selected_subcat = tpl.find('#filters_subcat_value').value;
		Session.set('filters_subcat_value',selected_subcat)
	}, // end of change .filters_get_filter_subcat
	'dp.change #filters_date':function(evt, tpl){
		evt.preventDefault();
		date = new Date (moment(tpl.find('.test').value, "YYYY").format('ddd MMM DD YYYY h:mm:ss ZZ z'));
		//date = tpl.find('.test').value
		Session.set('filters_date',date);
		Session.set('filters_cat_value','ALL')
		Session.set('allCat',true);
		$('#filters_cat_value option').prop('selected', function() {
        return this.defaultSelected;
    });
		// Always reset cat and subcat filter to default ALL on selection of cate so no stale value is left over
		//Session.set('filters_cat_value','ALL')
		//Session.set('filters_subcat_value','ALL')
		//Session.set('allCat',false);
	}, // end of change .test
	// Needed to add dp.change for the datepicker since regualar change is not supported. 
	// The data-filter attribute is part of the form. It did not work for input tag.
	"dp.change [data-filter]":function(evt,tpl) {
		Session.set('search_value',null)
		fetchdata({date: Session.get('filters_date'), cate:Session.get('filters_cat_value'), subcate:Session.get('filters_subcat_value')})
		ySnapshot({date: Session.get('filters_date'), cate:Session.get('filters_cat_value'), subcate:Session.get('filters_subcat_value')})
		mSnapshot({date: Session.get('filters_date'), cate:Session.get('filters_cat_value'), subcate:Session.get('filters_subcat_value')})

	}, // end fof dp.change [data-filter]
	"change [data-filter]":function(evt,tpl) {
		Session.set('search_value',null)
		evt.preventDefault();
		fetchdata({date: Session.get('filters_date'), cate:Session.get('filters_cat_value'), subcate:Session.get('filters_subcat_value')})
		//Session.set('selected_cat',selected_cat);		
	}, // end of change .filters_get_filter_cat
}); // end of Template.filters.events

/////////// UPLOAD //////////
Template.upload.events({
	'change [name="uploadCSV"]':function(evt,tpl) {
		Session.set('uploading',true)
		Papa.parse(evt.target.files[0], {
			header:true,
			complete(results, file) {
				Meteor.call('parseUpload', results.data, Meteor.userId(),function(err, res){
					if (err) {
						Bert.alert(err.reason,'warning')
					}
					else {
						Session.set('uploading',false);
						Bert.alert('Upload complete!', 'success', 'growl-top-right')
					}
				}); // end if Meteor.call
			} // end if complete
		}); // end of Papa.parse
	}, // end of 'change [name='uploadCSV']
}); // end of Template.upload.events


//////////////////////////////
/////////// REGISTER HELPERS ///////////
//////////////////////////////

Template.registerHelper('userLoggedIn', function() {
		if (Meteor.userId()) {
			return true;
		} // end of if
		else {
			return false;
		} // end of else
}); // end of Template.ApplicationLayout.helpers

Template.registerHelper('checkCat', function (a) {

	return a === Session.get("selected_cat");
    }); // end of Template.registerHelper('checkCat', function (a)


Template.registerHelper('checkSubcat', function (a) {
	return a === Session.get("selected_subcat");
    }); // end of Template.registerHelper('checkSubcat', function (a)

Template.registerHelper('formatDate', function(date) {
  return moment(date).format('MM/DD/YYYY');
});

Template.registerHelper('category_list', function() {
	return Category.find();
}); // end of Template.registerHelper('category_list',

Template.registerHelper('subcategory_list', function(cate) {
	selected_cat = Session.get(cate);
	if (selected_cat === 'ALL') {
		Session.set('allCat',true)
		return null
	}
	else {
		Session.set('allCat',false)
		return Category.findOne({cate:selected_cat}).subcate;
	}
	
}); // end of Template.registerHelper('subcategory_list',

Template.registerHelper('subcategory_list_bulk', function(cate) {
	selected_cat = Session.get(cate);
	if (selected_cat == null) {
		return null
	}
	else if (selected_cat != 'Select a Category') {
		return Category.findOne({cate:selected_cat}).subcate;
	}
}); // end of Template.registerHelper('subcategory_list_bulks',

fetchdata = function (filters) {
	Meteor.call('totalSum', filters, Meteor.userId(), function (err,res){
		if (err) {
			Bert.alert(err.reason, 'warning')
		}
		else
			Session.set('totalSum', res)
	}) // end of Meteor.call
	
} // end of function fetchdata(filters)

ySnapshot = function (filters) {
	Meteor.call('yearSnapshot', filters, Meteor.userId(), function (err,res){
		if (err) {
			Bert.alert(err.reason, 'warning')
		}
		else
			Session.set('yearSnapshot', res)
	}) // end of Meteor.call
	
} // end of function ySnapshot (filters)

mSnapshot = function (filters) {
	Meteor.call('monthSnapshot', filters, Meteor.userId(), function (err,res){
		if (err) {
			Bert.alert(err.reason, 'warning')
		}
		else
			Session.set('monthSnapshot', res)
	}) // end of Meteor.call
	
} // end of function mSnapshot (filters)
