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

var sweepground = two.makeGroup();
var background = two.makeGroup();
var middleground = two.makeGroup();
var foreground = two.makeGroup();

sweepground.translation.set(two.width/2, two.width/2);
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


var svg = $('#game-container').offset();

console.log(svg);

$(document).ready(function() {
   setTimeout(function() {
      splash = new Splash(middleground, background, foreground);
   }, 500);

   $('#game-container *').addClass('juice-'+juice);
   $('#game-container .next').on('mousedown', function(e) {
      e.stopPropagation();
      e.preventDefault();
      splash.nextTutorial();
   })


   if(juice == 0 && ab == 1) {
      $('a.tutorial-form-link').attr('href', 'https://docs.google.com/forms/d/1Tr-ylX5xNNuxB1NZN-bHRXLpoPF-x9ZCtHvZwhBhnS8/viewform?usp=send_form');
      $('a.final-form-link').attr('href', 'https://docs.google.com/forms/d/1bGVEfkIEcujAn4XLoF_wa9ectCzxvmICf3ewQDms44o/viewform?usp=send_form');
      
   } else if(juice == 1 && ab == 1) {
      $('a.final-form-link').attr('href', 'ab yes juice yes');
      
   } else if(juice == 1 && ab == 0) {

      $('a.final-form-link').attr('href', 'ab no juice yes');

   } else {
      $('a.final-form-link').attr('href', 'ab no juice no');
   }
})
