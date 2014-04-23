// Make an instance of two and place it on the page.
var elem = document.querySelector('#game-container');
var params = { id: "two", width: 600, height: 600 };
var two = new Two(params).appendTo(elem);

var assets = [];

$('#assets svg').each(function(i, el) {
   var shape = two.interpret(el).center();
   shape.noStroke();
   shape.visible = false;
   assets.push(shape);
   _.each(shape.children, function(child) {
      _.each(child.vertices, function(v) {
         v.ox = v.x;
         v.oy = v.y;
      });
   });
});

var background = two.makeGroup();
var middleground = two.makeGroup();
var foreground = two.makeGroup();

background.translation.set(two.width/2, two.width/2);
middleground.translation.set(two.width/2, two.width/2);
foreground.translation.set(two.width/2, two.width/2);

//var grid = new Grid(data.length, 500, data, juice);
var grid;
var splash;
var mouse = new Two.Vector();

two.bind('update', function(frameCount) {
   TWEEN.update();
}).play();


var svg = $('svg:last').offset();

$(document).ready(function() {
   splash = new Splash(middleground, background, foreground);

   $('#game-container *').addClass('juice-'+juice);
   $('#game-container .next').on('mousedown', function() {
      splash.nextTutorial();
   })
})
