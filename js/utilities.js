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

function colorToString(color) {
   return 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';
         }

         function randomInt(beginRange, endRange) {
            return Math.floor(Math.random() * (endRange-beginRange) + beginRange);
         }

         function randomChoice(array) {
            return array[Math.floor(Math.random() * array.length)];
         }

         function randomBool() {
            return Math.random() > 0.5 ? true: false;
         }

         colors = 
         {
            0: {
                  FILL: {
                           UPPER_THRESHOLD: { r: 200, g: 200, b: 200, a: 1 },
          LOWER_THRESHOLD: { r: 100, g: 100, b: 100, a: 1 },
          BELOW_THRESHOLD: { r: 20, g: 20, b: 20, a: 1 },
                        },
                  SHADOW: {
                             UPPER_THRESHOLD: { r: 30, g: 110, b: 110, a: 0.5 },
                             LOWER_THRESHOLD: { r: 105, g: 35, b: 40, a: 0.5 },
                             BELOW_THRESHOLD: { r: 30, g: 25, b: 30, a: 0.5 },
                          },
                  STROKE: {
                             UPPER_THRESHOLD: { r: 255, g: 255, b: 255, a: 0 },
                             LOWER_THRESHOLD: { r: 255, g: 255, b: 255, a: 0 },
                             BELOW_THRESHOLD: { r: 255, g: 255, b: 255, a: 0 } 
                          },
                  FACE: {
                           UPPER_THRESHOLD: { r: 255, g: 255, b: 255, a: 1 },
                           LOWER_THRESHOLD: { r: 255, g: 255, b: 255, a: 1 },
                           BELOW_THRESHOLD: { r: 255, g: 255, b: 255, a: 0 } 
                        },
                  BACKGROUND_FILL: [
                  { r: 210, g: 157, b: 225, a: 1 },
                  { r: 193, g: 157, b: 172, a: 1 },
                  { r: 229, g: 233, b: 231, a: 1 },
                  { r: 230, g: 230, b: 110, a: 1 },
                  { r: 228, g: 201, b: 77, a: 1 },
                  ]
               },
            1: {
                  FILL: {
                           UPPER_THRESHOLD: { r: 60, g: 218, b: 228, a: 0.95 },
                           //LOWER_THRESHOLD: { r: 60, g: 218, b: 228, a: 0.95 },
                           LOWER_THRESHOLD: { r: 214, g: 73, b: 80, a: 0.95 },
                           BELOW_THRESHOLD: { r: 62, g: 58, b: 65, a: 0.95 },
                        },
                  SHADOW: {
                             UPPER_THRESHOLD: { r: 30, g: 110, b: 110, a: 0.5 },
                             LOWER_THRESHOLD: { r: 105, g: 35, b: 40, a: 0.5 },
                             BELOW_THRESHOLD: { r: 30, g: 25, b: 30, a: 0.5 },
                          },
                  STROKE: {
                             UPPER_THRESHOLD: { r: 255, g: 255, b: 255, a: 0 },
                             LOWER_THRESHOLD: { r: 255, g: 255, b: 255, a: 0 },
                             BELOW_THRESHOLD: { r: 255, g: 255, b: 255, a: 0 } 
                          },
                  FACE: {
                           UPPER_THRESHOLD: { r: 255, g: 255, b: 255, a: 1 },
                           LOWER_THRESHOLD: { r: 255, g: 255, b: 255, a: 1 },
                           BELOW_THRESHOLD: { r: 255, g: 255, b: 255, a: 0 } 
                        },
                  BACKGROUND_FILL: [
                  { r: 210, g: 157, b: 225, a: 1 },
                  { r: 193, g: 157, b: 172, a: 1 },
                  { r: 229, g: 233, b: 231, a: 1 },
                  { r: 230, g: 230, b: 110, a: 1 },
                  { r: 228, g: 201, b: 77, a: 1 },
                  ]
               },
            2: {
               }
         }

function generate(radius, amount) {

   return _.map(_.range(amount), function(i) {
      var pct = i / amount;
      var angle = (pct * Math.PI * 2);
      var x = radius * Math.cos(angle);
      var y = radius * Math.sin(angle);
      var anchor = new Two.Anchor(x, y);
      anchor.origin = new Two.Vector().copy(anchor);
      return anchor;
   });
}
