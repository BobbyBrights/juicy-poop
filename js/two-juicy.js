// Make an instance of two and place it on the page.
var elem = document.querySelector('#game-container');
var params = { id: "two", width: 500, height: 500 };
var two = new Two(params).appendTo(elem);


var GAME = {
   UPPER_THRESHOLD: 0.99,
   LOWER_THRESHOLD: 0.95
};

if(urlParams.data === undefined || urlParams.juice === undefined) {
   console.log('bad data');
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

$('#squares').on('click', function() {
   SQUARES[1](grid.background);
})

$('#sweep').on('click', function() {
   SWEEP[0](grid.background);
})

$('#slide').on('click', function() {
   SLIDE[0](grid.foreground, grid.background);
})

$('#splat').on('click', function() {
   SPLAT[0](grid.foreground, grid.background);
})
$('#ripple').on('click', function() {
   RIPPLE[0](grid.foreground, grid.background);
})

$('#jump').on('click', function() {
   JUMP[0](grid.foreground, grid.background);
})

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
