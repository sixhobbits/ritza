# Introduction to Machine Learning with Python and repl.it

In this tutorial, we're going to walk through how to set up a basic Python [repl](https://repl.it) that can learn the difference between two categories of sentences, positive and negative. For example, if you had the sentence "I love it!", we want to train a machine to know that this sentence is associated with happy and positive emotions. If we have a sentence like "it was really terrible", we want the machine to label it as a negative or sad sentence. 

The maths, specifically calculus and linear algebra, behind machine learning gets a bit hairy. We'll be abstracting this away with the Python library [scikit-learn](https://scikit-learn.org/), which makes it possible to do advanced machine learning in a few lines of Python.

At the end of this tutorial you'll understand the fundamental ideas of automatic classification and have a program that can learn by itself to distinguish between different categories of text. You'll be able to use the same code to learn new categories (e.g. spam/not-spam, or clickbait/non-clickbait).

## Prerequisites

To follow along this tutorial, you should have at least basic knowledge of Python or a similar programming language. Ideally, you should also sign up for a [repl.it](https://repl.it) account so that you can modify and extend the bot we build, but it's not completely necessary.

## Setting up

If you're following along using repl.it, then visit the homepage and login or create a new account. Follow the prompts to create your first Repl, and choose "Python". You'll be taken to a new Repl project where you can run Python code and immediately see the output, which is great for rapid development.

The first thing we need to do is install scikit-learn, which is a really nice Python library to get started with machine learning. Create a new file using the "add file" button at the top left, call the file `requirements.txt` (the exact name is important -- it's a special file that repl will look for dependencies in and install them automatically), and add the line `scikit-learn` to the top of the new file that gets created.

You should see the library installing through the output produced in the right-hand panel, as in the image below.

![repl-start-screen.png](https://cdn.filestackcontent.com/ABu0DokgQmKBxPp5Mlvk)

Now you have the powerful and simple scikit-learn available! Let's learn how to use it. Open the `main.py` file that Repl created for you automatically and add the following two imports to the top.

```python
from sklearn import tree
from sklearn.feature_extraction.text import CountVectorizer
```

In line 1, we import the `tree` module, which will give us a Decision Tree classifier that can learn from data. In line 2, we import a vectoriser -- something that can turn text into numbers. We'll describe each of these in more detail soon!

Throughout the next steps, you can hit the big green "run" button to run your code, check for bugs, and view output along the way (you should do this every time you add new code).

## Creating some mock data

Before we get started with the exciting part, we'll create a very simple dataset -- too simple in fact. You might not see the full power of machine learning at first as our task will look so easy, but once we've walked through the concepts, it'll be a simple matter of swapping the data out for something bigger and more complicated.

On the next lines of main.py add the following lines of code.

```python
positive_texts = [
    "we love you",
    "they love us",
    "you are good",
    "he is good",
    "they love mary"
]

negative_texts =  [
    "we hate you", 
    "they hate us",
    "you are bad",
    "he is bad",
    "we hate mary"
]

test_texts = [
    "they love mary",
    "they are good",
    "why do you hate mary",
    "they are almost always good",
    "we are very bad"
]
```

We've created three simple datasets of five sentences each. The first one contains positive sentences; the second one contains negative sentences; and the last contains a mix of positive and negative sentences.

It's immediately obvious to a human which sentences are positive and which are negative, but can we teach a computer to tell them apart? 

We'll use the two lists `positive_texts` and `negative_texts` to *train* our model. That is, we'll show these examples to the computer along with the correct answers for the question "is this text positive or negative?". The computer will try to find rules to tell the difference, and then we'll test how well it did by giving it `test_texts` without the answers and ask it to guess whether each example is positive or negative.

## Understanding vectorization

The first step in nearly all machine learning problems is to translate your data from a format that makes sense to a human to one that makes sense to a computer. In the case of language and text data, a simple but effective way to do this is to associate each unique word in the dataset with a number, from 0 onwards. Each text can then be represented by an array of numbers, representing how often each possible word appears in the text.

Let's go through an example to see how this works. If we had the two sentences

`["nice pizza is nice"], ["what is pizza"]`

then we would have a dataset with four unique words in it. The first then we'd want to do is create a vocabulary mapping to map each unique word to a unique number.  We could do this as follows:

```python
{
    "nice": 0,
    "pizza": 1,
    "is": 2,
    "what": 3
}
```

To create this, we simply go through both sentences from left to right, mapping each new word to the next available number and skipping words that we've seen before. Now we can again convert our sentences into bag of words vectors as follows

```python
[
    [2, 1, 1, 0], # two "nice", one "pizza", one "is", zero "what"
    [0, 1, 1, 1]  # zero "nice", one "pizza", one "is", one "what"
]
```

Each sentence vector is always the same length as the *total* vocabulary size. We have four words in total (across all of our sentences), so each sentence is represented by an array of length four. Each position in the array represents a word, and each value represents how often that word appears in that sentence.

The first sentence contains the word "nice" twice, while the second sentence does not contain the word "nice" at all. According to our mapping, the zeroth element of each array should indicate how often the word nice appears, so the first sentence contains a `2` in the beginning and the second sentence contains a `0` there. 

This representation is called "bag of words" because we lose all of the information represented by the *order* of words. We don't know, for example, that the first sentence starts and ends with "nice", only that it contains the word "nice" twice. 

With real data, these arrays get *very* long. There are millions of words in most languages, so for a big dataset containing most words, each sentence needs to be represented by a very long array, where nearly all values are set to zero (all the words not in that sentence). This could take up a lot of space, but luckily scikit-learn uses a clever sparse-matrix implementation that doesn't quite look like the above, but the overall concept remains the same.

Let's see how to achieve the above using scikit-learn's optimised vectoriser.

First we want to combine all of our "training" data (the data that we'll show the computer along with the correct labels of "positive" or "negative" so that it can learn), so we'll combine our positive and negative texts into one array. Add the following code below the datasets you created.

```python
training_texts = negative_texts + positive_texts
training_labels = ["negative"] * len(negative_texts) + ["positive"] * len(positive_texts)
```

Our dataset now looks like this:

```
['we hate you', 'they hate us', 'you are bad', 'he is bad', 'we hate mary', 'we love you', 'they love us', 'you are good', 'he is good', 'they love mary']
['negative', 'negative', 'negative', 'negative', 'negative', 'positive', 'positive', 'positive', 'positive', 'positive']
```

The two arrays (texts and labels) are associated by index. The first text in the first array is negative, and corresponds to the first label in the second array, and so on.

Now we need a vectoriser to transform the texts into numbers. We can create one in scikit-learn with 

```python
vectorizer = CountVectorizer()
```

Before we can use our vectorizer, it needs to run once through all the data we have so it can build the mapping from words to indices. This is referred to as "fitting" the vectoriser, and we can do it like this:

```python
vectorizer.fit(training_texts)
```

If we want, we can see the mapping it created (which might not be in order, as in the examples we walked through earlier, but each word will have its own index).  We can inspect the vectoriser's vocabulary by adding the line 

```python
print(vectorizer.vocabulary_)
```

(Note the underscore at the end. Scikit-learn uses this as a convention for "helper" attributes. The mapping is explicit only for debugging purposes and you shouldn't need to use it in most cases). My vocabulary mapping looked as follows:

```
{'we': 10, 'hate': 3, 'you': 11, 'they': 8, 'us': 9, 'are': 0, 'bad': 1, 'he': 4, 'is': 5, 'mary': 7, 'love':6, 'good': 2}
```

Behind the scenes, the vectoriser inspected all of our texts, did same basic preprocessing like making everything lowercase, split the text into words using a built-in *tokenization* method, and produced a vocabulary mapping specific to our dataset.

Now that we have a vectorizer that knows what words are in our dataset, we can use it to transform our texts into vectors. Add the following lines of code to your Repl:

```python
training_vectors = vectorizer.transform(training_texts)
testing_vectors = vectorizer.transform(test_texts)
```

The first line creates a list of vectors which represent all of the training texts, still in the same order, but now each text is a vector of numbers instead of a string.

The second line does the same with the test vectors. The machine learning part isn't looking at our test texts (that would be cheating) -- it's just mapping the words to numbers so that it can work with them more easily. Note that when we called `fit()` on the vectoriser, we only showed it the training texts. Because there are words in the test texts that don't appear in the training texts, these words will simply be ignored and will not be represented in `testing_vectors`. 

Now that we have a vectorised representation our problem, let's take a look at how we can solve it.

## Understanding classification

A classifier is a statistical model that tries to predict a label for a given input. In our case, the input is the text and the output is either "positive" or "negative", depending on whether the classifier thinks that the input is positive or negative. 

A machine learning classifier can be "trained". We give it labelled data and it tries to learn rules based on that data. Every time it gets more data, it updates its rules slightly to account for the new information. There are many kinds of classifiers, but one of the simplest is called Decision Tree. 

Decision trees learn a set of yes/no rules by building decisions into a tree structure. Each new input moves down the tree, while various questions are asked one by one. When the input filters all the way to a leaf node in the tree, it acquires a label.

If that's confusing, don't worry! We'll walk through a detailed example with a picture soon to clarify. First, let's show how to get some results using Python.

```python
classifier = tree.DecisionTreeClassifier()
classifier.fit(training_vectors, training_labels)
predictions = classifier.predict(testing_vectors)
print(predictions)
```

Similarly to the vectoriser, we first create a classifier by using the module we imported at the start. Then we call `fit()` on the classifier and pass in our training vectors and their associated labels. The decision tree is going to look at both and attempt to learn rules that separate the two kinds of data. 

Once our classifier is trained, we can call the `predict()` method and pass in previously unseen data. Here we pass in `testing_vectors` which is the list of vectorized test data that the computer didn't look at during training. It has to try and apply the rules it learned from the training data to this new "unseen" data. Machine learning is pretty cool, but it's not magic, so there's no guarantee that the rules we learned will be any good yet.

The code above produces the following output:

```
['positive' 'positive' 'negative' 'positive' 'negative']
```

Let's take a look at our test texts again to see if these predictions match up to reality. 

```
"they love mary"
"they are good"
"why do you hate mary"
"they are almost always good"
"we are very bad"
```

The output maps to the input by index, so the first output label ("positive") matches up to the first input text ("they love mary"), and the last output label ("negative") matches up to the last input text ("we are very bad"). 

It looks like the computer got every example right! It's not a difficult problem to solve. The words "bad" and "hate" appear only in the negative texts and the words "good" and "love", only in the positive ones. Other words like "they", "mary", "you" and "we" appear in both good and bad texts. If our model did well, it will have learned to ignore the words that appear in both kinds of texts, and focus on "good", "bad", "love" and "hate". 

Decision Trees are not the most powerful machine learning model, but they have one advantage over most other algorithms: after we have trained them, we can look inside and see exactly how they work. More advanced models like deep neural networks are nearly impossible to make sense of after training.

Scikit-learn contains a useful "graphviz" helper to inspect tree-based models. Add the following code to the end of your repl.

```python
tree.export_graphviz(
    classifier,
    out_file='tree.dot',
    feature_names=vectorizer.get_feature_names(),
) 
```

This will create an export of the trained model which we can visualise. Look for the new `tree.dot` file in the left-most pane that should have been created after running the above code. 

![repl-file-viewer.png](https://cdn.filestackcontent.com/xWlG01RhTeWzHIObvXnl)

Copy the contents of this file (shown in the middle pane above) to your clipboard and navigate to http://www.webgraphviz.com/. Paste the Tree representation into the big input box on the page you see and press "Generate Graph"

![graph-viz-online.png](https://cdn.filestackcontent.com/SN6CImYtTSOflOntRSeO)

You should see a tree graph that looks as follows.

![decision-tree-vis.png](https://cdn.filestackcontent.com/m9c1SDznSoqGOvDxMdVM)

The above shows a decision tree that only learned two rules. The first rule (top square) is about the word "hate". The rule is "is the number of times 'hate' occurs in this sentence less than or equal to 0.5". None of our sentences contain duplicate words, so each rule will really be only about whether the word appears or not (you can think of the `<= 0.5` rules as `< 1` in this case).

For each question in our training dataset, we can ask if the first rule is True or False. If the rule is True for a given sentence, we'll move that sentence down the tree left (following the "True" arrow). If not, we'll go right (following the "False" arrow).

Once we've asked this first question for each sentence in our dataset, we'll have three sentences for which the answer is "False", because three of our training sentences contain the word "hate". These three sentences go right in the decision tree and end up at first leaf node (an end node with no arrows coming out the bottom). This leaf node has `value = [3, 0]` in it, which means that three samples reach this node, and three belong to the negative class and zero to the positive class.

For each sentence where the first rule is "True" (the word "hate" appears less than 0.5 times, or in our case 0 times), we go down the left of the tree, to the node where `value = [2,5]`. This isn't a leaf node (it has more arrows coming out the bottom), so we're not done yet. At this point we have two negative sentences and all five positive sentences still.

The next rule is "bad <= 0.5". In the same way as before, we'll go down the right path if we have more than 0.5 occurrences of "bad" and left if we have fewer than 0.5 occurrences of "bad". For the last two negative sentences that we are still evaluating (the two containing "bad"), we'll go *right* and end up at the node with `value=[2,0]`. This is another leaf node and when we get here we have two negative sentences and zero positive ones.

All other data will go left, and we'll end up at `[0,5]`, or zero negative sentences and five positive ones. 

As an exercise, take each of the test sentences (not represented in the annotated tree above) and try to follow the set of rules for each one. If it ends up in a bucket with more negative sentences than positive ones (either of the right branches), it'll be predicted as a negative sentence. If it ends up in the left-most leaf node, it'll be predicted as a positive sentence.

## Building a manual classifier

When the task at hand is this simple, it's often easier to write a couple of rules manually rather than using Machine Learning. For this dataset, we could have achieved the same result by writing the following code.

```python
def manual_classify(text):
    if "hate" in text:
        return "negative"
    if "bad" in text:
        return "negative"
    return "positive"

predictions = []
for text in test_texts:
    prediction = manual_classify(text)
    predictions.append(prediction)
print(predictions)
```

Here we have replicated the decision tree above. For each sentence, we check if it contains "hate" and if it does we classify it as negative. If it doesn't, we check if it contains "bad", and if it does, we classify it as negative. All other sentences are classified as positive. 

So what's the difference between machine learning and traditional rule-based models like this one? The main advantage of learning the rules directly is that it doesn't really get more difficult as the dataset grows. Our dataset was trivially simple, but a real-world dataset might need thousands or millions of rules, and while we could write a more complicated set of if-statements "by hand", it's much easier if we can teach machines to learn these by themselves.

Also, once we've perfected a set of manual rules, they'll still only work for a single dataset. But once we've perfected a machine learning model, we can use it for many tasks, simply by changing the input data!

In the example we walked through, our model was a perfect student and learned to correctly classify all five unseen sentences, this is not usually the case for real-world settings. Because machine learning models are based on probability, the goal is to make them as accurate as possible, but in general you will not get 100% accuracy. Depending on the problem, you might be able to get higher accuracy by hand-crafting rules yourself, so machine learning definitely isn't the correct tool to solve all classification problems. 

Try the code on bigger datasets to see how it performs. There is no shortage of interesting data sets to experiment with. I wrote another machine learning walkthrough [here](https://www.codementor.io/garethdwyer/introduction-to-machine-learning-with-python-s-scikit-learn-czha398p1) that shows how to use a larger clickbait dataset to teach a machine how to classify between clickbait articles and real ones, using similar methods to those described above. That tutorial uses an SVM classifier and a more advanced vectorisation method, but see if you can load the dataset from there into the classifier we built in this tutorial and compare the results.

You can fork this repl here: [https://repl.it/@GarethDwyer1/machine-learning-intro](https://repl.it/@GarethDwyer1/machine-learning-intro) to keep hacking on it (it's the same code as we walked through above but with some comments added.) If you prefer, the entire program is shown below so you can copy paste it and work from there.

If you want to try your hand at machine learning, join the [repl.it AI competition](https://repl.it/talk/challenge/AI/10058) that is running until 11 February. You can get general help by joining the Repl [discord channel](https://discord.gg/QWFfGhy), or if you have questions specifically about this tutorial feel free to leave a comment below or to [tweet at me](https://twitter.com/sixhobbits). 

```python
from sklearn import tree
from sklearn.feature_extraction.text import CountVectorizer

positive_texts = [
    "we love you",
    "they love us",
    "you are good",
    "he is good",
    "they love mary"
]

negative_texts =  [
    "we hate you", 
    "they hate us",
    "you are bad",
    "he is bad",
    "we hate mary"
]

test_texts = [
    "they love mary",
    "they are good",
    "why do you hate mary",
    "they are almost always good",
    "we are very bad"
]

training_texts = negative_texts + positive_texts
training_labels = ["negative"] * len(negative_texts) + ["positive"] * len(positive_texts)

vectorizer = CountVectorizer()
vectorizer.fit(training_texts)
print(vectorizer.vocabulary_)

training_vectors = vectorizer.transform(training_texts)
testing_vectors = vectorizer.transform(test_texts)

classifier = tree.DecisionTreeClassifier()
classifier.fit(training_vectors, training_labels)

print(classifier.predict(testing_vectors))

tree.export_graphviz(
    classifier,
    out_file='tree.dot',
    feature_names=vectorizer.get_feature_names(),
) 

def manual_classify(text):
    if "hate" in text:
        return "negative"
    if "bad" in text:
        return "negative"
    return "positive"

predictions = []
for text in test_texts:
    prediction = manual_classify(text)
    predictions.append(prediction)
print(predictions)
```
