# Building news word clouds using Python and Repl.it

Word clouds are a popular way to visualise large amounts of text. Word clouds are images showing scattered words in different sizes, where words that appear more frequently in the given text are larger, and less common words are smaller or not shown at all. 

In this tutorial, we'll build a web application using Python and Flask that transforms the latest news stories into word clouds and displays them to our visitors. 

Our users will see a page similar to the one shown below, but containing the latest news headlines from BBC news. We'll learn some tricks about web scraping, RSS feeds, and building image files directly in memory along the way.

![Final Demo](https://cdn.filestackcontent.com/i0IjIMSLmjQ7AI6yVQMA)

## Overview
We'll be building a simple web application step-by-step, and explaining each line of code in detail. To follow, you should have some basic knowledge of programming and web concepts, such as what if statements are and how to use URLs. Specifically, we'll:

* Look at RSS feeds and how to use them in Python
* Show how to set up a basic Flask web application
* Use BeautifulSoup to extract text from online news articles
* Use WordCloud to transform the text into images
* Import Bootstrap and add some basic CSS styling

We'll be using Python, but we won't assume that you're a Python expert and we'll show how to set up a full Python environment online so you won't need to install anything locally to follow along.

## Web scraping

We previously looked at basic web scraping in an [introduction to web scraping](https://www.codementor.io/garethdwyer/beginner-web-scraping-with-python-and-repl-it-nzr27jvnq). If you're completely new to the idea of automatically retrieving content from the internet, have a look at that tutorial first.

In this tutorial, instead of scraping the links to news articles directly from the BBC homepage, we'll be using [RSS feeds](https://en.wikipedia.org/wiki/RSS) - an old but popular standardised format that publications use to let readers know when new content is available. 

## Taking a look at RSS Feeds

RSS feeds are published as XML documents. Every time BBC (and other places) publishes a new article to their home page, they also update an XML machine-readable document at http://feeds.bbci.co.uk/news/world/rss.xml. This is a fairly simple feed consisting of a `<channel>` element, which has some meta data and then a list of `<item>` elements, each of which represents a new article. The articles are arranged chronologically, with the newest ones at the top, so it's easy to retrieve new content.

![XML](https://cdn.filestackcontent.com/bmIIvSSZSkqpuH9Gfcf0)

If you click on the link above, you won't see the XML directly. Instead it has some associated styling information so that most web browsers will display something that's a bit more human friendly. For example, opening the page in Google Chrome shows the page below. In order to view the raw XML directly, you can right click on the page and click "view source". 

![Styled XML](https://cdn.filestackcontent.com/FnmetmDTN6aR5VdsAnCw)

RSS feeds are used internally by software such as the news reader [Feedly](feedly.com) and various email clients. We'll be consuming these RSS feeds with a Python library to retrieve the latest articles from BBC. 

## Setting up our online environment (Repl.it)

In this tutorial, we'll be building our web application using [repl.it](repl.it), which will allow us to have a consistent code editor, environment, and deployment framework in a single click. Head over there and create an account. Choose to create a Python repl, and you should see an editor where you can write and run Python code, similar to the image below. You can write Python code in the middle pane, run it by pressing the green "run" button, and see the output in the right pane. In the left pane, you can see a list of files, with `main.py` added there by default.

![Repl Hello World](https://cdn.filestackcontent.com/bh3icyFSXuhstbqsw1cZ)

The first thing we want to do to access RSS feeds easily is install the Python [feedparser](https://pythonhosted.org/feedparser/) library. To install it in our Repl environment, we'll need to create a new file called `requirements.txt`. To do this, press the small "new file" button in the left pane, call the file exactly `requirements.txt` (Repl will recognise that this is a special file so it's important to name it correctly), and add the single line `feedparser` to this file to tell Repl to install the `feedparser` library.

![Add requirements](https://cdn.filestackcontent.com/fHskeSjJTSGDovBpY32o)

## Pulling data from our feed and extracting URLs

In the [previous webscraping tutorial](https://www.codementor.io/garethdwyer/beginner-web-scraping-with-python-and-repl-it-nzr27jvnq) we used [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/) to look for hyperlinks in a page and extract them. Now that we are using RSS, we can simply parse the feed as described above to find these same URLs. 

Let's start by simply printing out the URLs for all of the latest articles from BBC. Switch back to the `main.py` file in the Repl.it IDE and add the following code.

```python
import feedparser

BBC_FEED = "http://feeds.bbci.co.uk/news/world/rss.xml"
feed = feedparser.parse(BBC_FEED)

for article in feed['entries']:
    print(article['link'])
```

Feedparser does most of the heavy lifting for us, so we don't have to get too close to the slightly cumbersome XML format. In the code above, we parse the feed into a nice Python representation (line 4), loop through all of the `entries` (the `<item>` entries from the XML we looked at earlier), and print out the `link` elements.

If you run this code, you should see a a few dozen URLs output on the right pane, as in the image below.

![Printing URLs](https://cdn.filestackcontent.com/ptSi4TFHTCexuU7DasO5)

## Setting up a web application with Flask

We don't just want to print this data out in the Repl console. Instead our application should return information to anyone who uses a web browser to visit our application. We'll therefore install the lightweight web framework [Flask](http://flask.pocoo.org/) and use this to serve web content to our visitors.

Switch back to the `requirements.txt` file and add a new line `flask` .This should now look as follows.

![Requirements with Flask](https://cdn.filestackcontent.com/SFgt5TMESNiYejYCrOHQ)

Navigate back to the `main.py` file and modify our code to look as follows.

```python
import feedparser
from flask import Flask

app = Flask(__name__)

BBC_FEED = "http://feeds.bbci.co.uk/news/world/rss.xml"

@app.route("/")
def home():
    feed = feedparser.parse(BBC_FEED)
    urls = []

    for article in feed['entries']:
        urls.append(article['link'])
    
    return str(urls)
        

if __name__ == '__main__':
    app.run('0.0.0.0')
```

Here we still parse the feed and extract all of the latest article URLs, but instead of printing them out, we add them to a list (`urls`), and return them from a function. The interesting parts of this code are

- **Line 2**: we import Flask
- **Line 4**: we initialise Flask to turn our project into a web appliaction
- **Line 8:** we use a decorator to define the homepage of our application (an empty route, or `/`). 
- **Lines 19-20**: We run Flask's built-in web server to serve our content.

Press "run" again, and you should see a new window appear in Repl in the top right. Here we can see a basic web page (viewable already to anyone in the world by sharing the URL you see above it), and we see the same output that we previously printed to the console. 

![First Flask output](https://cdn.filestackcontent.com/9YDm81XR9eNQyY7y6lSQ)

## Downloading articles and extracting the text

The URLs aren't that useful to us, as we eventaully want to display a summary of the *content* of each URL. The actual text of each article isn't included in the RSS feed that we have (some RSS feeds contain the full text of each article), so we'll need to do some more work to download each article. First we'll add the third-party libraries `requests` and `BeautifulSoup` as dependencies. We'll be using these to download the content of each article from the URL and strip out extra CSS and JavaScript to leave us with plain text.

In `requirements.txt` add the two new dependencies. Your file should now look like the one in the image below (I've kept them ordered alphabetically, which is good practice but not a strict requirement).

![Adding more dependencies](https://cdn.filestackcontent.com/t5ALKH2dSqayREEEnkSF)

Now we're ready to download the content from each article and serve that up to the user. Modify the code in `main.py` to look as follows.

```python
import feedparser
import requests

from flask import Flask
from bs4 import BeautifulSoup

app = Flask(__name__)

BBC_FEED = "http://feeds.bbci.co.uk/news/world/rss.xml"
LIMIT = 2

def parse_article(article_url):
    print("Downloading {}".format(article_url))
    r = requests.get(article_url)
    soup = BeautifulSoup(r.text, "html.parser")
    ps = soup.find_all('p')
    text = "\n".join(p.get_text() for p in ps)
    return text

@app.route("/")
def home():
    feed = feedparser.parse(BBC_FEED)
    article_texts = []

    for article in feed['entries'][:LIMIT]:
        text = parse_article(article['link'])
        article_texts.append(text)
    return str(article_texts)
        
if __name__ == '__main__':
    app.run('0.0.0.0')
```

Let's take a closer look at what has changed.

- We import our new libraries on **lines 2 and 5**.
- We create a new global variable `LIMIT` on **line 10** to limit how many articles we want to download.
- **Lines 12-18** define a new function that takes a URL, downloads the article, and extracts the text. It does this using a crude algorithm that assumes anything inside HTML `<p>` (paragraph) tags is interesting content. 
- We modify **lines 23, 25, 26, and 27** so that we use the new `parse_article` function to get the actual content of the URLs that we found in the RSS feed and return that to the user instead of returning the URL directly. Note that we limit this to two articles by truncating our list to `LIMIT` for now as the downloads take a while and Repl's resources on free accounts are limited.

If you run the code now, you should see output similar to that shown in the image below. You can see text from the first article about Trump and the US Trade gap in the top right pane now, and the text for the second article is further down the page. You'll notice that out text extraction algorithm isn't perfect and there's still some extra text about "Share this" at the top that isn't actually part of the article, but this is good enough for us to create word clouds from later.

![Displaying aritcles](https://cdn.filestackcontent.com/k0zPgNVNREijxJCofvYy)

## Returning HTML instead of plain text to the user

Although Flask allows us to return Python `str` objects directly to our visitors, the raw result is ugly compared to how people are used to seeing web pages. In order to take advantage of HTML formatting and CSS styling, it's better to define HTML *templates*, and use Flask's template engine, `jinja`, to inject dynamic content into these. Before we get to creating image files from our text content, let's set up a basic Flask template. 

To use Flask's templates, we need to set up a specific file structure. Press the "new folder" button in Repl (next to the "new file" button we used earlier), and name the resulting new folder `templates`. Again, this is a special name recognised by Flask, so make sure you get the spelling exactly correct. 

Select the new folder and press the "new file" button to create a new file inside our `templates` folder. Call the file `home.html`. Note below how the `home.html` file is indented one level, showing that it is inside the folder. If yours is not, drag and drop it into the `templates` folder so that Flask can find it.

![Adding a folder](https://cdn.filestackcontent.com/7xRwMGRR2gCLPCljGYAt)

In the `home.html` file, add the following code, which is a mix between standard HTML and Jinja's templating syntax to mix dynamic content into the HTML.

```html
<html>
    <body>
        <h1>News Word Clouds</h1>
        <p>Too busy to click on each news article to see what it's about? Below you can see all the articles from the BBC front page, displayed as word clouds. If you want to read more about any particular article, just click on the wordcloud to go to the original article</p>
        {% for article in articles %}
            <p>{{article}}</p>
        {% endfor %}
    </body>
</html>
```

Jinja uses the specials characters `{%` and `{{` (in opening and closing pairs) to show where dynamic content (e.g. variables calculated in our Python code) should be added and to define control structures. Here we loop through a list of `articles` and display each one in a set of `<p>` tags. 

We'll also need to tweak our Python code a bit to account for the template. In the `main.py` file, make the following changes.

- Add a new import near the top of the file, below the existing Flask import

```python
from flask import render_template 
```

- Update the last line of the `home()` function to make a call to `render_template` instead of returning a `str` directly as follows.

```python
@app.route("/")
def home():
    feed = feedparser.parse(BBC_FEED)
    article_texts = []

    for article in feed['entries'][:LIMIT]:
        text = parse_article(article['link'])
        article_texts.append(text)
    return render_template('home.html', articles=article_texts)
```

The `render_template` call tells Flask to prepare some HTML to return to the user by combining data from our Python code and the content in our `home.html` template. Here we pass `article_texts` to the renderer as `articles`, which matches the `articles` variable we loop through in `home.html`. 

If everything went well, you should see different output now, which contains our header from the HTML and static first paragraph, followed by two paragraphs showing the same article content that we pulled before. 

![First template](https://cdn.filestackcontent.com/frTNgvRpaHdFjp59g7q4)

Now it's time to move on to generating the actual wordclouds.

## Generating word clouds from text in Python

Once again, there's a nifty Python library that can help us. This one will take in text and return word clouds as images. It's called `wordcloud` and can be installed in the same way as the others by adding it to our `requirements.txt` file. This is the last dependency we'll be adding, so the final `requirements.txt` file should look as follows.

![Wordcloud Requirement](https://cdn.filestackcontent.com/eRMi9PHuTS6Dy6rEewO2)

Images are usually served as files living on your server or from an image host like [imgur](imgur.com). Because we'll be creating small, short-lived images dynamically from text, we'll simply keep them in memory instead of saving them anywhere permanently. In order to do this, we'll have to mess around a bit with the Python `io` and `base64` libraries, alongside our newly installed `wordcloud` library.

To import all the new libraries we'll be using to process images, modify the top of our `main.py` to look as follows. (These libraries are built into Python so there's no need to add them to requirements.txt.)

```python
import base64
import feedparser
import io
import requests

from /bs4 import BeautifulSoup
from wordcloud import WordCloud
from flask import Flask
from flask import render_template 
```

We'll be converting the text from each article into a separate word cloud, so it'll be useful to have another helper function that can take text as input and produce the word cloud as output. We can use [base64](https://en.wikipedia.org/wiki/Base64) to represent the images, which can then be displayed directly in our visitors' web browsers.

Add the following function to the `main.py` file.

```python
def get_wordcloud(text):
    pil_img = WordCloud().generate(text=text).to_image()
    img = io.BytesIO()
    pil_img.save(img, "PNG")
    img.seek(0)
    img_b64 = base64.b64encode(img.getvalue()).decode()
    return img_b64
```

This is probably the hardest part of our project in terms of readibility. Normally, we'd generate the word cloud using the `wordcloud` library and then save the resulting image to a file. However, because we don't want to use our file system here, we'll create a `BytesIO` Python object in memory instead and save the image directly to that. We'll convert the resulting bytes to base64 in order to finally return them as part of our HTML response and show the image to our visitors.

In order to use this function, we'll have to make some small tweaks to the rest of our code.

For our template, in the `home.html` file, change the for loop to read as follows.

```html
{% for article in articles %}
	<img src="data:image/png;base64,{{article}}">
{% endfor %}
```

Now instead of displaying our article in `<p>` tags, we'll put it inside an `<img/>` tag so that it can be displayed as an image. We also specify that it is formatted as a png and encoded as base64.

The last thing we need to do is modify our `home()` function to call the new `get_wordcloud()` function and to build and render an array of images instead of an array of text. Change the `home()` function to look as follows.

```python
@app.route("/")
def home():
    feed = feedparser.parse(BBC_FEED)
    clouds = []
    
    for article in feed['entries'][:LIMIT]:
        text = parse_article(article['link'])
        cloud = get_wordcloud(text)
        clouds.append(cloud)
    return render_template('home.html', articles=clouds)
```

We made changes on lines 4, 8, 9, and 10, to change to a `clouds` array, populate that with images from our `get_wordcloud()` function, and return that in our `render_template` call.

If you restart the Repl and refresh the page, you should see something similar to the following. We can see the same content about Trump, the US, tariffs, and trade deficits, but we can now see the important keywords without having to read the entire article.

![first-word-clouds.png](https://cdn.filestackcontent.com/3rd1GrAHTWi2L7x9NZm0)

For a larger view, you can pop out the website in a new browser tab using the button in the top right of the Repl editor (indicated in red above). 

The last thing we need to do is add some styling to make the page look a bit prettier and link the images to the original articles.

## Adding some finishing touches

Our text looks a bit stark, and our images touch each other which makes it hard to see that they are separate images. We'll fix that up by adding a few lines of CSS and importing the Bootstrap framework.

### Adding CSS

Edit the `home.html` file to look as follows

```html
<html>
  <head>
    <title>News in WordClouds | Home</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu" crossorigin="anonymous">
      
    <style type="text/css">
      body {padding: 20px;}
      img{padding: 5px;}
    </style>
  </head>

  <body>
    <h1>News Word Clouds</h1>
      <p>Too busy to click on each news article to see what it's about? Below you can see all the articles from the BBC front page, displayed as word clouds. If you want to read more about any particular article, just click on the wordcloud to go to the original article</p>
      {% for article in articles %}
        <a href="{{article.url}}"><img src="data:image/png;base64,{{article.image}}"></a>
      {% endfor %}
  </body>
</html>
```

On **line 3** we add a title, which is displayed in the browser tab. On **line 4**, we import [Bootstrap](https://getbootstrap.com/), which has some nice CSS defaults right out the box (it's probably a bit heavy-weight for our project as we have so little content and won't use most of Bootstrap's features, but it's nice to have if you're planning on extending the project.)

On **lines 6-8**, we add padding to the main body to stop the text going to close to the edges of the screen, and also add padding to our images to stop them touching each other. 

On **line 16**, we use an `<a>` tag to add a link to our image. We also change the Jinja templates to `{{article.url}}` and `{{article.image}}` so that we can have images that link back to the original news article. 

Now we need to tweak our backend code again to pass through the URL and image for each article, as the template currently doesn't have access to the URL.

### Passing through the URLs

To easily keep track of pairs of URLs and images, we'll add a basic Python helper class called `Article`. In the `main.py` file, add the following code before the function definitions.

```python
class Article:
    def __init__(self, url, image):
        self.url = url
        self.image = image
```

This is a simple class with two attributes: url and image. We'll store the original URL from the RSS feed in `url` and the final base64 wordcloud in `image`.

To use this class, modify the `home()` function to look as follows.

```python
@app.route("/")
def home():
    feed = feedparser.parse(BBC_FEED)
    articles = []

    for article in feed['entries'][:LIMIT]:
        text = parse_article(article['link'])
        cloud = get_wordcloud(text)
        articles.append(Article(article['link'], cloud))
    return render_template('home.html', articles=articles)
```

We changed the name of our `clouds` list to `articles`, and populated it by initialising `Article` objects in the for loop and appending them to this list. We then pass across `articles=articles` instead of `articles=clouds` in the return statement so that the template can access our list of `Article` objects, which each contain the image and the URL of each article.

If you refresh the page again, you'll be able to click any of the images to go to the original article, allowing readers to view a brief summary of the day's news or to read more details about any stories that catch their eye.

## Where next?

We've included several features in our web application, and looked at how to use RSS feeds and process and serve images directly in Python, but there are a lot more features we could add. For example:

- Our application only shows two stories at a time as the download time is slow. We could instead look at implementing a threaded solution to downloading web pages so that we could process several articles in parallel. Alternatively or in addition, we could also download the articles on a schedule and cache the resulting images so that we don't have to do the resource heavy downloading and parsing each time a visitor visits our site.
- Our web application only shows articles from a single source (BBC), and only from today. We could add some more functionality to show articles from different sources and different time frames. We could also consider allowing the viewer to choose which category of articles to view (news, sport, politics, finance, etc) by using different RSS feeds as sources.
- Our design and layout is very basic. We could make our site look better and be more responsive by adding more CSS. We could lay out the images in a grid of rows and columns to make it look better on smaller screens such as mobile phones. 

If you'd like to keep working on the web application, simply head over to [the repl](https://repl.it/@GarethDwyer1/news-to-wordcloud) and fork it to continue your own version. Feel free to comment below or contact me [on Twitter](https://twitter.com/sixhobbits) if you have any questions or comments, or simply want to share what you made using this as a starting point. You can also join [the Repl Discord server](https://discord.gg/QWFfGhy) where there is a community of developers and makers who are happy to help out and discuss ideas. Finally, you might enjoy [my other tutorials](https://dwyer.co.za/writing.html).


