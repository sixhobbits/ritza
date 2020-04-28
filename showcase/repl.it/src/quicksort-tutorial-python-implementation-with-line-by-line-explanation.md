# Quicksort tutorial: Python implementation with line by line explanation

In this tutorial, we'll be going over the [Quicksort](https://en.wikipedia.org/wiki/Quicksort) algorithm with a line-by-line explanation. We're going to assume that you already know at least something about [sorting algorithms](https://en.wikipedia.org/wiki/Sorting_algorithm), and have been introduced to the idea of Quicksort, but understandably you find it a bit confusing and are trying to better understand how it works.

We're also going to assume that you've covered some more fundamental computer science concepts, especially [recursion](https://en.wikipedia.org/wiki/Recursion#In_computer_science), which Quicksort relies on.

To recap, Quicksort is one of the most efficient and most commonly used algorithms to sort a list of numbers. Unlike its competitor Mergesort, Quicksort can sort a list in place, saving the need to create a copy of the list, and therefore saving on memory requirements. 

The main intuition behind Quicksort is that if we can efficiently *partition* a list, then we can efficiently sort it. Partitioning a list means that we pick a *pivot* item in the list, and then modify the list to move all items larger than the pivot to the right and all smaller items to the left. 

Once the pivot is done, we can do the same operation to the left and right sections of the list recursively until the list is sorted.

Here's a Python implementation of Quicksort. Have a read through it and see if it makes sense. If not, read on below!

```python
def partition(xs, start, end):
    follower = leader = start
    while leader < end:
        if xs[leader] <= xs[end]:
            xs[follower], xs[leader] = xs[leader], xs[follower]
            follower += 1
        leader += 1
    xs[follower], xs[end] = xs[end], xs[follower]
    return follower

def _quicksort(xs, start, end):
    if start >= end:
        return
    p = partition(xs, start, end)
    _quicksort(xs, start, p-1)
    _quicksort(xs, p+1, end)
    
def quicksort(xs):
    _quicksort(xs, 0, len(xs)-1)
```

## The Partition algorithm

The idea behind partition algorithm seems really intuitive, but the actual algorithm to do it efficiently is pretty counter-intuitive. 

Let's start with the easy part -- the idea. We have a list of numbers that isn't sorted. We pick a point in this list, and make sure that all larger numbers are to the *right* of that point and all the smaller numbers are to the *left*. For example, given the random list:

```python
xs = [8, 4, 2, 2, 1, 7, 10, 5]
```

We could pick the *last* element (5) as the pivot point. We would want the list (after partitioning) to look as follows:

```python
xs = [4, 2, 2, 1, 5, 7, 10, 8]
```

Note that this list isn't sorted, but it has some interesting properties. Our pivot element, `5`, is in the correct place (if we sort the list completely, this element won't move). Also, all the numbers to the left are smaller than `5`and all the numbers to the right are greater. 

Because `5` is the in the correct place, we can ignore it after the partition algorithm (we won't need to move it again). This means that if we can sort the two smaller sublists to the left and right of `5`() `[4, 2, 2, 1]` and `[7, 10, 8]`) then the entire list will be sorted. Any time we can efficiently break a problem into smaller sub-problems, we should think of *recursion* as a tool to solve our main problem. Using recursion, we often don't even have to think about the entire solution. Instead, we define a base case (a list of length 0 or 1 is always sorted), and a way to divide a larger problem into smaller ones (e.g. partitioning a list in two), and almost by magic the problem solves itself!

But we're getting ahead of ourselves a bit. Let's take a look at how to actually implement the partition algorithm on its own, and then we can come back to using it to implement a sorting algorithm.

### A bad partition implementation

You could probably easily write your own `partition` algorithm that gets the correct results without referring to any textbook implementations or thinking about it too much. For example:

```python
def bad_partition(xs):
    smaller = []
    larger = []
    pivot = xs.pop()
    for x in xs:
        if x >= pivot:
            larger.append(x)
        else:
            smaller.append(x)
    return smaller + [pivot] + larger
```

In this implementation, we set up two temporary lists (`smaller` and `larger`). We then take the `pivot` element as the last element of the list (`pop` takes the last element and removes it from the original `xs` list). 

We then consider each element `x` in the list `xs`. The ones that are smaller than are partition we store in the `smaller` temporary list, and the others go to the `larger` temporary list. Finally, we combine the two lists with the pivot item in the middle, and we have partitioned our list.

This is much easier to read than the implementation at the start of this post, so why don't we do it like this? 

The primary advantage of Quicksort is that it is an *in place* sorting algorithm. Although for the toy examples we're looking at, it might not seem like much of an issue to create a few copies of our list, if you're trying to sort terrabytes of data, or if you are trying to sort any amount of data on a very limited computer (e.g a smartwatch), then you don't want to needlessly copy arrays around.

In Computer Science terms, this algorithm has a space-complexity of `O(2n)`, where `n` is the number of elements in our `xs` array. If we consider our example above of `xs = [8, 4, 2, 2, 1, 7, 10, 5]`, we'll need to store all 8 elements in the original `xs` array as well as three elements (`[7, 10, 8]`] in the `larger` array and four elements (`[4, 2, 2, 1]`) in the `smaller` array. This is a waste of space! With some clever tricks, we can do a series of swap operations on the original array and not need to make any copies at all.

### Overview of the actual partition implementation

Let's pull out a few key parts of the good `partition` function that might be especially confusing before getting into the detailed explanation. Here it is again for reference.

```python
def partition(xs, start, end):
    follower = leader = start
    while leader < end:
        if xs[leader] <= xs[end]:
            xs[follower], xs[leader] = xs[leader], xs[follower]
            follower += 1
        leader += 1
    xs[follower], xs[end] = xs[end], xs[follower]
    return follower
```

In our good `partition` function, you can see that we do some swap operations (lines 5 and 8) on the `xs` that is passed in, but we never allocate any new memory. This means that the storage remains constant to the size of `xs`, or `O(n)` in Computer Science terms. That is, this algorithm has *half* the space requirement of the "bad" implementation above, and should therefore allow us to sort lists that are twice the size using the same amount of memory. 

The confusing part of this implementation is that although everything is based around our pivot element (the last item of the list in our case), and although the pivot element ends up somewhere in the middle of the list at the end, we don't actually touch the pivot element *until the very last swap*.

Instead, we have two other counters (`follower` and `leader`) which move around the smaller and bigger numbers in a clever way and implicitly keep track of where the pivot element should end up. We then switch the pivot element into the correct place at the end of the loop (line 8). 

The `leader` is just a loop counter. Every iteration it increments by one until it gets to the pivot element (the end of the list). The follower is more subtle, and it keeps count of the number of swap iterations we do, moving up the list more slowly than the leader, tracking where our pivot element should eventually end up.

The other confusing part of this algorithm is on line 4. We move through the list from left to right. All numbers are currently to the *left* of the pivot but we eventually want the "big" items to end up on the *right*. 

Intuitively then you would expect us to do the swapping action when we find an item that is *larger* than the pivot, but in fact, we do the opposite. When we find items that are *smaller* than the pivot, we swap the leader and the follower. 

You can think of this as pushing the small items further to the left. Because the leader is always ahead of the follower, when we do a swap, we are swapping a small element with one further left in the list. The follower only looks at "big" items (ones that the leader has passed over without action), so when we do the swap, we're swapping a small item (leader) with a big one (follower), meaning that small items will move towards the left and large ones towards the right. 

### Line by line examination of partition

We define `partition` with three arguments, `xs` which is the list we want to sort, `start` which is the index of the first element to consider and  `end` which is the index of the last element to consider. 

We need to define the `start` and `end` arguments because we won't always be partitioning the entire list. As we work through the sorting algorithm later, we are going to be working on smaller and smaller sublists, but because we don't want to create new copies of the list, we'll be defining these sublists by using indexes to the original list. 

In line 2, we start off both of our pointers -- `follower`, and `leader` -- to be the same as the beginning of the segment of the list that we're interested in. The leader is going to move faster than the follower, so we'll carry on looping until the leader falls off the end of the list segment (`while leader < end`). 

We could take any element we want as a pivot element, but for simplicity, we'll just choose the last element. In line 4 then, we compare the `leader` element to the pivot. The leader is going to step through each and every item in our list segment, so this means that when we're done, we'll have compared the partition with every item in the list. 

If the `leader` element is smaller or equal to the pivot element, we need to send it further to the left and bring a larger item (tracked by `follower`) further to the right. We do this in lines 4-5, where if we find a case where the `leader` is smaller or equal to the pivot, we swap it with the `follower`. At this point, the follower is pointing at a small item (the one that was `leader` a moment ago), so we increment `follower` by one in order to track the next item instead. This has a side effect of counting how many swaps we do, which incidentally tracks the exact place that our pivot element should eventually end up. 

Whether or not we did a swap, we want to consider the next element in relation to our pivot, so in line 7 we increment `leader`. 

Once we break out of the loop (line 8), we need to swap the pivot item (still on the end of the list) with the `follower` (which has moved up one for each element that was smaller than the pivot). If this is still confusing, look at our example again: 

```python
xs = [8, 4, 2, 2, 1, 7, 10, 5]
```

In `xs`, there are 4 items that are smaller than the pivot. Every time we find an item that is smaller than the pivot, we increment `follower` by one. This means that at the end of the loop, follower will have incremented 4 times and be pointing at index 4 in the original list. By inspection, you can see that this is the correct place for our pivot element (5). 

The last thing we do is return the follower index, which now points to our pivot element in its *correct* place. We need to return this as it defines the two smaller sub-problems in our partitioned list - we now want to sort`xs[0:4]` (the first 4 items, which form an unsorted list) and the `xs[5:]` (the last 3 items, which form an unsorted list). 

```python
xs = [4, 2, 2, 1, 5, 7, 10, 8]
```

If you want another way to visualise exactly how this works, going over some examples by hand (that is, writing out a short randomly ordered list with a pen and paper, and writing out the new list at each step of the algorithm) is very helpful. You can also watch [this detailed YouTube video](https://www.youtube.com/watch?v=MZaf_9IZCrc) where KC Ang demonstrates every step of the algorithm using paper cups in under 5 minutes!

## The Quicksort function

Once we get the partition algorithm right, sorting is easy. We'll define a helper `_quicksort` function first to handle the recursion and then implement a prettier public function after.

```python
def _quicksort(xs, start, end):
    if start >= end:
        return
    p = partition(xs, start, end)
    _quicksort(xs, start, p-1)
    _quicksort(xs, p+1, end)
```

To sort a list, we partition it (line 4), sort the left sublist (line 5: from the start of the original list up to the pivot point), and then sort the right sublist (line 6: from just after the pivot point to the end of the original list). We do this recursively with the `end` boundary moving left, closer to `start`, for the left sublists and the `start` boundary moving right, closer to `end`, for the right sublists. When the start and end boundaries meet (line 2), we're done!

The first call to Quicksort will always be with the entire list that we want sorted, which means that `0` will be the start of the list and `len(xs)-1` will be the end of the list. We don't want to have to remember to pass these extra arguments in every time we call Quicksort from another program (e.g. in any case where it is not calling itself), so we'll make a prettier wrapper function with these defaults to get the process started.

```python
def quicksort(xs):
    return _quicksort(xs, 0, len(xs)-1)
```

Now we, as users of the sorting function, can call `quicksort([4,5,6,2,3,9,10,2,1,5,3,100,23,42,1])`, passing in only the list that we want sorted. This will in turn go and call the `_quicksort` function, which will keep calling itself until the list is sorted.

## Testing our algorithm

We can write some basic driver code to take our newly implemented Quicksort out for a spin. The code below generates a random list of 100 000 numbers and sorts this list in around 5 seconds.

```python
from datetime import datetime
import random

# create 100000 random numbers between 1 and 1000 
xs = [random.randrange(1000) for _ in range(100000)]

# look at the first few and last few
print(xs[:10], xs[-10:])

# start the clock
t1 = datetime.now()
quicksort(xs)
t2 = datetime.now()
print("Sorted list of size {} in {}".format(len(xs), t2 - t1))

# have a look at the results
print(xs[:10], xs[-10:])
```

If you want to try this code out, visit my Repl at [https://repl.it/@GarethDwyer1/quicksort](https://repl.it/@GarethDwyer1/quicksort?language=python3). You'll be able to run the code, see the results, and even fork it to continue developing or testing it on your own. 

Also have a look at [https://repl.it/@GarethDwyer1/sorting](https://repl.it/@GarethDwyer1/sorting) where I show how Quicksort compares to some other common sorting algorithms.

If you need help, the folk over at the [Repl discord server](https://discordapp.com/invite/QWFfGhy) are very friendly and keen to help people learn. Also feel free to drop a comment below, or to [follow me on Twitter](https://twitter.com/sixhobbits) and ask me questions there.
