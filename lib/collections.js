Category = new Meteor.Collection('category');
Expenses = new Meteor.Collection('expenses');
Total = new Meteor.Collection('total');

ExpensesSchema = new SimpleSchema({
	date: {
		type: Date,
		label: 'Expense Date'
	}, // end of date

	cate: {
		type: String,
		label: 'Expense Category',
		optional:true,
	}, // end of cate

	subcate: {
		type: String,
		label: 'Expense Subcategory',
		optional:true
	}, // end of subcate

	comment: {
		type: String,
		label: 'Expense Details'
	}, // end of comment

	expense: {
		type: Number,
		decimal:true,
		label: 'Expense Value'
	}, // end of date
	user: {
		type: String,
		label: 'User Id'
	}, // end of user
	checked: {
		type: Boolean,
		label: 'Checked or Unchecked',
	}, // end of user
}) // end of SimpleSchema

Expenses.attachSchema(ExpensesSchema);