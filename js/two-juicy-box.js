function colorToString(color) {
   return 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';
}

function getColor(row, col, datum, juiceLevel) {

   var r,g,b;

   if(juiceLevel == 0) {

      if(datum > GAME.UPPER_THRESHOLD) {

         r = 200;
         g = 200;
         b = 200;

      } else if (datum > GAME.LOWER_THRESHOLD) {

         r = 100;
         g = 100;
         b = 100;

      } else {
         r = 50;
         g = 50;
         b = 50;
      }

   } else if(juiceLevel == 1) {

      if(datum > GAME.UPPER_THRESHOLD) {

         r = 225 + (5 * row) + (5 * col) + Math.floor((5 * Math.random() + 5));
         g = 87;
         b = 53 + (2 * row) - (5 * col) + Math.floor((5 * Math.random() + 5));


      } else if (datum > GAME.LOWER_THRESHOLD) {

         r = 236;
         g = 234;
         b = 147;

      } else {

         r = 296;
         g = 214;
         b = 205;
      }


   } else if(juiceLevel == 2) {

      if(datum > GAME.UPPER_THRESHOLD) {

         r = 0;
         g = 255;
         b = 0;


      } else if (datum > GAME.LOWER_THRESHOLD) {

         r = 255;
         g = 0;
         b = 0;

      } else {

         r = 0;
         g = 0;
         b = 255;
      }

   }

   return { r: r, g: g, b: b, a: 0.75 };

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

function Box(grid, row, col, width, datum) {
   this.row = row;
   this.col = col;
   this.datum = datum;

   this.origin = {};
   this.origin.color = getColor(this.row, this.col, this.datum, grid.attributes.juiceLevel);
   this.origin.points = generate(width, 4);
   this.origin.linewidth = 1;
   this.origin.stroke = "black";
   this.origin.translation = new Two.Vector(grid.vectors[this.col].x, grid.vectors[this.row].y);
   this.origin.rotation = Math.PI / 4;
   this.origin.scale = 1;
   this.origin.opacity = 1;

   this.disabled = {
      move: false,
      highlight: false,
      big: false,
   }

   this.tween = {
      move: undefined,
      highlight: undefined,
      big: undefined,
   };

   this.shape = new Two.Polygon(this.origin['points'], true);
   this.shape['opacity'] = 0;


   return this;
}


Box.prototype.setTranslation = function() {

   this.shape['translation'].set(
      this.origin['translation'].x, 
      this.origin['translation'].y);
}


Box.prototype.animate = function(fn, vector) {

   fn(this, vector);
}

var REDRAW_MOUSE_COL = {
   
   0: function(box, mouse) {
      var vR = grid.orientation.indexOf(box.row);

      box.origin['translation'].x = mouse.x; 
      box.origin['translation'].y = grid.vectors[vR].y; 

      box.setTranslation(); 
   },

   1: function(box, mouse) {
      var vR = grid.orientation.indexOf(box.row);

      box.origin['translation'].x = mouse.x; 
      box.origin['translation'].y = grid.vectors[vR].y; 

      box.setTranslation(); 
   },

   2: function(box, mouse) {
      var vR = grid.orientation.indexOf(box.row);

      box.origin['translation'].x = mouse.x; 
      box.origin['translation'].y = grid.vectors[vR].y; 

      box.setTranslation(); 
   }
}

var REDRAW_MOUSE_ROW = {
   
   0: function(box, mouse) {
      var vC = grid.orientation.indexOf(box.col);

      box.origin['translation'].x = grid.vectors[vC].x; 
      box.origin['translation'].y = mouse.y; 

      box.setTranslation(); 
   },

   1: function(box, mouse) {
      var vC = grid.orientation.indexOf(box.col);

      box.origin['translation'].x = grid.vectors[vC].x; 
      box.origin['translation'].y = mouse.y; 

      box.setTranslation(); 
   },

   2: function(box, mouse) {
      var vC = grid.orientation.indexOf(box.col);

      box.origin['translation'].x = grid.vectors[vC].x; 
      box.origin['translation'].y = mouse.y; 

      box.setTranslation(); 
   }
}

var REDRAW_MOUSE = {
   
   0: function(box, mouse) {
      box.shape.translation.set(mouse.x, mouse.y);
   },
   1: function(box, mouse) {
      box.shape.translation.set(mouse.x, mouse.y);
   },
   2: function(box, mouse) {
      box.shape.translation.set(mouse.x, mouse.y);
   }
}

function squish(box, vector) {
   box.shape.vertices[1].y = box.shape.vertices[1].origin.y - 20;
   box.shape.vertices[3].y = box.shape.vertices[3].origin.y + 20;
}

var REDRAW = {
   
   0: function(box) {
      var vC = grid.orientation.indexOf(box.col);
      var vR = grid.orientation.indexOf(box.row);

      box.origin['translation'].x = grid.vectors[vC].x; 
      box.origin['translation'].y = grid.vectors[vR].y; 

      box.setTranslation(); 
   },

   2: function(box) {

      var vC = grid.orientation.indexOf(box.col);
      var vR = grid.orientation.indexOf(box.row);

      box.origin['translation'].x = grid.vectors[vC].x; 
      box.origin['translation'].y = grid.vectors[vR].y; 


      var half_movex = box.origin['translation'].x - box.shape['translation'].x / 2;
      var half_movey = box.origin['translation'].y - box.shape['translation'].y / 2;

      var vecStart = box.shape['translation'].clone(); 
      var vecEnd = new Two.Vector(
            box.origin['translation'].x, 
            box.origin['translation'].y); 

      var redraw = new TWEEN
         .Tween({ 
            x: box.shape['translation'].x,
            y: box.shape['translation'].y
         })
         .to({ 
            x: box.origin['translation'].x,
            y: box.origin['translation'].y,
         }, 300)
         .easing(TWEEN.Easing.Cubic.InOut)
         .onUpdate(function() {
            var deltax = box.shape['translation'].x - this.x;
            var deltay = box.shape['translation'].y - this.y;

            box.shape['translation'].x = this.x;
            box.shape['translation'].y = this.y;


            if(box.row == box.col) {
               //console.log(vecDelta);
               squish(box, vecDelta);

            } 
         })
         .onComplete(function() {

            _.each(box.shape.vertices, function(v) {
               v.x = v.origin.x;
               v.y = v.origin.y;
            })

         })

      if(box.tween['move']) {
         box.tween['move'].stop();
      }

      box.tween['move'] = redraw;

      box.tween['move'].start();

   },

   1: function(box) {

      var vC = grid.orientation.indexOf(box.col);
      var vR = grid.orientation.indexOf(box.row);

      box.origin['translation'].x = grid.vectors[vC].x; 
      box.origin['translation'].y = grid.vectors[vR].y; 

      var redraw = new TWEEN
         .Tween({ 
            x: box.shape['translation'].x,
            y: box.shape['translation'].y
         })
         .to({ 
            x: box.origin['translation'].x,
            y: box.origin['translation'].y,
         }, 300)
         .easing(TWEEN.Easing.Cubic.InOut)
         .onUpdate(function() {
            box.shape.translation.x = this.x;
            box.shape.translation.y = this.y;
         })

      if(box.tween['move']) {
         box.tween['move'].stop();
      }

      box.tween['move'] = redraw;

      box.tween['move'].start();
   }

}

var SETTLE = {

   0: function(box) {

         box.shape['opacity'] = box.origin['opacity'];
         box.shape['rotation'] = box.origin['rotation'];
         box.shape['fill'] = colorToString(box.origin['color']);

         box.shape['translation'].x = box.origin['translation'].x;
         box.shape['translation'].y = box.origin['translation'].y;
         box.shape['opacity'] = 1;

      },
   1: function(box) {

         var offset = (Math.random() * 100) + 400;
         var delay = (Math.random() * 300) + 200;

         var settle = new TWEEN.Tween(
               { 
                  y: box.origin['translation'].y - offset,
                  o: 0
               })
            .to(
               { 
                  y: box.origin['translation'].y,
                  o: 1
               }, 1000)
            .delay(delay)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(function() {
               box.shape['translation'].y = this.y;
               box.shape['opacity'] = this.o;
               //box.origin['translation'].y = this.y;
            })
            .onStart(function() {

               box.shape['opacity'] = box.origin['opacity'];
               box.shape['rotation'] = box.origin['rotation'];
               box.shape['fill'] = colorToString(box.origin['color']);
               box.shape['translation'].x = box.origin['translation'].x;
            })
            .onComplete(function() {
               //console.log(box.shape['translation'].y)
               box.shape['translation'].x = box.origin['translation'].x;
               box.shape['translation'].y = box.origin['translation'].y;
            })
            .start();


      },
   2: function(box) {

         box.shape['opacity'] = box.origin['opacity'];
         box.shape['rotation'] = box.origin['rotation'];
         box.shape['fill'] = colorToString(box.origin['color']);

      },
}

var OUTLINE = {

   0: function(box) {
         if(box.disabled['highlight']) {
            return;
         }
         box.shape.stroke = "black";
         box.shape.linewidth = 10;
      },
   
   1: function(box) {
         if(box.disabled['highlight']) {
            return;
         }

         if(box.tween['highlight'] !== undefined) {
            box.tween['highlight'].stop();
         }

         box.shape.stroke = "orangered";

         box.tween['highlight'] = new TWEEN.Tween({ t: box.shape['linewidth'] })
            .to({ t: 15 }, 50)
            .easing(TWEEN.Easing.Cubic.In)
            .onUpdate(function() {
               box.shape.linewidth = box.origin['linewidth'] + this.t;
            })

         box.tween['highlight'].start();
      },

   2: function(box) {

      }
}

var UNOUTLINE = {

   0: function(box) {
         if(box.disabled['highlight']) {
            return;
         }

         box.shape.stroke = box.origin['stroke'];
         box.shape.linewidth = box.origin['linewidth'];
      },
   
   1: function(box) {

         if(box.disabled['highlight']) {
            return;
         }

         if(box.tween['highlight'] !== undefined) {
            box.tween['highlight'].stop();
         }

         box.tween['highlight'] = new TWEEN.Tween({ t: box.shape['linewidth'] })
            .to({ t: 0 }, 50)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(function() {
               box.shape.linewidth = box.origin['linewidth']+ this.t;
            })
            .onComplete(function() {
               box.shape.stroke = "black";
            })

         box.tween['highlight'].start();

      }
}

var POP_2 = function(box) {

   var big = new TWEEN.Tween({ s: box.shape['scale'] })
      .to({ s: 1.42 }, 100)
      .delay(300)
      .easing(TWEEN.Easing.Cubic.In)
      .onUpdate(function() {
         box.shape['scale'] = this.s;
      })

   var small = new TWEEN.Tween({ s: 1.42 })
      .to({ s: box.origin['scale']}, 100)
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate(function() {
         box.shape['scale'] = this.s;
      })

   big.chain(small);

   if(box.tween['big'] !== undefined) {
      box.tween['big'].stop();
   }

   box.tween['big'] = big; 
   box.tween['big'].start();
}

var SHINE = {

   0: function(box) {

         var blink = new TWEEN.Tween(box.origin)
            .to({ linewidth: 10 }, 15)
            .repeat(1)
            .delay(200)
            .yoyo(true)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(function() {
               box.shape['linewidth'] = this.linewidth;
            })
            .start();

      },

   2: function(box) {
      },

   1: function(box) {

      box.disabled['highlight'] = true;

      var big = new TWEEN.Tween({ s: box.shape['scale'], r: box.shape['rotation'] })
         .to({ s: 1.42, r: box.origin['rotation'] + Math.PI*2 }, 100)
         .delay(300)
         .easing(TWEEN.Easing.Cubic.In)
         .onUpdate(function() {
            box.shape['scale'] = this.s;
            box.shape['rotation'] = this.r;
         })
         .onStart(function() {
            box.origin['linewidth'] = 0;
            box.shape['linewidth'] = 0;
         })

      var color_in = new TWEEN.Tween(
            { 
               r: box.origin['color'].r, 
               g: box.origin['color'].g, 
               b: box.origin['color'].b, 
            })
            .to({ r: 255, b: 255, g: 255 }, 100)
            .delay(30 * grid.orientation.indexOf(box.row) + 30* grid.orientation.indexOf(box.col))
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(function() {
               color = { 
                  r: Math.round(this.r), 
                  g: Math.round(this.g), 
                  b: Math.round(this.b), 
                  a: 0.75 
               };

               box.shape.fill = colorToString(color);
            })

      var color_out = new TWEEN.Tween({ r: 255, b: 255, g: 255 })
            .to(
            { 
               r: box.origin['color'].r, 
               g: box.origin['color'].g, 
               b: box.origin['color'].b, 
            }, 100)
            .onUpdate(function() {

               color = { 
                  r: Math.round(this.r), 
                  g: Math.round(this.g), 
                  b: Math.round(this.b), 
                  a: 0.75 
               };

               box.shape.fill = colorToString(color);
            })

      var small = new TWEEN.Tween({ s: 1.42, r: box.shape['rotation'] })
         .to({ s: box.origin['scale'], r: box.origin['rotation']}, 200)
         .delay(500)
         .easing(TWEEN.Easing.Cubic.Out)
         .onUpdate(function() {
            box.shape['scale'] = this.s;
            box.shape['rotation'] = this.r;
         })
         .onComplete(function() {
            box.origin['linewidth'] = 1;
            box.shape['linewidth'] = 1;
            box.disabled['highlight'] = false;
         });

      big.chain(color_in)
      color_in.chain(color_out)
      color_out.chain(small)

      if(box.tween['big'] !== undefined) {
         box.tween['big'].stop();
      }

      box.tween['big'] = big; 
      box.tween['big'].start();
   }
}
