//  Generic scroll to function implementation
import { scrollTo } from "./partials/smoothScroll.js";

// Scroll to element functionality

document.getElementById("learnmore").addEventListener("click", scroll);

function scroll() {
  scrollTo(document.querySelectorAll(".marketing")[0], 200);
}
