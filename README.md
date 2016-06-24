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

Navigate to **http://localhost:3000** (replace localhost with IP address or DNS name if accessing from a different PC)

## Using the App
This section demonstrates how to use this App
#### Step 1 - Create an User Account
![Sign In](http://s33.postimg.org/hmonfuvz3/Screen_Shot_2016_06_02_at_9_04_17_PM.png)
#### Step 2 - Create Categories and Sub Categories
![Add Category](http://s33.postimg.org/cf6eupxzz/02_Add_Cat.png)

1. Click on the **Add Category and Sub-Category** link
2. To add a Category type in the name and **Hit Enter** - This will add the category in the database and display it at the bottom of the form as an unordered list
3. To add a Sub-Category, choose the Category from the drop down list
4. Click on the **Choose Category** button. This will show a field to enter the Sub-category
5. Enter the Sub-Category value and hit enter. This will add the sub-category in the database and display it under the parent category

## References
* [Official Meteor Site](https://www.meteor.com)
* [The Meteor Chef](https://themeteorchef.com)
* [Official MongoDB Site](https://www.mongodb.com)
