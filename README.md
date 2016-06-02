## Disclaimer
This is my first attempt at creating a full-fledged app. Please use this app at your own risk.

## What is this app all about?
* This app has been built using the [Meteor](https://www.meteor.com) framework
* It is designed to keep track of all your expenses
* Displays pie and bar charts for all expense categories and subcategories.

All expenses and categories entered are stamped with the user ID so a user can only view his/her data.

## What features does this app support?
* Create an account - The Navigation Menu is not displayed unless a user is logged in
* Create your own Category and Sub-Category. For example a Category could be called **Housing** with multiple Sub-Categories like **Power**, **Rent**, **Water**
* Manually add expenses
* Upload a CSV file for expenses - For example download your credit card expenses and format it as required
* Filter all expenses based on Year, Category and Sub-Category - For example visualize all expenses for 2016 in a Pie Chart and tabular format
* View all expenses (by categories) in a bar chart (comparison across months) 
* Search the tabular data for specific expenses
* Delet or edit a specific expense
* Bulk delete expenses
* Bulk edit the Category and Sub-Category of expenses

## Getting Started
The following instructions are for Ubuntu/OSX
#### Install Meteor
    curl https://install.meteor.com/ | sh
#### Install git
    sudo apt-get install git
#### Pull the code from GitHub
    mkdir personal-budget
    cd personal-budget/
    git init
    git pull https://github.com/mehrashiv/personal-budget.git
    meteor

## References
* [Official Meteor Site](https://www.meteor.com)
* [The Meteor Chef](https://themeteorchef.com)
* [Official MongoDB Site](https://www.mongodb.com)
