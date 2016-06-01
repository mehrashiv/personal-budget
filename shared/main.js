TabularTables = {};

TabularTables.Expenses = new Tabular.Table({
  name: "Expenses",
  collection: Expenses,
  columns: [
    {data: "checked", title: "Checked", visible: false},
    {tmpl: Meteor.isClient && Template.checkBoxes,title:'Select',class: "col-md-1",
      tmplContext: function (rowData) {
    return {
      item: rowData,
    };
  }
  },
    {data: 'date', render: function(data){ return moment(data).format('MM/DD/YYYY')},title: "Date"},
    {data: "cate", title: "Category"},
    {data: "subcate", title: "Subcategory"},
    {data: "comment", title: "Description"},
    {data: "expense", title: "Expense"},
    {tmpl: Meteor.isClient && Template.upDelexp, title:'Upate', class: "col-md-1",},
  ],
  selector:function(userId) {
    return {user:userId}
  },
});

function formatDate(date) {
  return moment(date).format('MM/DD/YYYY');
};