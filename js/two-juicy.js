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

//var grid = new Grid(data.length, 500, data, juice);
var grid;
var mouse = new Two.Vector();

two.bind('update', function(frameCount) {
   TWEEN.update();
}).play();


var svg = $('svg:last').offset();
console.log(svg);

$('document').ready(function() {
   

   $(window)
   .one('click', function(e) {
      e.preventDefault();

      mouse.x = e.clientX - svg.left;
      mouse.y = e.clientY - svg.top;

      startTutorial(mouse);
   })
})
