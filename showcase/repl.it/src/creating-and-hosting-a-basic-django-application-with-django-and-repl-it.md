# Creating and hosting a basic web application with Django and Repl.it

In this tutorial, we'll be using Django to create an online service that shows visitors their current weather and location. We'll develop the service and host it using [repl.it](https://repl.it).

To work through this tutorial, you should ideally have basic knowledge of Python and some knowledge of web application development. However, we'll explain all of our reasoning and each line of code thoroughly , so if you have any programming experience you should be able to follow along as a complete Python or web app beginner too. We'll also be making use of some HTML, JavaScript, and jQuery, so if you have been exposed to these before you'll be able to work through more quickly. If you haven't, this will be a great place to start.

To display the weather at the user's current location, we'll have to tie together a few pieces. The main components of our system are:

* A [Django](https://www.djangoproject.com/) application, to show the user a webpage with dynamic data 
* [Ipify](https://www.ipify.org/) to get our visitors' IP address so that we can guess their location
* [ip-api](http://ip-api.com/) to look up our visitors' city and country using their IP address
* [Open Weather Map](https://openweathermap.org) to get the current weather at our visitors' location. 

The main goals of this tutorial are to:
* Show how to set up and host a Django application using repl.it.
* Show how to join existing APIs together to create a new service. 

By using this tutorial as a starting point, you can easily create your own bespoke web applications. Instead of showing weather data to your visitors, you could, for example, pull and combine data from any of the hundreds of APIs found at [this list of public APIs](https://github.com/toddmotto/public-apis).


## Setting up 
You won't need to install any software or programming languages on your local machine, as we'll be developing our application directly through [repl.it](repl.it). Head over there and create an account by hitting "Sign up" in the top right-hand corner.

![Repl sign up page](https://i.imgur.com/ll2hg87.png)

Press the "Start coding now" button on the next page, and search for "Django" from the list of available languages and frameworks. Repl.it will go ahead and set up a full Django project for you with some sensible defaults. The project will include a single page saying "Hello Repl.it". It should look very similar to the  page below.

![The repl.it IDE on a new Django project](https://i.imgur.com/htQRomt.png)

In the left-most panel, you can see all the files that make up your Django project, organized into directories.

We won't explain what all these different components are for and how they tie together in this tutorial. If you want to understand Django better, you should definitely go through their [official tutorial](https://docs.djangoproject.com/en/2.0/intro/tutorial01/). Normally [I recommend Flask over Django](https://www.codementor.io/garethdwyer/flask-vs-django-why-flask-might-be-better-4xs7mdf8v) for beginners and for projects this simple, but Repl.it makes the Django setup easy by providing this initial set up. We'll be modifying only a few of these files to get the results that we want.

In the middle Repl.it pane, you can see your code. In the top-right pane, you can see your web application, as a visitor would see it. In the bottom-right pane, you can see any errors or other console output from your Repl.it webserver.

## Changing our static content
Viewing the default website isn't that interesting. Let's make a small change to make the website our own. The first thing we'll change is the static "front end" of the website -- the text that is displayed to all visitors.

The file that we'll need to make changes to is the main template at `templates/main/index.html`. You can access it by selecting it from the left file bar. It should look like this:

```html
{% extends "base.html" %}

{% block content %}
  <h1>Hello Repl.it</h1>
{% endblock content %}
```

This is a file written in [Django's template language](https://docs.djangoproject.com/en/2.0/topics/templates/), which often looks very much like HTML (and is usually found in files with a `.html` extension), but which contains some extra functionality to help us load dynamic data from the back end of our web application into the front end for our users to see.

Change the code where it says "Hello Repl.it" to read "Weather", and press the restart button as indicated below to see the result change from "Hello Repl.it" to "Weather". 

![Repl.it Restart and pop-out buttons](https://i.imgur.com/QgSIMIu.png)


You can also press the pop-out button to the right of the the URL bar to open only the resulting web page that we're building, as a visitor would see it. You can share the URL with anyone and they'll be able to see your Weather website already!

Changing the static text that our visitors see is a good start, but our web application still doesn't *do* anything. We'll change that in the next step by using JavaScript to get our user's IP Address.

## Calling IPIFY from JavaScript

An IP address is like a phone number. When you visit "google.com", your computer actually looks up the the name google.com to get a resulting IP address that is linked to one of Google's servers. While people find it easier to remember names like "google.com", computers work better with numbers. Instead of typing "google.com" into your browser toolbar, you could type the IP address 216.58.223.46, with the same results. Every device connecting to the internet, whether to serve content (like google.com) or to consume it (like you, reading this tutorial) has an IP address.

IP addresses are interesting to us because it is possible to guess a user's location based on their IP address. (In reality, this is an [imprecise and highly complicated](https://dyn.com/blog/finding-yourself-the-challenges-of-accurate-ip-geolocation/) process, but for our purposes it will be more than adequate). We will use the web service [ipify.org](https://www.ipify.org/) to retrieve our visitors' IP addresses.

In the Repl.it files tab, navigate to `templates/base.html`, which should look as follows.

```html
{% load staticfiles %}
<!DOCTYPE html>

<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello Django</title>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link rel="stylesheet" href="{% static "css/style.css" %}">
</head>
<body>
    {% block content %}{% endblock content %}
</body>
</html>
```
The "head" section of this template is between lines 5 and 11 -- the opening and closing `<head>` tags. We'll add our scripts directly below the `<link ...>` on line 10 and above the closing `</head>` tag on line 11. Modify this part of code to add the following lines:

```html
<script>
  function use_ip(json) {
    alert("Your IP address is: " + json.ip);
  }
  </script>

<script src="https://api.ipify.org?format=jsonp&callback=use_ip"></script>
```

These are two snippets of JavaScript. The first (lines 1-5) is a function that when called will display a pop-up box (an "alert") in our visitor's browser showing their IP address from the json object that we pass in. The second (line 7) loads an external script from ipify's API and asks it to pass data (including our visitor's IP address) along to the `use_ip` function that we provide.

If you open your web app again and refresh the page, you should see this script in action (if you're running an adblocker, it might block the ipify scripts, so try disabling that temporarily if you have any issues). 

![](https://i.imgur.com/DROK5bs.png)


This code doesn't do anything with the IP address except display it to the user, but it is enough to see that the first component of our system (getting our user's IP Address) is working. This also introduces the first *dynamic* functionality to our app -- before, any visitor would see exactly the same thing, but now we can show each visitor something related specifically to them (no two people have the same IP address).

Now instead of simply showing this IP address to our visitor, we'll modify the code to rather pass it along to our Repl webserver (the "backend" of our application), so that we can use it to fetch location information through a different service.

## Adding a new route and view, and passing data

Currently our Django application only has one route, the default (`/`) route which is loaded as our home page. We'll add another route at `/get_weather_from_ip` where we can pass an IP address to our application to detect the location and get a current weather report.

To do this, we'll need to modify the files at `main/views.py` and `main/urls.py`.

Edit `urls.py` to look as follows (add line 8, but you shouldn't need to change anything else). 

```python
from django.conf.urls import url
from django.contrib import admin
from main import views

urlpatterns = [
  url(r'^admin/', admin.site.urls),
  url(r'^$', views.home, name='home'),
  url(r'^get_weather_from_ip/', views.get_weather_from_ip, name="get_weather_from_ip"),
]
```

We've added a definition for the `get_weather_from_ip` route, telling our app that if anyone visits [http://weather-demo--garethdwyer1.repl.co/get_weather_from_ip](http://weather-demo--garethdwyer1.repl.co/get_weather_from_ip) then we should trigger a function in our `views.py` file that is also called `get_weather_from_ip`. Let's write that function now.

In your `views.py` file, add a `get_weather_from_ip()` function beneath the existing `home()` one, and add an import for JsonResponse on line 2. Your whole `views.py` file should now look like this: 

```python
from django.shortcuts import render
from django.http import JsonResponse


# Create your views here.
def home(request):
    return render(request, 'main/index.html')

def get_weather_from_ip(request):
  print(request.GET.get("ip_address"))
  data = {"weather_data": 20}
  return JsonResponse(data)
```

By default, Django passes a `request` argument to all views. This is an object that contains information about our user and the connection, and any additional arguments passed in the URL. As our application isn't connected to any weather services yet, we'll just make up a temperature (20) and pass that back to our user as JSON. 

In line 10, we print out the IP address that we will pass along to this route from the `GET` arguments (we'll look at how to use this later). We then create the fake data (which we'll later replace with real data) and return a JSON response (the data in a format that a computer can read more easily, with no formatting). We return JSON instead of HTML because our system is going to use this route internally to pass data between the front and back ends of our application, but we don't expect our users to use this directly.

To test this part of our system, open your web application in a new tab and add `/get_weather_from_ip?ip_address=123` to the URL. Here, we're asking our system to fetch weather data for the IP address `123` (not a real IP address). In your browser, you'll see the fake weather data displayed in a format that can easily be programmatically parsed.

![Viewing the fake JSON data](https://i.imgur.com/scdld1E.png)

In our Repl's output, we can see that the backend of our application has found the "IP address" and printed it out, between some other outputs telling us which routes are being visited and which port our server is running on:

![Django print output of fake IP](https://i.imgur.com/KJDlDL8.png)

The steps that remain now are to:

* pass the user's real IP address to our new route in the background when the user visits our main page
* add more backend logic to fetch the user's location from the IP address
* add logic to fetch the user's weather from their location
* display this data to the user.


Let's start by using [Ajax](https://en.wikipedia.org/wiki/Ajax_(programming)) to pass the user's IP address that we collected before to our new route, without our user having to explicitly visit the `get_weather_from_ip` endpoint or refresh their page. 

## Calling a Django route using Ajax and jQuery

We'll use [Ajax through jQuery](http://api.jquery.com/jquery.ajax/) to do a "partial page refresh" -- that is, to update part of the page the user is seeing by sending new data from our backend code without the user needing to reload the page. 

To do this, we need to include jQuery as a library.`


> Note: usually you wouldn't add JavaScript directly to your base.html template, but to keep things simpler and to avoid creating too many files, we'll be diverging from some good practices. See [the Django documentation](https://docs.djangoproject.com/en/2.0/howto/static-files/) for some guidance on how to structure JavaScript properly in larger projects.

In your `templates/base.html` file, add the following script above the line where we previously defined the `use_ip()` function.

```html
<script
  src="https://code.jquery.com/jquery-3.3.1.min.js"
  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
  crossorigin="anonymous"></script>
  
```

This loads the entire jQuery library from a [CDN](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/), allowing us to complete certain tasks using fewer lines of JavaScript. 

Now, modify the `use_ip()` script that we wrote before to call our backend route using Ajax. The new `use_ip()` function should be as follows:

```html=
  function use_ip(json) {
    $.ajax({
      url: {% url 'get_weather_from_ip' %},
      data: {"ip": json.ip},
      dataType: 'json',
      success: function (data) {
        document.getElementById("weatherdata").innerHTML = data.weather_data 
      }
    });
  }
```

Our new `use_ip()`function makes an [asynchronous](http://api.jquery.com/jquery.ajax/) call to our `get_weather_from_ip` route, sending along the IP address that we previously displayed in a pop-up box. If the call is successful, we call a new function (in the `success:` section) with the returned data. This new function (line 7) looks for an HTML element with the ID of `weatherdata` and replaces the contents with the `weather_data` attribute of the response that we received from `get_weather_from_ip` (which at the moment is still hardcoded to be "20").

To see the results, we'll need to add an HTML element as a placeholder with the id `weatherdata`. Do this in the `templates/main/index.html` file as follows.

```html
{% extends "base.html" %}

{% block content %}
  <h1>Weather</h1>
  <p id=weatherdata></p>
{% endblock %}
```
This adds an empty HTML *paragraph* element which our JavaScript can populate once it has the required data.

Now reload the app and you should see our fake `20` being displayed to the user. If you don't see what you expect, open up your browser's developer tools  for [Chrome](https://developers.google.com/web/tools/chrome-devtools/) and [Firefox](https://developer.mozilla.org/son/docs/Tools)) and have a look at the Console section for any JavaScript errors. A clean console (with no errors) is shown below.


![](https://i.imgur.com/6ZKlc4N.png)


Now it's time to change out our mock data for real data by calling two services backend -- the first to get the user's location from their IP address and the second to fetch the weather for that location. 

## Using ip-api.com for geolocation

The service at [ip-api.com](http://ip-api.com) is very simple to use. To get the country and city from an IP address we only need to make one web call. We'll use the python `requests` library for this, so first we'll have to add an import for this to our `views.py` file, and then write a function that can translate IP addresses to location information. Add the following import to your`views.py` file:

```python
import requests
```

and above the `get_weather_from_ip()` function, add the`get_location_from_ip()` function as follows:

```python
def get_location_from_ip(ip_address):
    response = requests.get("http://ip-api.com/json/{}".format(ip_address))
    return response.json()
```

> Note: again we are diverging from best practice in the name of simplicity. Usually whenever you write any code that relies on networking (as above), you should add [exception handling](https://docs.python.org/3/tutorial/errors.html) so that your code can fail more gracefully if there are problems.

You can see the response that we'll be getting from this service by trying it out in your browser. Visit [http://ip-api.com/json/41.71.107.123](http://ip-api.com/json/41.71.107.123) to see the JSON response for that specific IP address. 

![](https://i.imgur.com/2LAhUwr.png)

Take a look specifically at the highlighted location information that we'll need to extract to pass on to a weather service.

Before we set up the weather component, let's display the user's current location data instead of the hardcoded temperature that we had before. Change the `get_weather_from_ip()` function to call our new function and pass along some useful data as follows:

```python
def get_weather_from_ip(request):
  ip_address = request.GET.get("ip")
  location = get_location_from_ip(ip_address)
  city = location.get("city")
  country_code = location.get("countryCode")
  s = "You're in {}, {}".format(city, country_code)
  data = {"weather_data": s}
  return JsonResponse(data)
```

 Now, instead of just printing the IP address that we get sent and making up some weather data, we use the IP address to guess the user's location, and pass the city and country  code back to the template to be displayed. If you reload your app again, you should see something similar to the following (though hopefully with your location instead of mine).

![weather app, location showing](https://i.imgur.com/462TVyW.png)

That's the location component of our app done and dusted -- let's move on to getting weather data for that location now.


## Getting weather data from OpenWeatherMap

To get weather data automatically from [OpenWeatherMap](https://openweathermap.org/), you'll need an API Key. This is a unique string that OpenWeatherMap gives to each user of their service and it's used mainly to restrict how many calls each person can make in a specified period. Luckily, OpenWeatherMap provides a generous "free" allowance of calls, so we won't need to spend any money to build our app. Unfortunately, this allowance is not quite generous enough to allow me to share my key with every reader of this tutorial, so you'll need to sign up for your own account and generate your own key. 

Visit [openweathermap.org](https://openweathermap.org/), hit the "sign up" button, and register for the service by giving them an email address and choosing a password. Then navigate to the [API Keys](https://home.openweathermap.org/api_keys)  section and note down your unique API key (or copy it to your clipboard).

![OpenWeatherMap API Key page](https://i.imgur.com/qzQGAV1.png)

This key is a bit like a password -- when we use OpenWeatherMap's service, we'll always send along this key to indicate that it's us making the call. Because Repl.it's projects are public by default, we'll need to be careful to keep this key private and prevent other people making too many calls using our OpenWeatherMap quota (potentially making our app fail when OpenWeatherMap starts blocking our calls). Luckily Repl.it provides a neat way of solving this problem [using `.env `files](https://repl.it/site/docs/secret-keys). 

In your project, create a new file using the "New file" button as shown below. Make sure that the file is in the root of your project and that you name the file `.env` (in Linux, starting a filename with a `.` usually indicates that it's a system or configuration file). Inside this file, define the `OPEN_WEATHER_TOKEN` variable as follows, but using your own token instead of the fake one below. Make sure not to have a space on either side of the `=` sign.

```bash
OPEN_WEATHER_TOKEN=1be9250b94bf6803234b56a87e55f
```

![Creating a new file](https://i.imgur.com/wPDhRuC.png)

Repl.it will load the contents of this file into our server's [environment variables](https://wiki.archlinux.org/index.php/environment_variables). We'll be able to access this using the `os` library in Python, but when other people view or fork our Repl, they won't see the `.env` file, keeping our API key safe and private. 

To fetch weather data, we need to call the OpenWeatherMap api, passing along a search term. To make sure we're getting the city that we want, it's good to pass along the country code as well as the city name. For example, to get the weather in London right now, we can visit (again, you'll need to add your own API key in place of the string after `appid=`) https://api.openweathermap.org/data/2.5/weather?q=London,UK&units=metric&appid=cb932829eacb6a0e9ee4f382a2a56734b39

To test this, you can visit the URL in your browser first. If you prefer Fahrenheit to Celsius, simply change the `unit=metric` part of the url to `units=imperial`. 

![Json response from OpenWeatherMap](https://i.imgur.com/Mt7RVFp.png)

Let's write one last function in our `views.py` file to replicate this call for our visitor's city which we previously displayed. 

First we need to add an import for the Python `os` (operating system) module so that we can access our environment variables. At the top of `views.py` add:

```python
import os
```

Now we can write the function. Add the following to `views.py`:

```python
def get_weather_from_location(city, country_code):
    token = os.environ.get("OPEN_WEATHER_TOKEN")
    url = "https://api.openweathermap.org/data/2.5/weather?q={},{}&units=metric&appid={}".format(
        city, country_code, token)
    response = requests.get(url)
    return response.json()
```
In line 2, we get our API key from the environment variables (note, you sometimes need to refresh the repl.it page with your repl in to properly load in the environment variables), and we then use this to format our URL properly in line 3. We get the response from OpenWeatherMap and return it as json.

We can now use this function in our `get_weather_from_ip()` function by modifying it to look as follows:

```python
def get_weather_from_ip(request):
  ip_address = request.GET.get("ip")
  location = get_location_from_ip(ip_address)
  city = location.get("city")
  country_code = location.get("countryCode")
  weather_data = get_weather_from_location(city, country_code)
  description = weather_data['weather'][0]['description']
  temperature = weather_data['main']['temp']
  s = "You're in {}, {}. You can expect {} with a temperature of {} degrees".format(city, country_code, description, temperature)
  data = {"weather_data": s}
  return JsonResponse(data)
  ```
  
 We now get the weather data in line 6, parse this into a description and temperature in lines 7 and 8, and add this to the string we pass back to our template in line 9. If you reload the page, you should see your location and your weather.
 
 ![Weather app showing location and weather](https://i.imgur.com/D1XIZwZ.png)
 
 Because we're doing several API calls now, the page might be blank for a few seconds after loading before populating the weather and location data. Again, if you don't see what you expect, check the Repl.it server output and have a look at your browser's developer tools console.
 
 
## Forking the Repl to extend it
 
You now have a basic Django application that can be visited by anyone and which shows dynamic data. 

If you want to extend the application, Repl.it makes it easy to "fork", which means you'll be able to clone the Repl exactly where we left off and modify it any way you want. Simply head over to my Repl at [https://repl.it/@GarethDwyer1/weather-location-tutorial](https://repl.it/@GarethDwyer1/weather-location-tutorial) and hit the "Fork" button. If you didn't create an account at the beginning of this tutorial, you'll be prompted to create one again. (You can even use a lot of Repl functionality without creating an account.) 

![Forking a Repl](https://i.imgur.com/GlOnmAw.png)

If you're stuck for ideas, some possible extensions are:

* Make the page look nicer by using [Bootstrap](https://getbootstrap.com/) or another CSS framework in your template files.
* Make the app more customizable by allowing the user to choose their own location if the IP location that we guess is wrong
* Make the app more useful by showing the weather forecast along with the current weather. (This data is [also available](https://openweathermap.org/forecast5) from Open Weather Map). 
* Add other location-related data to the web app such as news, currency conversion, translation, postal codes. See [https://github.com/toddmotto/public-apis#geocoding](https://github.com/toddmotto/public-apis#geocoding) for a nice list of possibilities.

If you liked this tutorial, you might be interested in [Building a Chatbot using Telegram and Python](https://www.codementor.io/garethdwyer/building-a-telegram-bot-using-python-part-1-goi5fncay) where I show how to build chatbots, or my book [Flask by Example](https://www.packtpub.com/web-development/flask-example) where I give a more thorough introduction to web application development using Python. Feel free to [ping me on Twitter](https://twitter.com/sixhobbits) for any questions about this tutorial, to point out mistakes, or to ask about web development in general. 
