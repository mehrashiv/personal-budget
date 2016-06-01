Meteor.publish('total', function(){
	return Total.find({user:this.userId});
}) // end of Metor.publish

Meteor.publish('expenses',function(filters_date, cate, subcate) {
	gte = new Date(moment(filters_date).format('ddd MMM DD YYYY h:mm:ss ZZ z'))
	lt = new Date(moment(filters_date).add(1,'y').format('ddd MMM DD YYYY h:mm:ss ZZ z'))
		if (cate == 'ALL') {
			return Expenses.find({'date':{$gte:gte,$lt:lt},user:this.userId});
			// cate = ""; subcate = ""
			// return Meteor.subscribe('expenses', Session.get('filters_date'), cate, subcate)
		}
		else if (cate != 'ALL' && subcate == 'ALL') {
			// cate = Session.get('filters_cat_value'); subcate = ""
			// return Meteor.subscribe('expenses', Session.get('filters_date'), cate, subcate)
		return Expenses.find({'date':{$gte:gte,$lt:lt},cate:cate,user:this.userId});
		}
		else {
			//cate = Session.get('filters_cat_value'); subcate = Session.get('filters_subcat_value')
			//return Meteor.subscribe('expenses', Session.get('filters_date'), cate, subcate)
			return Expenses.find({'date':{$gte:gte,$lt:lt},cate:cate, subcate:subcate,user:this.userId})
		}

})

Meteor.publish('category', function() {
	return Category.find({user:this.userId});
})