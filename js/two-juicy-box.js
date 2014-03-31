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

   return { r: r, g: g, b: b, a: 0.8 };

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
   this.width = width;

   this.origin = {};
   this.origin.color = getColor(this.row, this.col, this.datum, grid.attributes.juiceLevel);
   this.origin.points = generate(this.width, 4);
   this.origin.linewidth = 1;
   this.origin.stroke = "black";
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
   this.shape.scale = 1;
   this.shape.subdivide(30);

   this.shadow = new Two.Polygon(this.origin['points'], true);
   this.shadow.translation.set(0,0);
   this.shadow.rotation = Math.PI / 4;
   this.shadow.visible = false;
   this.shadow.fill = "rgba(50,50,50,0.6)";
   this.shadow.noStroke();

   this.face = assets[1].clone();
   this.face.scale = 0.5;
   this.face.noStroke();
   this.face.fill = "rgba(255,255,255,0.9)";
   this.face.visible = true;

   this.smile = assets[0].clone();
   this.smile.scale = 0.5;
   this.smile.noStroke();
   this.smile.fill = "rgba(255,255,255,0.9)";
   this.smile.visible = false;

   this.group = two.makeGroup(this.shadow, this.shape, this.face, this.smile);
   this.group.translation.set(grid.vectors[this.col].x, grid.vectors[this.row].y); 
   this.group.rotation = 0;
   this.group.scale = 1;

   this.group.addTo(grid.group);
}


Box.prototype.animate = function(fn, vector) {

   fn(this, vector);
}

var REDRAW_MOUSE_COL = {
   
   0: function(box, mouse) {
      var vR = grid.orientation.indexOf(box.row);

      box.group['translation'].x = mouse.x; 
      box.group['translation'].y = grid.vectors[vR].y; 
   },

   1: function(box, mouse) {
      var vR = grid.orientation.indexOf(box.row);

      box.group['translation'].x = mouse.x; 
      box.group['translation'].y = grid.vectors[vR].y; 
   },

   2: function(box, mouse) {
      var vR = grid.orientation.indexOf(box.row);

      box.group['translation'].x = mouse.x; 
      box.group['translation'].y = grid.vectors[vR].y; 
   }
}

var REDRAW_MOUSE_ROW = {
   
   0: function(box, mouse) {
      var vC = grid.orientation.indexOf(box.col);

      box.group['translation'].x = grid.vectors[vC].x; 
      box.group['translation'].y = mouse.y; 
   },

   1: function(box, mouse) {
      var vC = grid.orientation.indexOf(box.col);


      box.group['translation'].x = grid.vectors[vC].x; 
      box.group['translation'].y = mouse.y; 
   },

   2: function(box, mouse) {
      var vC = grid.orientation.indexOf(box.col);

      box.group['translation'].x = grid.vectors[vC].x; 
      box.group['translation'].y = mouse.y; 
   }
}

var REDRAW_MOUSE = {
   
   0: function(box, mouse) {
      box.group.translation.copy(mouse);
   },
   1: function(box, mouse) {
      box.group.translation.set(mouse.x, mouse.y);
   },
   2: function(box, mouse) {
      box.group.translation.set(mouse.x, mouse.y);
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

      box.group['translation'].x = grid.vectors[vC].x; 
      box.group['translation'].y = grid.vectors[vR].y; 
   },

   2: function(box) {

      var vC = grid.orientation.indexOf(box.col);
      var vR = grid.orientation.indexOf(box.row);

      box.group['translation'].x = grid.vectors[vC].x; 
      box.group['translation'].y = grid.vectors[vR].y; 


      //var half_movex = box.origin['translation'].x - box.shape['translation'].x / 2;
      //var half_movey = box.origin['translation'].y - box.shape['translation'].y / 2;

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

      var end = new Two.Vector(grid.vectors[vC].x, grid.vectors[vR].y);

      var redraw = new TWEEN
         .Tween({ x: box.group['translation'].x, y: box.group['translation'].y })
         .to({ x: end.x, y: end.y }, 300)
         .easing(TWEEN.Easing.Cubic.InOut)
         .onUpdate(function() {
            box.group['translation'].set(this.x, this.y);
         })

      if(box.tween['move']) {
         box.tween['move'].stop();
      }

      box.tween['move'] = redraw;

      box.tween['move'].start();
   }

}

var SWEEP = {

   0: function(background) {

         var rect = new Two.Polygon(generate(two.width, 4), true);
         rect.fill = "rgba(" + Math.floor(Math.random() * 100 + 155) + ",0,0,1)";
         rect.noStroke();
         rect.visible = false;

         background.add(rect);

         var sweep = new TWEEN.Tween({ rect: rect, y: -2 * two.width })
            .to({ y: 0 }, 500) 
            .delay(50)
            .easing(TWEEN.Easing.Cubic.Out)
            .onStart(function() {

               console.log(this.rect);
               this.rect.visible = true;
               this.rect.translation.set(0, -2 *two.width);
               
            })
            .onUpdate(function() {

               this.rect.translation.set(0, this.y);

            })
            .onComplete(function() {
               console.log(background.children);
               _.each(background.children, function(v, i) {

                  if(v.id != this.rect.id) {
                     background.remove(v)
                  }

               }, this)

            })
            .start();


      } 
}

