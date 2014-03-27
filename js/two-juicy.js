// Make an instance of two and place it on the page.
var elem = document.querySelector('body');
var params = { width: 500, height: 500 };
var two = new Two(params).appendTo(elem);

var grid = new Grid(5, 400, [3,2,1,4,0]);
var mouse = new Two.Vector();

two.bind('update', function(frameCount) {
   TWEEN.update();

   if(grid.highlighted.animation) {
      grid.highlighted.animation();
   }
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
