//How to use
// scrollTo(document.querySelectorAll('.YOUR CLASS/ID/SELECTOR HERE')[0]THIS IS IF MULTIPLE CLASSES, 200 THIS IS SPEED);

export const scrollTo = (to, duration = 500) => {
  // t = current time
  // b = start value
  // c = change in value
  // d = duration
  const easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) {
      return (c / 2) * t * t + b;
    }
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  return new Promise((resolve) => {
    const element = document.scrollingElement;

    if (typeof to === "string") {
      to = document.querySelector(to);
    }
    if (typeof to !== "number") {
      to = to.getBoundingClientRect().top + element.scrollTop - 100;
    }

    const start = element.scrollTop;
    const change = to - start;
    let currentTime = 0;
    const increment = 20;

    const animateScroll = function () {
      currentTime += increment;
      const val = easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      } else {
        resolve();
      }
    };
    animateScroll();
  });
};