var JUMP = {

   0: function(foreground, background) {

         var great = assets[2].clone();
         great.fill = "blue";
         great.noStroke();
         foreground.add(great);

         window.setTimeout(function() {
            foreground.remove(great);
         }, 1000)


         _.each(great.children, function(p) {

            var delay = Math.random() * 200;

            p.visible = false;

            var jump = new TWEEN.Tween({ poly: p, y: two.height, scale: 0 })
               .to({ y: p.translation.y-100, scale: 2 }, 400)
               .delay(delay)
               .easing(TWEEN.Easing.Back.Out)
               .onUpdate(function() {
                  p.translation.y = this.y;
                  p.scale = this.scale;

               })
               .onStart(function() {
                  p.visible = true;
                  p.translation.x -= 100;

               })
               .onComplete(function() {

               })
               .start();

         })

      }

}

var RIPPLE = {

   0: function(foreground, background) {


         var great = assets[2].clone();
         great.fill = "blue";
         great.noStroke();
         great.scale = 2;
         great.visible = true;
         foreground.add(great);

         var timeout = 1000;

         window.setTimeout(function() {
            foreground.remove(great);
         }, timeout)

         _.each(great.children, function(p) {

            _.each(p.vertices, function(v) {

               var ripple = new TWEEN.Tween( {
                  v: v,
                  r: 0
               })
               .to({ r: 4 * Math.PI }, timeout)
               .delay(v.x * 2)
               .onUpdate(function() {
                  this.v.y = this.v.y + (4 * Math.sin(2 * this.r));
               })
               .start();
            })
         })

      }

}

var SPLAT = {

   0: function(foreground, background) {

         var y = 0;

         for(var i = 5; i > 0; i--) {

            console.log(i);

            var great_shadow = assets[2].clone();
            great_shadow.fill = (i == 1 ? "blue" : "black");
            great_shadow.noStroke();
            great_shadow.visible = false;
            foreground.add(great_shadow);

            var extrude = new TWEEN.Tween({
               i: i,
               shadow: great_shadow,
               y: 0,
               scale: 1,
               opacity: 0  
            })
            .to({ y: 50, scale: 2, opacity: 1 }, 1000)
            .easing(TWEEN.Easing.Cubic.Out)
            .delay(i * 100)
            .onUpdate(function() {

               this.shadow.opacity = (this.opacity);
               this.shadow.translation.y = -this.y;
               this.shadow.scale = this.scale;

            })
            .onStart(function() {
               this.shadow.visible = true;

            })
            .onComplete(function() {
               foreground.remove(this.shadow);
            })
            .start();

         }
      }
}

var SLIDE = {

   0: function(foreground, background) {

         var rect_bot = two.makeRectangle(0,-140, - two.width * 0.7, 80);
         rect_bot.fill = "blue";
         rect_bot.noStroke();
         rect_bot.visible = true;

         var rect_mid = two.makeRectangle(0,0, two.width * 0.8, 200);
         rect_mid.fill = "blue";
         rect_mid.noStroke();
         rect_mid.visible = true;

         var rect_top = two.makeRectangle(0,150, two.width * 0.6, 100);
         rect_top.fill = "blue";
         rect_top.noStroke();
         rect_top.visible = true;
         
         var great = assets[2].clone();
         great.noStroke();
         great.fill = "orangered";
         great.scale = 2;
         great.visible = false;

         foreground.add(rect_bot);
         foreground.add(rect_mid);
         foreground.add(rect_top);
         foreground.add(great);

         console.log(foreground.children);

         var first = new TWEEN.Tween({ 
             top_x: two.width, 
             mid_x: -two.width, 
             bot_x: two.width
         })
         .to({
            top_x: 0,
            mid_x: 0,
            bot_x: 0 
         })
         .easing(TWEEN.Easing.Cubic.InOut)
         .onUpdate(function() {
            rect_top.translation.x = this.top_x;
            rect_mid.translation.x = this.mid_x;
            rect_bot.translation.x = this.bot_x;

            if(rect_mid.translation.x > -100) {
               great.visible = true;
            }
         })

         var second = new TWEEN.Tween({
             top_x: 0,
             mid_x: 0,
             bot_x: 0
         })
         .to({
            top_x: -two.width,
            mid_x: two.width,
            bot_x: -two.width
         })
         .easing(TWEEN.Easing.Cubic.InOut)
         .onUpdate(function() {
            rect_top.translation.x = this.top_x;
            rect_mid.translation.x = this.mid_x;
            rect_bot.translation.x = this.bot_x;

            if(rect_mid.translation.x > 100) {
               great.visible = false;
            }
         })
         .onComplete(function() {

            foreground.remove(rect_top);
            foreground.remove(rect_bot);
            foreground.remove(rect_mid);
            foreground.remove(great);

         })

         first.chain(second);
            
         first.start();


      }


}

