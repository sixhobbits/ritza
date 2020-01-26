# Building a CRM app with Sashido and NodeJS
In this tutorial we'll use NodeJS on Sashido to build a basic [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) (Create, Read, Update, Delete) [CRM](https://en.wikipedia.org/wiki/Customer_relationship_management) (Customer Relationship Management) application.

Sashido is a platform that tries to make writing an app backend really simple. They offer features that a lot of basic backends need, but are often quite complicated to build properly from scratch.

A CRM lets you store information about customers to help you track the status of every customer relationship. This can help businesses keep track of their clients and ultimately increase sales. The application will be able to store and edit customer details, as well as keep notes about them.

The tutorial won't be covering the basics of Node.js, but each line of code will be explained in detail.

While Sashido does have an online editor, in order to fully make use of the features they offer you will need to code locally on your machine. To that end, you will need a good text editor - I like [VSCode](https://code.visualstudio.com/download) - [git](https://git-scm.com/downloads), and the latest stable version of [NodeJS](https://nodejs.org/en/download/).

## Setup
The code for this tutorial will be written on your local computer, stored on Github in a private repository, and run on Sashido. Sashido offers a way to link to your Github account so that when you push to your private Github repository, it automatically gets deployed - we'll get more into that a little later.

For setup, we'll be walking you through the following steps. Skip any that don't apply to you (e.g. if you already have a Sashido account, you don't have to make a new one).

  * Create a Sashido account
  * Create a Github account
  * Create a [LocationIQ](https://locationiq.com/) account
  * Link Sashido and Github
  * Create your first app in Sashido

### Create a Sashido account
Navigate to the [Sashido website](https://www.sashido.io/en/). In the top right hand corner, click on Sign Up.

Enter your email address and click the first slider to agree to their terms of service. You can decide if you want to click the second slider to receive their newslettes. Click `Get Started`. ![Sashido Sign Up](https://imgur.com/eAgOCKz.jpg)

You now need to go to your email inbox and find the email that has just been sent by Sashido. Once you have, click on `Confirm your Registration`. This will open up a page that asks for you to set a password. Set a strong password, click the slider that agrees to their terms of service, and click `Activate`.

### Create a Github account
Head over to [Github](https://github.com/). Fill in the Username, Email, and Password fields and click `Sign up for Github`.

Under "Verify your account" you need to complete the Captcha, then click `Next: Select a plan`. Select the Free Tier. 

Complete the last step by selecting your experience level and interests, and click `Complete setup`. Alternatively, scroll to the bottom and click `Skip this step`.

You now need to open up your email inbox again, look for the email from Github, and click the link that says `verify email address`.

### Create a LocationIQ account
Next you need to go to [LocationIQ](https://locationiq.com/). Click `Sign up` in the top right.

Fill in your name and email and click the `Sign up` button. You will receive an email with your API token for LocationIQ.

Log in to your LocationIQ account and click on `Access Tokens` on the left sidebar. Click on `Create Access Token`. Fill in the `Label` field and click `Create`. Make a note of the token - you'll need it later.

### Create your first app in Sashido
You can now head back to Sashido. On the main Dashboard click the big green `Create New App` button. ![Create new app](https://imgur.com/EE066qG.jpg)

You can upload an icon if you want - we didn't just so that we could get on with things. 

Name your app - we just called it CRM. For the region we chose North America, though there's no reason you couldn't select Europe. Click the `Create` button at the bottom.

After Sashido has finished setting up, click the `Continue` button. Finally, in the bottom right, click the `Go to CRM` button.

### Link Sashido to Github
Sashido lets you link your Github account to make development easier. Go to Core > Cloud Code and click on the `Connect your account to Github` button. This will take you to Github where you need to click on the `Authorize Sashido` button.

You will be redirected back to Sashido. Click on `Start your Cloud Code`. You now need to go back to your inbox where you'll have received an invitation to collaborate on a Github repository. Click `View invitation` and the accept the invitation. This creates a new private Github repository for you.

You can now clone this repository with `git clone <repo-url>`.

## Create Registration and login pages using Sashido static files
The first thing you'll notice is that Sashido provide 2 basic folders for your code - `cloud` and `public`. These should not be renamed or deleted, as it will cause your app to stop working.

`cloud` is for Cloud Functions and Triggers, as well as for more complicated code using ExpressJS. We'll use some of this functionality later.

`public` is for static files - this is where you can put files and code related to your website or web frontend. We'll start in this folder.

To start with, we need to create a registration and login page.

First, go to css > main.css and remove all the code in there (CRTL + A, Delete). Now insert the following CSS:

```css
input[type=text], input[type=password], select {
  width: 50%;
  padding: 12px 20px;
  margin: 8px auto;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

a {
  float: right;
  padding: 14px 20px;
}

button {
  width: 50%;
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px auto;
  display: block;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

input[type=button] {
  width: 25%;
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px auto;
  display: inline-block;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover, input[type=button]:hover {
  background-color: #45a049;
}

.container {
  width: 100%;
  text-align: center;
}

label {
  display: inline-block;
  width: 150px;
  text-align: right;
}

div {
  border-radius: 5px;
  background-color: #f2f2f2;
  padding: 5px;
}

form {
  text-align: center;
}
```

CSS stands for [Cascading Style Sheets](https://en.wikipedia.org/wiki/Cascading_Style_Sheets). It is used to describe the presentation of HTML, i.e. with CSS you can change the look of your HTML page. We won't go in depth with the above CSS, we're just using it to make our pages look a little bit nicer.

Next, go to `index.html` and remove all the code in there (CTRL + A, Delete). Now insert the following code:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="/css/main.css">
  </head>
  <body>
    <div id="registerForm">
      <form>
        <h2>Registration</h2>
        <div>
            <div>
                <label for="username" >Username *</label>
                <input type="text" id="username" name="username" class="textInput" required>
            </div>
            <div>
                <label for="password" >Password *</label>
                <input type="password" id="password" name="password" class="textInput" required>
            </div>
            <div>
                <label for="email" >Email *</label>
                <input type="text" id="email" name="email" class="textInput" required>
            </div>
        </div>
        <input id="registerButton" type="button" value="Register">
      </form>
        <div class="container">
            <a href="/login.html">Already registered? Login here</a>
        </div>
    </div>
  </body>
</html>
```

We also won't go very in depth here. The above code creates a simple form that asks for a Username, Password, and Email address.![Registration](https://imgur.com/XlNKCMj.jpg) There is also a link at the bottom that will navigate to a login page,for users that are already registered, that we will create in a moment.

Now create a new file called `login.html`, and paste the following code in there:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="/css/main.css">
  </head>
  <body>
    <div id="loginForm">
      <form>
        <h2>Login</h2>
        <div>
            <div>
                <label for="username" >Username *</label>
                <input type="text" id="username" name="username" class="textInput" required>
            </div>
            <div>
                <label for="password" >Password *</label>
                <input type="password" id="password" name="password" class="textInput" required>
            </div>
        </div>
        <input id="loginButton" type="button" value="Login">
      </form>
      <div class="container">
        <a href="/">Not registered? Register here</a>
      </div>
    </div>
  </body>
</html>
```

Similar to the registration page, this creates a simple page that asks for a username and password.![Login](https://imgur.com/u4xyE4I.jpg) There is also a link at the bottom that will navigate back to the registration page - we used the shortcut `/` to navigate back to the index page.

If you were to test this now, the links would allow you to bounce back and forth between the registration and login pages, but the `Register` and `Login` buttons wouldn't do anything. Let's fix that!

## Create Registration and Login workflow using Sashido built-in functionality

Back in your `index.html` file paste the following code into your `<body>` section, below the last `</div>` tag: 

```html
<script src="https://npmcdn.com/parse/dist/parse.min.js"></script>
    <script src="index.js"></script>
    <script>
        document.getElementById("registerButton").addEventListener("click", function() {
            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;
            var email = document.getElementById('email').value;
            register(username, password, email);
        });
    </script>
```

Let's break this down:
* **Line 1** This line adds the [Parse SDK](https://docs.parseplatform.org/js/guide/) to our file. Parse is the Application Stack that Sashido uses and hosts - it's what provides all the great functionality that we'll be using. We need the SDK to communicate with Sashido.
* **Line 2** This line adds a Javascript file that we will create in a moment. In this file we will store all of our Javascript functions that we need. It's generally a good idea to separate HTML, CSS, and JS like this rather than to keep it all in one file.
* **Line 4** This line looks for the button on the Registration page (with the id "registerButton"), and attaches an onClick Event Listener. This means that when the button is clicked, it will run the function that has been specified.
* **Line 5** Gets the username from the form.
* **Line 6** Gets the password from the form.
* **Line 7** Gets the email from the form.
* **Line 8** Calls the `register` function that we will declare in `index.js` in a moment with the username, password, and email variables as parameters.

Now, create a file called `index.js` in your `public` folder. Copy the following code into it:

```js
Parse.initialize(
    "YOUR-APP-ID", // Application ID
    "YOUR-JS-KEY" // Javascript Key
  );
Parse.serverURL = 'YOUR-API-URL'; // API URL Address
```
You will need to navigate to your Sashido console. In the left hand menu, click on App Settings > Security & Keys. Find the relevant keys (API URL Address, Application ID, and JavaScript Key) and addresses and paste them in.

This code initialises the Parse library we imported earlier. 
* **Line 1-4** Sets your App ID and JS Key so that your app can authenticate with the Parse server on Sashido.
* **Line 5** Sets your App URL so that calls to the Parse library know where the Sashido Parse server is and thus where to make its HTTP calls to.

Next add the following function below the initialisation code you just added: 

```js
function register (username, password, email) {
    const customUser = new Parse.User();

    customUser.set("username", username);
    customUser.set("password", password);
    customUser.set("email", email);

    customUser.signUp()
        .then((result) => {
            console.info("New object was created successfully");
            window.location.href = 'customers.html'; 
        }).catch((error) => {
            console.error("Error message:", error.message);
            alert("There was a problem registering. See console for more info.")
        });
}
```

This adds the register function that we referred to earlier in `index.html`.
* **Line 1** Defines the function with its parameters.
* **Line 2** Creates a new Parse User object.
* **Line 4-6** Sets the username, password, and email parameters in the Parse User object.
* **Line 8** Calls the signUp function on the Parse User object. This will register the user, and create a new entry in the User table in your database. After registering a user, you can go to your User table in the Sashido dashboard (Core > Browser > User), and you'll see a new user entry.
* **Line 9** Gives a callback function that will be called when the user has been registered successfully.
* **Line 10** Logs a line to our console notifying us that registration was successful.
* **Line 11** Redirects the browser to a new page, `customers.html`, that we will create a little later.
* **Line 12** Gives a callback function that will be called if there are any problems with registering the new user.
* **Line 13** Logs a line to the console giving us more information about the error.
* **Line 14** Creates an alert dialog notifying us that there was a problem.

With this code in place you should now be able to register. However, because we redirect to `customers.html` which doesn't exist yet, you will get an error after registration completes successfully. 

With Parse, you are automatically logged in when you register, which means that once you register a new entry will be created in the Session table as well. After registering a user, you can go to your Session table in the Sashido dashboard (Core > Browser > Session), and you'll see a new session entry.

Next we need to complete the login logic. In your `login.html` file paste the following code into your `<body>` section, below the last `</div>` tag:

```html
    <script src="https://npmcdn.com/parse/dist/parse.min.js"></script>
    <script src="index.js"></script>
    <script>
        document.getElementById("loginButton").addEventListener("click", function() {
            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;
            login(username, password);
        });
    </script>
```
* **Line 1** This line adds the [Parse SDK](https://docs.parseplatform.org/js/guide/) to our file as before.
* **Line 2** This adds our `index.js` file.
* **Line 4** This line looks for the button on the Login page (with the id "loginButton"), and attaches an onClick Event Listener. This means that when the button is clicked, it will run the function that has been specified.
* **Line 5** Gets the username from the form.
* **Line 6** Gets the password from the form.
* **Line 7** Calls the `login` function that we will declare in `index.js` in a moment with the username, password variables as parameters.

Next go to `index.js` and add the following function:
```js
function login(username, password) {
    Parse.User.logIn(username, password)
        .then((result) => {
            console.info("User loged in successfully");
            window.location.href = 'customers.html'; 
        }).catch((error) => {
            console.error("Error message:", error.message);
            alert("There was a problem logging in. See console for more info.")
        });
}
```
This adds the login function that we need in `login.html`.
* **Line 1** Defines the login function with username and password parameters.
* **Line 2** Calls the Parse login function with the username and password specified.
* **Line 3** Gives a callback function that will be called when the user has been successfully logged in.
* **Line 4** Logs a line to the console notifying us that login was successful.
* **Line 5** Redirects the browser to a new page, `customers.html`, that we will create a little later.
* **Line 6** Gives a callback function that will be called if there are any problems logging in.
* **Line 7** Logs a line to give us more information about the error.
* **Line 8** Creates an alert dialog notifying us that there was a problem.

With this in place you can now log in with a registered user. However, because we redirect to `customers.html` which doesn't exist yet, you will receive an error when logging in successfully for now. Logging in will create a new entry in the Session table. After logging in, you can go to your Session table in the Sashido dashboard (Core > Browser > Session), and you'll see a new session entry.

## Capture names, phone numbers, and addresses
The point of our app is to capture customer details, so let's get to that.

Before we can capture Customer details, we need a new class in Sashido.

Go to your Sashido dashboard. On the left side menu, navigate to Core > Browser. Click on `Create a class`. In the popup, choose Custom for the type, and then name it `Customer`. Click `Create Class`.

Create a new file in your `public` directory called `customers.html` and add the following code to it:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="/css/main.css">
  </head>
  <body>
    <div>
      <button id="showCreateButton" type="button" onclick="showCreateForm()">Create</button>
      <button id="showUpdateButton" type="button" onclick="showGetForm()">Update/Delete</button>
    </div>

    <div id="createForm" style="display: none;">
      <form>
        <h2>Create Customer</h2>
        <div>
          <label for="name" >Customer name *</label>
          <input type="text" id="name" name="name" class="textInput" placeholder="John Smith" required>
        </div>

        <div>
          <label for="address" >Customer address *</label>
          <input type="text" id="address" name="address" class="textInput" placeholder="42 Wallaby Way, Sydney" required>
        </div>

        <div>
          <label for="telephone" >Customer telephone *</label>
          <input type="text" id="telephone" name="telephone" class="textInput" placeholder="+275554202" required>
        </div>

        <div>
          <label for="note" >Customer note</label>
          <input type="text" id="note" name="note" class="textInput" placeholder="">
        </div>
        <input id="createCustomerButton" type="button" value="Submit">
      </form>
    </div>

    <div id="getForm" style="display: none;">
      <form>
        <h2>Get Customer</h2>
        <div>
          <label for="getName" >Customer name *</label>
          <input type="text" id="getName" name="getName" class="textInput" placeholder="John Smith" required>
        </div>
        <input id="getCustomerButton" type="button" value="Get customer">
      </form>
    </div>

    <script src="https://npmcdn.com/parse/dist/parse.min.js"></script>
    <script src="index.js"></script>
    <script>      
      document.getElementById("createCustomerButton").addEventListener("click", function() {
        var name = document.getElementById('name').value;
        var address = document.getElementById('address').value;
        var telephone = document.getElementById('telephone').value;
        var note = document.getElementById('note').value;
        createCustomer(name, address, telephone, note);
      });

      document.getElementById("getCustomerButton").addEventListener("click", function() {
        var name = document.getElementById('getName').value;
        getCustomer(name);
      });
  </script>
  </body>
</html>
```

There's quite a lot going on here. This creates a page that initially only has 2 buttons on it. Clicking either button reveals a different form - 1 form for creating a customer ![Create Customer](https://imgur.com/ragECju.jpg), and another for fetching a customer to update.

At the bottom are `<script>` tags that should look familiar by now. These add the Parse library and our own `index.js` file, and then go on to attach onClick Event Listeners to the form buttons that call functions that we will define in `index.js`.

Go to `index.js` and add the following code:
```js
function showCreateForm() {
  document.getElementById("getForm").style.display="none";
  document.getElementById("createForm").style.display="block";
}

function showGetForm() {
  document.getElementById("getForm").style.display="block";
  document.getElementById("createForm").style.display="none";
}

function createCustomer(name, address, telephone, note) {
    const CustomerObject = Parse.Object.extend("Customer");

    const customer = new CustomerObject();
    customer.set("name", name);
    customer.set("address", address);
    customer.set("telephone", telephone);
    customer.set("note", note);

    customer.save()
        .then((result) => {
            // Execute any logic that should take place after the object is saved.
            alert("Customer was successfully created.")
            clearCreateForm();
            console.info("New object was created with objectId:", result.id);
            return 'ok'
        }).catch((error) => {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert("There was a problem creating the customer. See the log output for more information.")
            console.error("Error message:", error.message);
            return 'error'
        });
}

function clearCreateForm() {
    document.getElementById("name").value = "";
    document.getElementById("address").value = "";
    document.getElementById("telephone").value = "";
    document.getElementById("note").value = "";
}
```
* **Line 1** Defines a function that shows the Create Customer form.
* **Line 2** Hides the form that fetches a created customer for updating.
* **Line 3** Shows the Create Customer form.
* **Line 6** Defines a function that shows the Get Customer form.
* **Line 7** Shows the Get Customer form.
* **Line 8** Hides the Create Customer form.
* **Line 11** Defines a function to create a new customer with name, address, telephone and note as parameters.
* **Line 12** Extends a Customer object based on the Customer Class we created earlier on the Sashido Dashboard.
* **Line 14** Creates a new Customer object.
* **Line 15-18** Sets the name, address, telephone, and note parameters in the Customer object.
* **Line 20** Saves the customer object.
* **Line 21** Defines a callback function that will be called when the customer has been saved successfully.
* **Line 22** Creates an alert dialog notifying us that the customer was successfully created.
* **Line 23** Calls the `clearCreateForm` function.
* **Line 24** Prints a message to the console to notify us that the customer was created successfully.
* **Line 25** Returns the string 'ok'.
* **Line 26** Defines a callback function that will be called if there was an error when creating a customer.
* **Line 27** Creates an alert dialog notify us that there was a problem creating the customer.
* **Line 28** Prints a message to the console to notify us what has gone wrong.
* **Line 29** Returns the string 'error'.
* **Line 33** Defines a function that will clear the Customer Create form.
* **Line 34** Clears the name field.
* **Line 35** Clears the address field.
* **Line 36** Clears the telephone number field.
* **Line 37** Clears the note field.

With this code in place now, you should be able to Register, Log In, and capture Customer details.

## Update and Delete clients using the [REST API](https://docs.parseplatform.org/rest/guide/#objects)
The next thing we need to do is fetch clients so that we can update them with new information, or delete them if we want to.

In `customers.html` add the following code below your `getForm` div.

```html
<div id="updateForm" style="display: none;">
    <form>
        <h2>Update Customer</h2>
        <div>
          <label for="updateName" >Customer name *</label>
          <input type="text" id="updateName" name="updateName" class="textInput" placeholder="John Smith" required>
        </div>

        <div>
          <label for="updateAddress" >Customer address *</label>
          <input type="text" id="updateAddress" name="updateAddress" class="textInput" placeholder="42 Wallaby Way, Sydney" required>
        </div>

        <div>
          <label for="updateTelephone" >Customer telephone *</label>
          <input type="text" id="updateTelephone" name="updateTelephone" class="textInput" placeholder="+275554202" required>
        </div>

        <div>
          <label for="updateNote" >Customer note</label>
          <input type="text" id="updateNote" name="updateNote" class="textInput" placeholder="">
        </div>
        <input type="hidden" id="updateId">
        <div>
          <input id="updateCustomerButton" type="button" value="Update">
          <input id="deleteCustomerButton" type="button" class="delete" value="Delete">
        </div>  
      </form>
    </div>
```

This creates a form that looks almost identical to the Create Customer form, but with 2 buttons - one to Update and one to Delete.

Now add the following code in your `<script>` tag:

```js
    document.getElementById("updateCustomerButton").addEventListener("click", function() {
        var id = document.getElementById('updateId').value;
        var name = document.getElementById('updateName').value;
        var address = document.getElementById('updateAddress').value;
        var telephone = document.getElementById('updateTelephone').value;
        var note = document.getElementById('updateNote').value;
        updateCustomer(id, name, address, telephone, note);
      });

    document.getElementById("deleteCustomerButton").addEventListener("click", function() {
        var id = document.getElementById('updateId').value;
        deleteCustomer(id);
      });
```

This adds 2 click event listeners - one for the Update button, the other for the Delete button.

* **Line 1** Adds the click event listener for the Update button.
* **Line 2** Gets the id of the customer that's being updated. This will be passed back from Sashido when we get the customer and we save it in a hidden field in the update form.
* **Line 3** Gets the updated name.
* **Line 4** Gets the updated address.
* **Line 5** Gets the updated telephone number.
* **Line 6** Gets the updated note/
* **Line 7** Calls the `updateCustomer` function that we will write in a moment. This will use the id to find the correct customer and update the details.
* **Line 10** Adds the click event listener for the delete button.
* **Line 11** Gets the id of the customer that will be deleted.
* **Line 12** Calls the `deleteCustomer` function that we will write in a moment. This will use the id to find the correct customer to delete.

Now head over to `index.js`. The first thing we want to do is add this line to both `showCreateForm` and `showGetForm`:

```js
    document.getElementById("updateForm").style.display="none";
```

This will hide the Update form when we click on the `Create` or `Update/Delete` buttons.

Now, add the following functions:

```js
function getCustomer(name) {
    const CustomerObject = Parse.Object.extend("Customer");

    const query = new Parse.Query(CustomerObject);
    query.equalTo("name", name);

    query.find()
    .then((results) => {
        console.info("Query results:", results);
        document.getElementById("getForm").style.display="none";
        document.getElementById("createForm").style.display="none";
        document.getElementById("updateForm").style.display="block";
        
        document.getElementById("updateId").value = results[0].id;
        document.getElementById("updateName").value = results[0].get("name");
        document.getElementById("updateAddress").value = results[0].get("address");
        document.getElementById("updateTelephone").value = results[0].get("telephone");
        document.getElementById("updateNote").value = results[0].get("note");
        clearGetForm();
    }).catch((error) => {
        console.error("Error message:", error.message);
    });
}

function updateCustomer(id, name, address, telephone, note) {
    const CustomerObject = Parse.Object.extend("Customer");

    var customer = new CustomerObject();
    customer.id = id;
    customer.set("name", name);
    customer.set("address", address);
    customer.set("telephone", telephone);
    customer.set("note", note);

    customer.save()
        .then((result) => {
            alert("Customer was successfully updated.")
            console.info("Object was updated with objectId:", result.id);
        }).catch((error) => {
            alert("There was a problem updating the customer. See console for more info.")
            console.error("Error message:", error.message);
        });
}

function deleteCustomer(id) {
    const CustomerObject = Parse.Object.extend("Customer");

    var customer = new CustomerObject();
    customer.id = id;

    customer.destroy().then((result) => {
        alert("Customer was successfully deleted.");
        clearUpdateForm();
      }, (error) => {
        alert("There was a problem deleting the customer. See console for more info.")
        console.error("Error message:", error.message);
      });
}

function clearGetForm() {
    document.getElementById("getName").value = "";
}

function clearUpdateForm() {
    document.getElementById("updateId").value = "";
    document.getElementById("updateName").value = "";
    document.getElementById("updateAddress").value = "";
    document.getElementById("updateTelephone").value = "";
    document.getElementById("updateNote").value = "";
}
```
This adds in the `getCustomer`, `updateCustomer` and `deleteCustomer` functions that we called in `customers.html`. There's a lot going on here, so let's dive in.

* **Line 1** Defines the getCustomer function.
* **Line 2** Extends the Customer object.
* **Line 4** Creates a new Query on the Customer object.
* **Line 5** Filters the query to look for customers with the name that was passed in as a parameter.
* **Line 7** Executes the query.
* **Line 8** Defines a callback function for if the query succeeds.
* **Line 9** Logs the result of the query to the console.
* **Line 10** Hides the Get Customer form.
* **Line 11** Hides the Create Customer form.
* **Line 12** Shows the update form.
* **Line 14** Populates the hidden id field with the ID from the query result.
* **Line 15** Populates the updateName value with the name result from the query.
* **Line 16** Populates the updateAddress value with the address result from the query.
* **Line 17** Populates the updateTelephone value with the telephone result from the query.
* **Line 18** Populates the updateNote value with the note result from the query.
* **Line 19** Calls the `clearGetForm` function.
* **Line 20** Defines a callback function for if the query function has an error.
* **Line 21** Logs the error message to the console.

* **Line 25** Defines the `updateCustomer` function  with its parameters.
* **Line 26** Extends the Customer object.
* **Line 28** Creates a new customer object.
* **Line 29** Sets the customer id to the id that was passed to the function.
* **Line 30** Sets the customer name.
* **Line 31** Sets the customer address.
* **Line 32** Sets the customer telephone.
* **Line 33** Sets the customer note.
* **Line 35** Saves the customer.
* **Line 36** Defines a callback function for if the save function succeeds.
* **Line 37** Displays an alert notifying us that the customer has been updated successfully.
* **Line 38** Logs a console message telling us that the save action has succeeded.
* **Line 39** Defines a callback function for if the save function has an error.
* **Line 40** Displays an alert notifying us that something has gone wrong with the update.
* **Line 41** Logs a message to the console giving us details about the error.

* **Line 45** Extends the customer object.
* **Line 47** Creates a new customer object.
* **Line 48** Sets the id of the customer object the id of that was passed to the function
* **Line 50** Calls the destroy function which deletes the customer with the given id, then defines a callback function that will be called if destroy succeeds.
* **Line 51** Displays an alert notifying us that the delete has succeeded.
* **Line 52** Calls the `clearUpdateForm` function.
* **Line 53** Defines a callback function for if the destroy function has an error.
* **Line 54** Logs a message to the console giving us details about the error.

* **Line 58** Defines the `clearGetForm` function.
* **Line 59** Clears the `getName` field.

* **Line 62** Defines the `clearUpdateForm` function.
* **Line 63** Clears the `updateId` field.
* **Line 64** Clears the `updateName` field.
* **Line 65** Clears the `updateAddress` field.
* **Line 66** Clears the `updateTelephone` field.
* **Line 67** Clears the `updateNote` field.

With all of this now in place you should have a working mini-CRM where you can make a new account, log in, create, update, and delete customers.

## Use [LocationIQ](https://locationiq.com/) to get geocodes from addresses using Triggers

We now want to do something a bit more advanced. Sashido has an easy-to-use GeoQuery that allows us to find all specified objects within a certain radius of a point. This means that with a simple query, we can find all customers from a given address. However, in order for this to work, we need the latitude and longitude for each of the customers we add. Instead of doing that manually per customer, we are going to use the LocationIQ API to find a customer's latitude and longitude using the address.

Before we get to any code we need to do some setup. Head over to your Sashido dashboard and click on `Runtime > Environment Variables` in the left sidebar. Scroll to the bottom and click `Add Environment Variable`. In the left `Name` field, put 'LOCATION_IQ_KEY' and put your LocationIQ Access Token (that you created at the beginning of this tutorial) in the `Value` field.

Click `Add Environment Variable` again and add `LOCATION_IQ_URL` as the `Name` and `https://us1.locationiq.com/v1/search.php?` as the `Value`.

Now click `Save and Deploy` in the bottom right.

Now head over to your code. Basically what we want to do is this: when a new customer is saved, we want to ask LocationIQ what the latitude and longitude of the customers address is, and save that to the customer object. Sashido and Parse make this quite easy for us. They provide what they call "Triggers", specifically the "BeforeSave Trigger". Essentially this is a piece of code that runs before something is saved to the database. 

Add the following code to your `functions.js` file in your `cloud` folder:

```js
Parse.Cloud.beforeSave('Customer', async (req) => {
    const request = require('request-promise')
    const querystring = require('querystring')
    
    const address = req.object.get('address');
    const urlOptions = {
        key: process.env.LOCATION_IQ_KEY,
        q: address,
        format: 'json'
    }

    const url = process.env.LOCATION_IQ_URL + querystring.encode(urlOptions)
    const reqOptions = {
        method: 'GET',
        uri: url,
        json: true
    }
    let body = await request(reqOptions)
    const point = new Parse.GeoPoint(parseFloat(body[0].lat), parseFloat(body[0].lon))
    req.object.set('location', point)    
  });
```

Here's what's happening:
* **Line 1** Defines the beforeSave trigger for a `Customer` object, and provides a callback function. This means that this beforeSave function will run before a new customer is saved to the database. The `req` object in the callback is the Customer object that has been sent up in the request.
* **Line 2** Loads the `request-promise` module. This module allows us to easily make HTTP requests and lets us work with JavaScript Promises.
* **Line 3** Loads the `querystring` module. We'll use this module to encode our url options for our request to LocationIQ.
* **Line 5** Gets the address field from our incoming request object.
* **Line 6 - 10** Defines our url options for request url to LocationIQ. The `key` field is the LocationIQ Access Token that we saved to our environment variable. We specify the `format` field to be `json` so that the LocationIQ API gives us a response in json.
* **Line 12** Concatenates our URL using the url that we saved to our environment variable and the the encoded url options.
* **Line 13 - 17** Defines our request options for the request we will make to LocationIQ. We specify the method the be an HTTP GET and provide it with the url that we concatenated.
* **Line 18** Makes the request and waits for the response from LocationIQ.
* **Line 19** Creates a new parse GeoPoint object using the latitude and longitude that was returned from LocationIQ. Notice that we have to use `parseFloat` as the coordinates are returned as strings and the GeoPoint object expects floats. Note that LocationIQ could return multiple locations, and we're just taking the first one. It's also possible that we might get none back, at which point this line will throw an error and our object won't have a geopoint attached to it.
* **Line 20** Sets the `location` attribute on the request object (the incoming Customer object) to be the GeoPoint that we just made.

If you save this, push it up and wait for it to deploy to Sashido, you will find that when you now create a Customer a new field should appear in your database called `location` which will have a `latitude` and `longitude`. We need it in this format so that the GeoQuery we're about to use works on Customer objects.

## Use Sashido GeoQueries to find all clients in a particular radius from a given address
One problem that we have now is that the GeoQuery we want to use expects us to give it a GeoPoint as will (i.e. it expects a latitude and longitude). However, we want to use a more friendly street address. 

Not to worry, because we can use a Sashido Cloud Function to make a call to LocationIQ to once again convert the address to latitude/longitude coordinates.

Add the following code in your `cloud/function.js` file:

```js
Parse.Cloud.define('getLatLon', async (req) => {
    const request = require('request-promise')
    const querystring = require('querystring')
    
    const address = req.params.address
    const urlOptions = {
        key: process.env.LOCATION_IQ_KEY,
        q: address,
        format: 'json'
    }

    const url = process.env.LOCATION_IQ_URL + querystring.encode(urlOptions)
    const reqOptions = {
        method: 'GET',
        uri: url,
        json: true
    }
    let body = await request(reqOptions)

    return {lat: parseFloat(body[0].lat), lon: parseFloat(body[0].lon)}
})
```

This is almost identical to the previous function we defined in here, except for the first and last line. The first line defines a new Cloud Function with a name `getLatLon`. Instead of this function being triggered for us, we can directly call this function and get the result. The last line returns the latitude and longitude.

We now want to use a GeoQuery, but we need to give it some information. This calls for another input form!

In your `customers.html` add the following code underneath your Create and Update buttons:

```html
<div>
  <a id="getCustomersInRadius" href="/geoquery.html">Get Customers in Radius</a>
</div>
```
This makes a new link on the page that will take you to the geoquery page.

Make a new file in your `public` folder called `geoquery.html` and paste the following into it:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" type="text/css" href="/css/main.css">
    </head>
    <body>
    <div id="getForm">
        <form>
            <h2>Get Customers in Radius</h2>
                <div>
                    <label for="address" >Customer address *</label>
                    <input type="text" id="address" name="address" class="textInput" required>
                </div>
                <div>
                    <label for="radius" >Radius (in km) *</label>
                    <input type="text" id="radius" name="radius" class="textInput" required>
                </div>
            <input id="getCustomersButton" type="button" value="Get customers in Radius">
        </form>
    </div>

    <div>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Telephone</th>
                    <th>Note</th>
                </tr>
            </thead>
            <tbody id="customerList">

            </tbody>

        </table>

    </div>


    <script src="https://npmcdn.com/parse/dist/parse.min.js"></script>
    <script src="index.js"></script>
    <script>
        document.getElementById("getCustomersButton").addEventListener("click", function() {
        var address = document.getElementById('address').value;
        var radius = document.getElementById('radius').value;
        showCustomersInRadius(address, radius);
      });
    </script>
    </body>
</html>
```

This makes a new form that takes an address and a radius. When the button is clicked, it calls the `showCustomersInRadius` (which we will define shortly) function with the address and radius as parameters.![GeoQuery](https://imgur.com/Sr1DAEh.jpg)

Add the following code in your `index.js` file:

```js
async function getLatLon(address) {
    const params =  { address: address }
    const latLon = await Parse.Cloud.run("getLatLon", params)
    return latLon
}
```
* **Line 1** Defines a new function called `getLatLon` that accepts an address as a parameter.
* **Line 2** Puts the address parameter in an object. 
* **Line 3** Calls our `getLatLon` Cloud Function with the address parameter and waits for the result.
* **Line 4** Returns the result.

Now add the following function below the above function in your `index.js` file:
```js
function showCustomersInRadius(address, distance) {
    getLatLon(address).then( (result) => {
        const location = new Parse.GeoPoint({ latitude: result.lat, longitude: result.lon })

        const query = new Parse.Query("Customer")
        query.withinKilometers("location", location, distance)

        query.find().then((results) => {
                let customerList = document.getElementById("customerList")
                var new_tbody = document.createElement('tbody')
                new_tbody.setAttribute("id", "customerList")
                for (result of results) {
                    let tr = new_tbody.insertRow()
                    let name = tr.insertCell()
                    name.appendChild(document.createTextNode(result.get('name')))
                    let address = tr.insertCell()
                    address.appendChild(document.createTextNode(result.get('address')))
                    let telephone = tr.insertCell()
                    telephone.appendChild(document.createTextNode(result.get('telephone')))
                    let note = tr.insertCell()
                    note.appendChild(document.createTextNode(result.get('note')))
                }
                customerList.parentNode.replaceChild(new_tbody, customerList)
            }).catch((error) => {
                console.error("Error message:", error.message)
            })
    } )
}
```
* **Line 1** Defines a function called `showCustomersInRadius` that takes an address and distance (in km) as parameters.
* **Line 2** Calls the `getLatLon` function we defined above with the address, and defines a callback with the result from that function. We have to do this, because `getLatLon` is defined as an async function.
* **Line 3** Creates a new Parse GeoPoint with the latitude and longitude from our `getLatLon` function.
* **Line 5** Makes a new Customer Query object.
* **Line 6** Queries the Customer object with the location and distance. This is the magic function that asks our database for all the customers in a radius from our given location.
* **Line 8** Executes the query and defines a callback function with the results from the query. The results will be a list of customers.
* **Line 9** Gets the element in our html with id `customerList`. This is the body element of our table.
* **Line 10** Creates a new `tbody` element.
* **Line 11** Gives the new `tbody` element the id `customerList`. This might now seem strange, but what we are going to do is add the customers to this new `tbody` element, and then replace the one currently on the page with the new one. This is to "refresh" the list if we make a new request, otherwise we end up adding more elements to the table over and over again.
* **Line 12** Loops over our results list.
* **Line 13** Inserts a new row into our new `tbody` element.
* **Line 14** Inserts a new cell into our new row for the name.
* **Line 15** Adds the name attribute from our current result object to the name cell.
* **Line 16** Inserts a new cell into our new row for the address.
* **Line 17** Adds the address attribute from our current result object to the address cell.
* **Line 18** Inserts a new cell into our new row for the telephone.
* **Line 19** Adds the telephone attribute from our current result object to the telephone cell.
* **Line 20** Inserts a new cell into our new row for the note.
* **Line 21** Adds the note attribute from our current result object to the note cell.
* **Line 23** Replaces the old `tbody` with the new one.
* **Line 24-26** Catches and logs out any errors that might have happened.

## Conclusion
If you now push all the code and wait for it to deploy to Sashido, you will be able to: Register, Login, Create, Update and Delete  Customers, and query for Customers in a radius of a given address, which will then display in a list. That's a lot of functionality, but it wasn't that hard to add it all to our app thanks to Sashido having it all mostly built in.

There's plenty to do here, though. The UI is fairly rudimentary, and there's never anything that tells us there's an operation in progress.

Also, if our beforeSave trigger doesn't get a location from LocationIQ for whatever reason, the Customer object simply won't have a location.

We also haven't implemented a password reset feature, so if you forget your password, you're locked out. Sashido has this built in as well, so adding it shouldn't be too hard if you're looking for a small addition to start with.