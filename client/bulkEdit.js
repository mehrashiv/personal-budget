Session.set('bulkedit_cat_value',null); 
Session.set('bulkedit_subcat_value',null); 

Template.bulkEdit.events({
	'click .js_bulkdel_exp':function(evt,tpl) {
		evt.preventDefault();
		console.log('BULK DELETING....')
		if (Expenses.find({checked:true}).count() == 0) {
			Bert.alert('No Expenses are Selected for deletion', 'danger', 'growl-top-right')
			tpl.$('#bulkDelModal').modal('hide')
		}
		else {
			console.log('UPDATING DOCS')
			Meteor.call('del_checked_exp', function (err,res){
		if (err) {
			Bert.alert(err.reason, 'warning')
		}
		else {
			tpl.$('#bulkDelModal').modal('hide')
			fetchdata({date: Session.get('filters_date'), cate:Session.get('filters_cat_value'),subcate:Session.get('filters_subcat_value')});
			ySnapshot({date: Session.get('filters_date'), cate:Session.get('filters_cat_value'),subcate:Session.get('filters_subcat_value')});
		}
	}) // end of Meteor.call
		}
	}, //  end of click .js_update_sel_exp	
	"change .bulkEdit_get_cat":function(evt,tpl) {
		evt.preventDefault();
		selected_bulkedit_cat = tpl.find('#bulkEdit_cat_value').value;
		Session.set('bulkedit_cat_value',selected_bulkedit_cat)
		console.log("BULK EDIT CATE VALUE ", Session.get('bulkedit_cat_value'))
		// Always reset subcat filter to default ALL on selection of cate so no stale value is left over
	}, // end of change .bulkedit_get_cat
	"change .bulkEdit_get_subcat":function(evt,tpl) {
		evt.preventDefault();
		selected_bulkedit_subcat = tpl.find('#bulkEdit_subcat_value').value;
		Session.set('bulkedit_subcat_value',selected_bulkedit_subcat)
		console.log("BULK EDIT SUBCATE VALUE ", Session.get('bulkedit_subcat_value'))
		
		// Always reset subcat filter to default ALL on selection of cate so no stale value is left over
	}, // end of change .bulkEdit_get_subcat
	"change [data-bulkEdit]":function(evt,tpl) {
		evt.preventDefault();
		console.log('BULK EDIT CATESUBCATE ',Session.get('bulkedit_cat_value'), Session.get('bulkedit_subcat_value'))
		//Session.set('selected_cat',selected_cat);		
	}, // end of change .filters_get_filter_cat
	'click .js_save_bulkeditExp':function(evt,tpl) {
		evt.preventDefault();
		cate = Session.get('bulkedit_cat_value');
		subcate = Session.get('bulkedit_subcat_value')
		if (Expenses.find({checked:true}).count() == 0) {
			tpl.$('#bulkUpdModal').modal('hide')
			Bert.alert('No Expenses are Selected for Updating', 'danger', 'growl-top-right')
		}
		else if (Category.find({cate:{$in:[cate]}}).count() == 0) {
			Bert.alert('Please Choose a Category', 'danger', 'growl-top-right')
		}
		else if (Category.find({subcate:{$in:[subcate]}}).count() == 0) {
			Bert.alert('Please Choose a Sub Category', 'danger', 'growl-top-right')
		}
		else {
			Meteor.call('updateExpenseCat',cate, subcate, function(err,res) {
				if (err) {
			Bert.alert(err.reason, 'danger')
		}
		else {
			tpl.find('#bulkEdit_cat_value').value = 'Select a Category'
			tpl.find('#bulkEdit_subcat_value').value = 'Select a SubCategory'
			Session.set('bulkedit_subcat_value',null)
			Session.set('bulkedit_cat_value',null)
			fetchdata({date: Session.get('filters_date'), cate:Session.get('filters_cat_value'),subcate:Session.get('filters_subcat_value')});
			ySnapshot({date: Session.get('filters_date'), cate:Session.get('filters_cat_value'),subcate:Session.get('filters_subcat_value')});
		}
		tpl.$('#bulkUpdModal').modal('hide')	
			}) // end of Meteor call
		}
	}, // end of click .js_save_bulkeditExp
	'click #bulk_upd_exp':function(evt,tpl) {
		evt.preventDefault();
		console.log('HITTING BULK UPDATE BUTTON')
		// This resets the value of the drop downs to default.
		tpl.find('#bulkEdit_cat_value').value = 'Select a Category'
		tpl.find('#bulkEdit_subcat_value').value = 'Select a SubCategory'
	},
}) // end of Template.bulkEdit.events

