(function ($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
    if (
      location.pathname.replace(/^\//, "") ==
        this.pathname.replace(/^\//, "") &&
      location.hostname == this.hostname
    ) {
      var target = $(this.hash);
      target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
      if (target.length) {
        $("html, body").animate(
          {
            scrollTop: target.offset().top - 48
          },
          1000,
          "easeInOutExpo"
        );
        return false;
      }
    }
  });
})(jQuery); // End of use strict

//drawing canvas
canvas = document.querySelector("canvas");
let rect = canvas.getBoundingClientRect();
c = canvas.getContext("2d");

var socket = io.connect();
var radius = 3;
var ink = false;
var someoneElseDrawing = false;
c.lineWidth = 2 * radius;

var start = function (event) {
  ink = true;
  rect = canvas.getBoundingClientRect();
  draw(event);
};

var stop = function (event) {
  socket.emit("stopDrawLine");
  ink = false;
  c.beginPath();
};

var draw = function (event) {
  mouseX =
    ((event.clientX - rect.left) / (rect.right - rect.left)) * canvas.width;
  mouseY =
    ((event.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height;
  if (ink === true && someoneElseDrawing === false) {
    socket.emit("drawLine", { x: mouseX, y: mouseY });
    c.lineTo(mouseX, mouseY);
    c.stroke();
    c.beginPath();
    c.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.moveTo(mouseX, mouseY);
  }
};

var clear = function () {
  c.clearRect(0, 0, canvas.width, canvas.height);
  socket.emit("clearBoard");
};

socket.on("drawLine", function (data) {
  someoneElseDrawing = true;
  document.getElementById("canvasCaption").innerHTML = "Someone is drawing...";
  c.lineTo(data.x, data.y);
  c.stroke();
  c.beginPath();
  c.arc(data.x, data.y, radius, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.moveTo(data.x, data.y);
});

socket.on("stopDrawLine", function (data) {
  c.beginPath();
  someoneElseDrawing = false;
  document.getElementById("canvasCaption").innerHTML = "...";
});

socket.on("clearBoard", function (data) {
  c.clearRect(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener("mousedown", start);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stop);
document.getElementById("clearBtn").addEventListener("click", clear);
