// Make an instance of two and place it on the page.
var elem = document.querySelector('body');
var params = { width: 500, height: 500 };
var two = new Two(params).appendTo(elem);

two.bind('mousemove', function(e) {

   console.log(e);
})

if(urlParams.data === undefined || urlParams.juice === undefined) {
   alert('invalid url');
}

var data = CSV.parse(urlParams.data);

var juice = parseInt(urlParams.juice);

//make weird data nice 
for(var i = 0; i < data.length; i++) {
   for(var j = 0; j < data[i].length; j++) {
      data[i][j] = parseInt(data[i][j]);
   }
}

console.log(data);

var grid = new Grid(5, 400, data, juice);
var mouse = new Two.Vector();

two.bind('update', function(frameCount) {
   TWEEN.update();
}).play();

var svg = $('svg').offset();

$(window)
.on('mousemove', function(e) {
   mouse.x = e.clientX - svg.left;
   mouse.y = e.clientY - svg.top;

   grid.handleMousemove(mouse);

})
.on('mousedown', function(e) {

   mouse.x = e.clientX - svg.left;
   mouse.y = e.clientY - svg.top;

   grid.handleMousedown(mouse);
})
.on('mouseup', function(e) {
   grid.deselect();
});
