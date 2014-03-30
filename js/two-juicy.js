// Make an instance of two and place it on the page.
var elem = document.querySelector('body');
var params = { id: "two", width: 500, height: 500 };
var two = new Two(params).appendTo(elem);


var GAME = {
   UPPER_THRESHOLD: 0.99,
   LOWER_THRESHOLD: 0.95
};

if(urlParams.data === undefined || urlParams.juice === undefined) {
   alert('invalid url');
}

//make everything numbers 
var juice = parseInt(urlParams.juice);
var data = CSV.parse(urlParams.data);
for(var i = 0; i < data.length; i++) {
   for(var j = 0; j < data[i].length; j++) {
      data[i][j] = parseFloat(data[i][j]);
   }
}

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


var grid = new Grid(data.length, 400, data, juice);
var mouse = new Two.Vector();

two.bind('update', function(frameCount) {
   TWEEN.update();
}).play();

$('document').ready(function() {
   
   var svg = $('svg:last').offset();
   console.log(svg);

   $(window)
   .on('mousemove', function(e) {
      e.preventDefault();
      mouse.x = e.clientX - svg.left;
      mouse.y = e.clientY - svg.top;

      grid.handleMousemove(mouse);

   })
   .on('mousedown', function(e) {
      e.preventDefault();

      mouse.x = e.clientX - svg.left;
      mouse.y = e.clientY - svg.top;

      grid.handleMousedown(mouse);
   })
   .on('mouseup', function(e) {
      e.preventDefault();
      grid.handleMouseup(mouse);
   });

})
