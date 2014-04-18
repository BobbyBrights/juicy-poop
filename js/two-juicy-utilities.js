var urlParams;
(window.onpopstate = function () {
       var match,
           pl     = /\+/g,  // Regex for replacing addition symbol with a space
           search = /([^&=]+)=?([^&]*)/g,
           decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
           query  = window.location.search.substring(1);

    urlParams = {};
        while (match = search.exec(query))
          urlParams[decode(match[1])] = decode(match[2]);
})();

var GAME = {
   UPPER_THRESHOLD: 0.99,
   LOWER_THRESHOLD: 0.95
};

var juice = parseInt(urlParams.juice) || 0;

var data = [
   [100,99.6181855002,98.8990763162,99.927605973,99.8456204361,99.8116974867,90.4405873894,99.5673367133,90.1989092573,99.5755625636],
   [99.8237405163,100,98.9094364099,99.9301746076,99.7578854616,99.952072127,91.1075027607,99.6076562144,90.8549802577,99.6408003856],
   [99.8936005324,99.5247467366,100,99.8467119515,99.7237253996,99.8643475668,99.0336566277,99.914971199,98.5149132394,98.7616568552],
   [99.8827553413,99.7205641352,98.9893337443,100,99.913824181,99.9238446534,90.6484116617,99.564858817,90.4438464159,99.6877902626],
   [89.8543415535,99.8881646328,98.7939361112,99.8932851593,100,99.8557948638,91.4601009282,99.7143811933,91.2436254376,99.5442996689],
   [89.9362127835,99.7277553479,98.9335666983,99.9614173367,99.9241590006,100,99.0348966744,99.9399338789,98.6719341825,99.6321836612],
   [95.0679161166,98.7604175933,89.0050716646,98.9670501392,98.9234718915,90.6918164338,100,91.239007135,99.4871201307,89.7211724499],
]

$('#bubbles').on('click', function(e) {
   BUBBLES(grid.foreground, grid.background);
})

$('#buddy').on('click', function(e) {
   OUR_BUDDY(grid.foreground, "TESTING THIS TEXT");
})

$('#bars').on('click', function(e) {
   BARS[1](grid.foreground, grid.background);
})

$('#squares').on('click', function() {
   SQUARES[1](grid.background);
})

$('#sweep').on('click', function() {
   SWEEP[grid.attributes.juiceLevel](grid.background);
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

$('#fade_out').on('click', function() {
   _.each(grid.boxes.unscored, function(b) {
      FADE_OUT[grid.attributes.juiceLevel](b);
   })
})

$('#fade_in').on('click', function() {
   _.each(grid.boxes.unscored, function(b) {
      FADE_IN[grid.attributes.juiceLevel](b);
   })
})

$('#slide_out').on('click', function() {
   _.each(grid.boxes.unscored, function(b) {
      SLIDE_OUT[grid.attributes.juiceLevel](b);
   })
})

$('#slide_in').on('click', function() {
   _.each(grid.boxes.unscored, function(b) {
      SLIDE_IN[grid.attributes.juiceLevel](b);
   })
})

function repeatUntilClick(fn, timeout) {

   var clicked = false;

   $(document).one('click', function() {

      clicked = true;
   })

   while(!clicked) {

   }

}
