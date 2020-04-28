# Building a CRM app with NodeJS, Repl.it, and MongoDB

In this tutorial we'll use NodeJS on Repl.it, along with a MongoDB database to build a basic [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) (Create, Read, Update, Delete) [CRM](https://en.wikipedia.org/wiki/Customer_relationship_management) (Customer Relationship Management) application. A CRM lets you store information about customers to help you track the status of every customer relationship. This can help businesses keep track of their clients and ultimately increase sales. The application will be able to store and edit customer details, as well as keep notes about them.

This tutorial won't be covering the basics of Node.js, but each line of code will be explained in detail.

## Setting up
All of the code will be written and hosted in Repl.it, so you won't need to install any additional software on your computer.

For setup, we'll be walking you through the following steps. Skip any that don't apply to you (e.g. if you already have a Repl.it account, you don't have to make a new one).

* Creating an account on [Repl.it](https://repl.it/)
* Creating an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Creating an account on Repl.it
The first thing you need to do is create an account on Repl.it. You can find instructions on how to do so [here](https://www.codementor.io/garethdwyer/building-a-discord-bot-with-node-js-and-repl-it-mm46r1u8y#creating-an-account-on-replit). Once you're done, head back here and continue the tutorial.

### Creating an account on MongoDB Atlas
MongoDB Atlas is a fully managed Database-as-a-Service. It provides a document database (often referred to as NoSQL), as opposed to a more traditional relational database like PostgreSQL.

Head over to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and hit the "Start free" button.

After signing up, under "Starter Clusters", press the "Create a Cluster" button.

You now have to select a provider and a region. For the purposes of this tutorial we chose Google Cloud Platform as the provider and Iowa (us-central1) as the region, although it should work regardless of the provider and region. ![Cluster Region](https://imgur.com/fHZDo7I.png)

Under "Cluster Name" you can change the name of your cluster. Note that you can only change the name now - it can't be changed once the cluster is created. After you've done that, click "Create Cluster". ![Cluster Name](https://imgur.com/fqvBpGQ)

After a bit of time, your cluster will be created. Once it's available, click on “Database Access” under the Security heading in the left-hand column and then click "Add New User" to create a new database user. You need a database user to actually store and retrieve data. Enter a username and password for the user and make a note of those details - you'll need them later. Select “Read and write to any database” as the user privilege.

Next, you need to allow network access to the database. Click on "Network Access" in the left-hand column, and “Add an IP Address”. Because we won't have a static IP from Repl.it, we're just going to allow access from anywhere - don't worry, the database is still secured with the username and password you created earlier. In the popup, click "Allow Access From Anywhere". ![Allow Access From Anywhere](https://imgur.com/YUoVxHk.png)

Navigate back to "Clusters", click on "Connect" and select “Connect Your Application”. Copy the Connection String as you will need it shortly to connect to your database from Repl.it. Ours looked like this: `mongodb+srv://<username>:<password>@cluster0-zrtwi.gcp.mongodb.net/test?retryWrites=true&w=majority`

## Creating a Repl and connecting to our Database
First, we need to create a new Node.js Repl to write the code necessary to connect to our shiny new Database. On Repl.it, create a new Repl and select "Node.js" as the language.

A great thing about Repl is that it makes projects public by default. This makes it easy to share and is great for collaboration and learning, but we have to be careful not to make our database credentials available on the open Internet.

To solve this problem we'll be using `environment variables`. We'll create a special file that Repl.it recognizes and keeps private for you, and in that file we declare variables that become part of our Repl.it development environment and are accessible in our code.

Select your Repl by clicking “My Repls” in the left-hand pane, followed by clicking on the Repl’s name. Now create a file called `.env` by selecting “Files” in the left-hand pane and then clicking the “Add File” button. Note that the spelling has to be exact or the file will not be recognized. Add your MongoDB database username and password (not your login details to MongoDB Atlas) into the file in the below format:

```
MONGO_USERNAME=username
MONGO_PASSWORD=password
```

* Replace `username` and `password` with your database username and password
* **Spacing matters**. Make sure that you don't add any spaces before or after the `=` sign

Now that we have credentials set up for the database, we can move on to connecting to it in our code.

MongoDB is kind enough to provide a client that we can use. To test out our database connection, we're going to insert some customer data into our database. In your `index.js` file (created automatically and found under the Files pane), add the following code:

```
const MongoClient = require('mongodb').MongoClient;
const mongo_username = process.env.MONGO_USERNAME
const mongo_password = process.env.MONGO_PASSWORD

const uri = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0-zrtwi.gcp.mongodb.net/crmdb?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });
```
Here's what's going on:

* **Line 1** adds the dependency for the MongoDB Client. Repl.it makes things easy by installing all the dependencies for us, so we don't have to use something like npm to do it manually.
* **Line 2 & 3** we retrieve our MongoDB username and password from the environment variables that we set up earlier.
* **Line 5** has a few very important details that we need to get right.
  * replace the section between the `@` and the next `/` with the same section of your connection string from MongoDB that we copied earlier. You may notice the `${mongo_username}` and `${mongo_password}` before and after the colon near the beginning of the string. These are called Template Literals. Template Literals allow us to put variables in a string, which Node.js will then helpfully replace with the actual values of the variables.
  * Note `crmdb` after the `/` and before the `?`. This will be the name of the database that we will be using. MongoDB creates the database if it doesn't exist for us. You can change this to whatever you want to name the database, but remember what you changed it to for future sections of this tutorial.
* **Line 6** creates the client that we will use to connect to the database.

## Making a user interface to insert customer data
We're going to make an HTML form that will capture the customer data, send it to our Repl.it code, which will then insert it into our database.

In order to actually present and handle an HTML form, we need a way to process HTTP GET and POST requests. The easiest way to do this is to use a web application framework. A web application framework is designed to support the development of web applications - it gives you a standard way to build your application and lets you get to building your application fast without having to do the boilerplate code.

A really simple and flexible Node.js web application framework is [Express](https://expressjs.com/). Express is a fast and flexible web application framework that provides a robust set of features for the development of web applications.

The first thing we need to do is add the dependencies we need. Right at the top of your index.js file, add the following lines:
```
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let http = require('http').Server(app);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
```
Let's break this down.

* **Line 1** adds the dependency for Express. Repl.it will take care of installing it for us.
* **Line 2** creates a new Express app that will be needed to handle incoming requests.
* **Line 3** adds a dependency for 'body-parser'. This is needed for the Express server to be able to handle the data that the form will send, and give it to us in a useful way in code.
* **Line 4** adds a dependency for a basic HTTP server.
* **Line 6 & 7** tell the Express app which parsers to use on incoming data. This is needed to handle form data.

Next, we need to add a way for the Express to handle an incoming request and give us the form that we want. Add the following lines of code below your dependencies:
```
app.get('/', function (req, res) {
  res.sendFile('/index.html', {root:'.'});
});

app.get('/create', function (req, res) {
  res.sendFile('/create.html', {root:'.'});
});
```
* `app.get` tells Express that we want it to handle a GET request.
* `'/'` tells Express that it should respond to GET requests sent to the root URL. A root URL looks something like 'https://crm.hawkiesza.repl.co' - note that there are no slashes after the URL.
* `'/create'` tells Express that it should respond to GET requests to /create after the root URL i.e. 'https://crm.hawkiesza.repl.co/create'
* `res.sendFile` tells Express to send the given file as a response.

Before the server will start receiving requests and sending responses, we need to tell it to run. Add the following code below the previous line.
```
app.set('port', process.env.PORT || 5000);
http.listen(app.get('port'), function() {
    console.log('listening on port', app.get('port'));
});
```

* **Line 1** tells Express to set the port number to either a number defined as an environment variable, or 5000 if no definition was made.
* **Line 2-4** tells the server to start listening for requests.

Now we have an Express server listening for requests, but we haven't yet built the form that it needs to send back if it receives a request.

Make a new file called `index.html` and paste the following code into it:
```
<!DOCTYPE html>
<html>
<body>
<form action="/create" method="GET">
  <input type="submit" value="Create">
</form>

</body>
</html>
```
This is just a simple bit of HTML that puts a single button on the page. When this button is clicked it sends a GET request to `/create`, which the server will then respond to according to the code that we wrote above - in our case it will send back the `create.html` file which we will define now.

Make a new file called `create.html` and paste the following into it:
```
<!DOCTYPE html>
<html>
<body>

<h2>Customer details</h2>

<form action="/create" method="POST">
  <label for="name" >Customer name *</label><br>
  <input type="text" id="name" name="name" class="textInput" placeholder="John Smith" required>
  <br>
  <label for="address" >Customer address *</label><br>
  <input type="text" name="address" class="textInput" placeholder="42 Wallaby Way, Sydney" required>
  <br>
  <label for="telephone" >Customer telephone *</label><br>
  <input type="text" name="telephone" class="textInput" placeholder="+275554202" required>
  <br>
  <label for="note" >Customer note</label><br>
  <input type="text" name="note" class="textInput" placeholder="Needs a new pair of shoes">
  <br><br>
  <input type="submit" value="Submit">
</form>

</body>
</html>
```
We won't go in depth into the above HTML. It is a very basic form with 4 fields (name, address, telephone, note) and a Submit button, which creates an interface that will look like the one below.

![Customer Details](https://imgur.com/Y1IIDq6.png)

When the user presses the submit button a POST request is made to `/create` with the data in the form - we still have to handle this request in our code as we're currently only handling a GET request to `/`.

If you now start up your application (click the “run” button)  a new window should appear on the right that displays your form. You can also navigate to `https://<repl_name>.<your_username>.repl.co` (replace <repl_name> with whatever you named your Repl (but with no underscores or spaces) and  <your_username> with your Repl username) to see the form. You will be able to see this URL in your Repl itself.

If you fill in the form and click submit, you'll get a response back that says ```Cannot POST /create```. We haven't added the code that handles the form POST request, so let's do that. Add the following code into your `index.js` file, below the `app.get` entry that we made above.
```
app.post('/create', function (req, res, next) {
  client.connect(err => {
    const customers = client.db("crmdb").collection("customers");

    let customer = { name: req.body.name, address: req.body.address, telephone: req.body.telephone, note: req.body.note };
    customers.insertOne(customer, function(err, res) {
      if (err) throw err;
      console.log("1 customer inserted");
    });
  })
  res.send('Customer created');
})
```
* **Line 1** defines a new route that listens for an HTTP 'POST' request at `/create`.
* **Line 2** connects to the database. This happens asynchronously, so we define a callback function that will be called once the connection is done.
* **Line 3** creates a new collection of customers. Collections in MongoDB are similar to Tables in SQL.
* **Line 5** defines customer data that will be inserted into the collection. This is taken from the incoming request. The form data is parsed using the parsers that we defined earlier and is then placed in the `req.body` variable for us to use in the code.
* **Line 6** inserts the customer data into the collection. This also happens asynchronously, and so we define another callback function that will get an error if an error occurred, or the response if everything happened successfully.
* **Line 7** throws an error if the above insert had a problem.
* **Line 8** gives us some feedback that the insert happened successfully.

If you now fill in the form and click submit, you'll get a message back that says "Customer created". If you then go and look in your MongoDB collection, you'll see a document has been created with the details that we submitted in the form.

## Updating and deleting database entries
As a final step in this tutorial, we want to be able to update and delete database documents in our collection. To make things simpler we're going to make a new HTML page where we can request a document and then update or delete it.

First, let's make the routes to our new page. In your `index.js`, add the following code below the rest of your routing code:
```
app.get('/get', function (req, res) {
  res.sendFile('/get.html', {root:'.'});
});

app.get('/get-client', function (req, res) {
    client.connect(err => {
        client.db("crmdb").collection("customers").findOne({name: req.query.name}, function(err, result) {
          if (err) throw err;
          res.render('update', {oldname: result.name, oldaddress: result.address, oldtelephone: result.telephone, oldnote: result.note, name: result.name, address: result.address, telephone: result.telephone, note: result.note});
        });
      });
});
```
* **Line 1-3** as before, this tells Express to respond to incoming GET requests on `/get` by sending the `get.html` file which we will define below.
* **Line 5-12** this tells Express to respond to incoming GET requests on `/get-client`.
  * **Line 7** makes a call to the database to fetch a customer by name. If there are more than 1 with the same name, then the first one found will be returned.
  * **Line 9** tells Express to render the `update` template, replacing variables with the given values as it goes. Important to note here is that we are also replacing values in the hidden form fields we created earlier with the current values of the customer details. This is to ensure that we update or delete the correct customer.

In your `index.html` file, add the following code after the `</form>` tag:
```
<br>
<form action="/get" method="GET">
  <input type="submit" value="Update/Delete">
</form>
```
This adds a new button that will make a GET request to `/get`, which will then return `get.html`. ![Index](https://imgur.com/CHymS42.png)

Make a new file called `get.html` with the following contents:
```
<!DOCTYPE html>
<html>
<body>
  <form action="/get-client" method="GET">
    <label for="name" >Customer name *</label><br>
    <input type="text" id="name" name="name" class="textInput" placeholder="John Smith" required>
    <input type="submit" value="Get customer">
  </form>
</body>
</html>
```
This makes a simple form with an input for the customer's name and a button. ![Get Customer](https://imgur.com/Pnji1Nl.png)

Clicking this button will then make a GET call to `/get-client` which will respond with the client details where we will be able to update or delete them.

To actually see the customer details on a form after requesting them, we need a templating engine to render them onto the HTML page and send the rendered page back to us. With a templating engine, you define a template - a page with variables in it - and then give it the values you want to fill into the variables. In our case, we're going to request the customer details from the database and tell the templating engine to render them onto the page.

We're going to use a templating engine called [Pug](https://pugjs.org/api/getting-started.html). Pug is a simple templating engine that integrates fully with Express. The syntax that Pug uses is very similar to HTML. One important difference in the syntax is that spacing is very important as it determines your parent/child hierarchy.

First, we need to tell Express which templating engine to use and where to find our templates. Put the following line above your route definitions (i.e. after the other app. lines in index.js):
```
app.engine('pug', require('pug').__express)
app.set('views', '.')
app.set('view engine', 'pug')
```
Now create a new file called `update.pug` with the following content:
```
html
  body
    p #{message}
    h2= 'Customer details'
    form(method='POST' action='/update')
      input(type='hidden' id='oldname' name='oldname' value=oldname)
      input(type='hidden' id='oldaddress' name='oldaddress' value=oldaddress)
      input(type='hidden' id='oldtelephone' name='oldtelephone' value=oldtelephone)
      input(type='hidden' id='oldnote' name='oldnote' value=oldnote)
      label(for='name') Customer name:
      br
      input(type='text', placeholder='John Smith' name='name' value=name)
      br
      label(for='address') Customer address:
      br
      input(type='text', placeholder='42 Wallaby Way, Sydney' name='address' value=address)
      br
      label(for='telephone') Customer telephone:
      br
      input(type='text', placeholder='+275554202' name='telephone' value=telephone)
      br
      label(for='note') Customer note:
      br
      input(type='text', placeholder='Likes unicorns' name='note' value=note)
      br
      button(type='submit' formaction="/update") Update
      button(type='submit' formaction="/delete") Delete
```
This is very similar to the HTML form we created previously for `create.html`, however this is written in the Pug templating language. We're creating a hidden element to store the "old" name, telephone, address, and note of the customer - this is for when we want to do an update.

Using the old details to update the customer is an easy solution, but not the best solution as it makes the query cumbersome and slow. If you add extra fields in your database you would have to remember to update your query as well, otherwise it could lead to updating or deleting the wrong customer if they have the same information. A better, but more complicated way is to use the unique ID of the database document as that will only ever refer to one customer.

We have also put in placeholder variables for name, address, telephone, and note, and we have given the form 2 buttons with different actions.

If you now run the code, you will have an index page with 2 buttons. Pressing the 'Update/Delete' button will take you to a new page that asks for a Customer name. Filling the customer name and pressing 'Get customer' will, after a little time, load a page with the customer's details and 2 buttons below that say 'Update' and 'Delete'. ![Update-Delete](https://imgur.com/m1lxFhs.png)

Our next step is to add the 'Update' and 'Delete' functionality. Add the following code below your routes in `index.js`:
```
app.post('/update', function(req, res) {
  client.connect(err => {
    if (err) throw err;
    let query = { name: req.body.oldname, address: req.body.oldaddress, telephone: req.body.oldtelephone, note: req.body.oldnote };
    let newvalues = { $set: {name: req.body.name, address: req.body.address, telephone: req.body.telephone, note: req.body.note } };
    client.db("crmdb").collection("customers").updateOne(query, newvalues, function(err, result) {
        if (err) throw err;
        console.log("1 document updated");
        res.render('update', {message: 'Customer updated!', oldname: req.body.name, oldaddress: req.body.address, oldtelephone: req.body.telephone, oldnote: req.body.note, name: req.body.name, address: req.body.address, telephone: req.body.telephone, note: req.body.note});
      });
  });
})

app.post('/delete', function(req, res) {
  client.connect(err => {
    if (err) throw err;
    let query = { name: req.body.name, address: req.body.address ? req.body.address : null, telephone: req.body.telephone ? req.body.telephone : null, note: req.body.note ? req.body.note : null };
    client.db("crmdb").collection("customers").deleteOne(query, function(err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      res.send(`Customer ${req.body.name} deleted`);
    });
  });
})
```
This introduces 2 new 'POST' handlers - one for `/update`, and one for `/delete`.

* **Line 2** connects to our MongoDB database.
* **Line 3** throws an error if there was a problem connecting to the database.
* **Line 4** defines a query that we will use to find the document to update. In this case, we are using the details of the customer *before* it was updated. We saved this name earlier in a hidden field in the HTML. Trying to find the customer by its updated name obviously won't work because it hasn't been updated yet. Also, note that we are setting some of the fields to null if they are empty. This is so that the database returns the correct document when we update or delete - if we search for a document that has no address with an address of '' (empty string), then our query won't return anything.
* **Line 5** defines the new values that we want to update our customer with.
* **Line 6** updates the customer with the new values using the query
* **Line 7** throws an error if there was a problem with the update.
* **Line 8** logs that a document was updated.
* **Line 9** re-renders the update page with a message saying that the customer was updated, and displays the new values.
* **Line 15** connects to our MongoDB database.
* **Line 16** throws an error if there was a problem connecting to the database.
* **Line 17** defines a query that we will use to find the document to delete. In this case we are using all the details of the customer *before* any changes were made on the form to make sure we delete that specific customer.
* **Line 18** we connect to the database and delete the customer.
* **Line 19** throws an error if there was a problem with the delete.
* **Line 20** logs that a document was deleted.
* **Line 21** sends a response to say that the customer was deleted.

## Putting it all together
If you run your application now, you'll be able to create, update, and delete documents in a MongoDB database. This is a very basic CRUD application, with a very basic and unstyled UI, but it should give you the foundation to build much more sophisticated applications.

For instance, you could add fields to the database to classify customers according to which stage they are in your sales [pipeline](https://www.bitrix24.com/glossary/what-is-pipeline-management-definition-crm.php) so that you can track if a customer is potentially stuck somewhere and contact them to re-engage.

You could then integrate some basic marketing automation with a page allowing you to send an email or SMS to customers (though don't spam clients!).

You could also add fields to keep track of customer purchasing information so that you can see which products do well with which customers.

If you want to start from where this tutorial leaves off, simply fork the Repl at [https://repl.it/@GarethDwyer1/nodejs-crm](https://repl.it/@GarethDwyer1/nodejs-crm).
To get additional guidance from the Repl community, also join Repl's Discord server by using this invite link [https://discord.gg/QWFfGhy](https://discord.gg/QWFfGhy).

_This article was contributed by Gerrit Vermeulen and edited by Katherine James._