var SQUARES = {

   0: function(background) {

      },
   1: function(background) {

         for(var i = 0; i < 10; i++) {

            var rect = new Two.Polygon(generate((two.width / 10) * i, 4), true);
            rect.fill = "rgba(255,255,255,0)";
            rect.linewidth = 2;
            rect.stroke = "rgba(50,50,50,1)";
            rect.visible = false;
            background.add(rect);

            var settle = new TWEEN.Tween({ rect: rect })
               .to({ }, 300)
               .delay(50 * i)
               .onStart(function() {
                  this.rect.visible = true;
                  this.rect.rotation = this.rotation;
               })
               .onComplete(function() {
                  background.remove(this.rect);
               })
               .start();
         }

         

      },
   2: function(box) {
      }
}

var SETTLE = {

   0: function(box) {

         box.shape['opacity'] = box.origin['opacity'];
         box.shape['rotation'] = box.origin['rotation'];
         box.shape['fill'] = colorToString(box.origin['color']);
         box.shape['opacity'] = 1;

      },
   1: function(box) {

         var offset = (Math.random() * 100) + 400;
         var delay = (Math.random() * 300) + 1000;

         var rotationOffset = box.origin['rotation'] + (Math.random() * 2) - 0.8;

         var settle = new TWEEN.Tween(
               { 
                  y: -offset,
                  o: 0,
                  r: rotationOffset,
                  s: 0,
                  sh: 0
               })
            .to(
               { 
                  y: 0,
                  o: box.origin['opacity'],
                  r: box.origin['rotation'],
                  s: box.origin['scale'],
                  sh: 0.9
               }, 500)
            .delay(delay)
            .easing(TWEEN.Easing.Back.Out)
            .onUpdate(function() {
               box.shape['translation'].y = this.y;
               box.shape['opacity'] = this.o;
               box.shape['rotation'] = this.r;
               box.shape['scale'] = this.s;
               box.shadow['scale'] = this.sh;
            })
            .onStart(function() {
               box.shadow.visible = true;
               box.shadow.scale = 0;

               box.face.visible = false;
               box.smile.visible = false;

               box.shape['opacity'] = box.origin['opacity'];
               box.shape['rotation'] = box.origin['rotation'];
               box.shape['fill'] = colorToString(box.origin['color']);
               box.shape['translation'].x = 0;
            })
            .onComplete(function() {
               //box.shadow.visible = false;
               box.face.visible = true;
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


         box.tween['highlight'] = new TWEEN.Tween(
               { 
                  t: box.shape['linewidth'],
                  tr: 0,//box.shape['translation'].x,
                  sh: 0//box.shadow['translation'].y
               })
            .to({ t: 5, tr: -10, sh: 5 }, 500)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(function() {
               //box.shape.linewidth = box.origin['linewidth'] + this.t;
               box.shape.translation.x = this.tr;
               box.shape.translation.y = this.tr;
               box.shadow.translation.x = this.sh;
               box.shadow.translation.y = this.sh;

               box.smile.translation.x = this.tr;
               box.smile.translation.y = this.tr;
            })
            .onStart(function() {
               //box.shadow.visible = true;
               //box.shape.stroke = "orangered";
               box.face.visible = false;
               box.smile.visible = true;

            })
            .start();
      },

   2: function(box) {

      }
}

var UNOUTLINE = {

   0: function(box) {

         box.shape.stroke = box.origin['stroke'];
         box.shape.linewidth = box.origin['linewidth'];
      },
   
   1: function(box) {

         if(box.tween['highlight'] !== undefined) {
            box.tween['highlight'].stop();
         }

         box.tween['highlight'] = new TWEEN.Tween(
               { 
                  tr: box.shape['translation'].x,
                  sh: box.shadow['translation'].x 
               })
            .to({ tr: 0, sh: 0 }, 400)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(function() {
               //box.shape.linewidth = box.origin['linewidth'] + this.t;
               box.shape.translation.x = this.tr;
               box.shape.translation.y = this.tr;
               box.shadow.translation.x = this.sh;
               box.shadow.translation.y = this.sh;

               box.face.translation.x = this.tr;
               box.face.translation.y = this.tr;
            })
            .onComplete(function() {
               //box.shadow.visible = false;
               //box.shadow.translation.set(0,0);
               //box.shape.stroke = "orangered";

            })
            .onStart(function() {
               box.smile.visible = false;
               box.face.visible = true;
            })
            .start();

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
            box.shape['fill'] = colorToString(box.origin['color']);
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
                  a: 0.9 
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
                  a: 0.9 
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
