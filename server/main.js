   Meteor.methods({
	totalSum:function(filter,userId) {
		if (userId == Meteor.userId()) {
			// Create a group for aggregation
		group = {
			_id: {
				cate: '$cate',
			},
			total : {
				$sum : '$expense'
			} 
		}
		// Create a new filter based on scenarios
		filter1 = {
			date:{
				$gte: new Date(filter.date),
				$lt: new Date(moment(filter.date).add(1,'y').format('ddd MMM DD YYYY h:mm:ss ZZ z'))
			}, 
			cate:filter.cate, 
			subcate:filter.subcate,
			user:Meteor.userId()
		}

		// If the Category Chosen is ALL then we delete the cate field from the filter
		if (filter.cate === 'ALL') {
			delete filter1.cate
		}

		// If the Subcategory Chosen is ALL then we delete the subcate field from the filter
		if (filter.subcate === 'ALL') {
			// group._id.subcate = ''
			delete filter1.subcate
		}

		// if a category has been chosen then we add subcategory to the group to get aggragates for all the subcategories
		if (filter.cate != 'ALL') {
			group._id.subcate = '$subcate';
		}

		// We use Mongo aggregation to aggregat the data
		totals = Expenses.aggregate([{$match: filter1},{$group: group}, {$sort:{total:-1}}]);
		// The _id filed is an objecct. The following code creates a new object with cate, subcate and total fields
		totalList = []
		_(totals).each(function(total) {
			if (total._id.subcate == undefined) {
				total._id.subcate = 'ALL'
			}
			totalList = totalList.concat({
				cate:total._id.cate,
				subcate:total._id.subcate,
				total:total.total
			})
		})

		agg_cate = Category.find({},{fields:{_id:0,cate:1}}).fetch()
		// The following if statement is added to avoid an error when returning totalList1.
		// The error is due to the fact agg_cate is null hence totalList1 does not get initialized
		if (agg_cate.length < 1) {
			totalList1 = new Array();
		}
		else {
			_(agg_cate).each(function(cate){
			
			// THIS IS USED FOR PIE CHARTS
			totalList1 = new Array();
			drillList = new Array();
			_(totalList).each(function(total1) {
				// if subcate is chosen then we want to show 
				if (total1.subcate != 'ALL') {
					cate = total1.subcate;
				}
				else {
					cate = total1.cate
					
				}
				totalList1.push([
					cate,
					total1.total
				])
				drillList.push([
						total1.subcate,
						total1.total
						])
			}) // end of _(totalList).each(function(total1)	
		 }); // end of _(agg_cate).each(function(cate)	
		}
		
		// The first List returned is for table view and 2nd list is for Pie Chart view
		
		return {total:totalList, pieTotal: totalList1};	
		} // end of if for userId check
		
	},
	reutrn_exp:function(date,cate,subcate,comment,expense,user) {
		if (user == Meteor.userId()) {
			if (cate === "Choose Category") {
			cate = '';
			subcate = ''; 
		}
		Expenses.insert({
			date:date,
			cate:cate,
			subcate:subcate,
			comment:comment,
			expense:Number(expense),
			user:Meteor.userId(),
			checked:false,
		}) // end of Expense.insert
		}
		
	}, // end of reutrn_exp:function()

	del_exp:function(exp_id, user) {
		if (user == Meteor.userId()) {
			if (Expenses.findOne({_id:exp_id}).user == Meteor.userId()) {
				Expenses.remove({_id:exp_id});
			}
			else {throw new Meteor.Error('This expense does not belong to user')}
		}
		
	}, // end of del_exp:function(exp_id)

	del_checked_exp:function() {
		Expenses.remove({checked:true});
	}, // end of del_checked_exp:function(exp_id)

	save_editedExp:function(id, date,cate,subcate,comment,expense,user) {
		if (user == Meteor.userId()) {
			if (Expenses.findOne({_id:id}).user == Meteor.userId()) {
				Expenses.update(
			id,
			{$set: {
				// date:date,
				cate:cate,
				subcate:subcate,
				comment:comment,
				expense:Number(expense),
				user:user
			}}
			);
			}
			else {throw new Meteor.Error('This expense does not belong to user')}
		} // end if user check
	}, // end of save_editedExp

	parseUpload:function(data, userid) {
		categories = Category.find()
		for (i = 0; i < data.length; i++) {
      		item=data[i],
      		catList = []
      		subcatList =[]
      		categories.forEach(function(category) {
				if (item.cate === category.cate) {
					catList = catList.concat(item.cate)
					if (category.subcate.indexOf(item.subcate) != -1) {
						subcatList = subcatList.concat(item.subcate)
					}
				}
				else {
					console.log('THRE IS NO MATCH FOR CATEGORY')
				}
			})
			if(catList.length < 1) {
				item.cate = ''
				item.subcate = ''
			}
			else if(subcatList.length < 1) {
				 item.subcate = ''
			}
      		Expenses.insert({
			date:new Date(item.date),
			cate:item.cate,
			subcate:item.subcate,
			comment:item.comment,
			expense:Number(item.expense),
			user:Meteor.userId(),
			checked:false
		}) // end of Expense.insert  
        	
        } // end of for loop
    }, // end of parseUpload:function(data)

    yearSnapshot:function(filter,userid) {
    	if (userid == Meteor.userId()) {
    		// For charting data across months Jan thru Dec we structure the data in a specific format and put it in a new Collection called Total
		// Step 1: We gather all the categories
		agg_cate = Category.find({user:Meteor.userId()},{fields:{_id:0,cate:1}}).fetch()
		// Step 2: We define month names to numbers mapping since our aggrgation returns month numbers
		months = {1:'Jan', 2:'Feb', 3:'Mar', 4:'Apr', 5:'May',6:'Jun',7:'Jul',8:'Aug',9:'Sep',10:'Oct',11:'Nov',12:'Dec'}

		// Dump the database and re-calculate to ensure new data is reflected
		Total.remove({user:Meteor.userId()});
		// Loop through each category (filter) and get the aggregated result for a category for every month in a year
		total1 = new Array()
		_(agg_cate).each(function(cate){
			totalMonth = Expenses.aggregate([{$match: {user:Meteor.userId(), date:{$gte: new Date(filter.date),$lt: new Date(moment(filter.date).add(1,'y').format('ddd MMM DD YYYY h:mm:ss ZZ z'))},cate:cate.cate}},{$group: {_id: {month: {$month: "$date"}}, total: {$sum:"$expense"}}}])
			// Map the month id to the total value for the category
			totalArray = {}
			_(totalMonth).each(function(tot) {
				
				for (monId in months) {
					 if (monId == tot._id.month) {
					 	totalArray[monId] = tot.total
				} // enf of for monId			
		}
		}) // end of _totalMonth function
		// Create an array of 12 values. Each position in the array reflects the total for that month. Required by Highcharts for column graphs
		b = []
		for (i =1; i <=12; i++) { if (totalArray[i] == undefined ) {totalArray[i]=0} b.push(totalArray[i])  }
		// For every category insert the category name and the new array created. The words name and data are for imp. highchart looks for those names
		Total.insert({
			name:cate.cate,
			data:b,
			user:Meteor.userId()
		}) // end of Total.insert
			
		 }); // end of _(agg_cate).each(function(cate)
    	}
    	
    }, // end of yearSnapshot:function(filter)

monthSnapshot:function(filter,userid) {
    	if (userid == Meteor.userId()) {
    		// For charting data across months Jan thru Dec we structure the data in a specific format and put it in a new Collection called Total
		// Step 1: We gather all the categories
		//match_date = user:Meteor.userId(), date:
		//{user:Meteor.userId(), date:{$gte: new Date(filter.date),$lt: new Date(moment(filter.date).add(1,'y').format('ddd MMM DD YYYY h:mm:ss ZZ z'))},cate:cate.cate}
		match_criteria = {
			user:Meteor.userId(),
			date:{$gte: new Date(filter.date),$lt: new Date(moment(filter.date).add(1,'y').format('ddd MMM DD YYYY h:mm:ss ZZ z'))},
		}
		// Step 2: We define month names to numbers mapping since our aggrgation returns month numbers
		months = {1:'Jan', 2:'Feb', 3:'Mar', 4:'Apr', 5:'May',6:'Jun',7:'Jul',8:'Aug',9:'Sep',10:'Oct',11:'Nov',12:'Dec'}

		// Dump the database and re-calculate to ensure new data is reflected
		// Loop through each category (filter) and get the aggregated result for a category for every month in a year
		total1 = new Array()
			
				totalMonth1 = Expenses.aggregate([{$match: {user:Meteor.userId(), date:{$gte: new Date(filter.date),$lt: new Date(moment(filter.date).add(1,'y').format('ddd MMM DD YYYY h:mm:ss ZZ z'))}}},{$group: {_id: {month: {$month: "$date"}}, total: {$sum:"$expense"}}}])
			// Map the month id to the total value for the category
			totalArray = {}
			_(totalMonth1).each(function(tot) {
				
				for (monId in months) {
					 if (monId == tot._id.month) {
					 	totalArray[monId] = tot.total
				} // enf of for monId			
		}
		}) // end of _totalMonth function
		// Create an array of 12 values. Each position in the array reflects the total for that month. Required by Highcharts for column graphs
		b = []
		for (i =1; i <=12; i++) { if (totalArray[i] == undefined ) {totalArray[i]=0} b.push(totalArray[i])  }
		// For every category insert the category name and the new array created. The words name and data are for imp. highchart looks for those names
		monthTotal = [{
			name:"Monthly Total Expenditure",
			data:b,
		}]
		
		
		
			
    	}
    	return monthTotal
    	
    }, // end of monthSnapshot:function(filter)

    updateExpenseCat:function(cate,subcate) {
    	ids = Expenses.find({checked:true}).fetch()
    	_(ids).each(function(id){
    		Expenses.update({_id:id._id},{$set :{cate:cate,subcate:subcate,checked:false}})
    	})
    	
    }, // end of updateExpenseCat

    checkExpenses:function(id, checked) {
    	Expenses.update(id, {
      			$set: { checked:!checked },
    });
    }, // end of limitedExpenses
    newcatInsert:function(cat_value,userid) {
    	if (userid == Meteor.userId()) {
    		if (!cat_value) {
			throw new Meteor.Error('Please enter a valid String')
		}
		else if (Category.find({user:Meteor.userId(),cate:{$in:[cat_value]}}).count() != 0) {
			throw new Meteor.Error('Category ' + cat_value + ' Already exists')
		}
		else {
			Category.insert({
    			cate: cat_value,
    			subcate:[],
    			user:Meteor.userId()
    		});
		}
    		
    	}
    }, // end of newcatInsert
    newsubcateInsert:function(cat_id, subcat_list,userid) {
    	if (userid == Meteor.userId()) {
    		Category.update(
				{_id:cat_id},
				{$set:{subcate:subcat_list}}
			)
    	}
    		
    },
    
}) // end of Meteor.methods
