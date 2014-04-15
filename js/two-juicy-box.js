function colorToString(color) {
   return 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';
}

function randomInt(beginRange, endRange) {
   return Math.floor(Math.random() * (endRange-beginRange) + beginRange);
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

function Box(grid, row, col, width, datum) {
   this.row = row;
   this.col = col;
   this.datum = datum * 0.01;
   this.width = width;
   this.juiceLevel = grid.attributes.juiceLevel;

   this.origin = {};
   this.points = generate(this.width, 4);
   this.origin.linewidth = 1;
   this.origin.rotation = Math.PI / 4;
   this.origin.scale = 1;
   this.origin.opacity = 1;

   if(this.datum > GAME.UPPER_THRESHOLD) {
      this.threshold = 'UPPER_THRESHOLD'; 
   } else if (this.datum > GAME.LOWER_THRESHOLD) {
      this.threshold = 'LOWER_THRESHOLD'; 
   } else {
      this.threshold = 'BELOW_THRESHOLD'; 
   }

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


   this.shape = new Two.Polygon(this.points, true);
   this.shape['opacity'] = 0;
   this.shape.scale = 1;
   this.shape.noStroke();
   //this.shape.subdivide(30);

   this.shadow = new Two.Polygon(this.points, true);
   this.shadow.translation.set(0,0);
   this.shadow.rotation = Math.PI / 4;
   this.shadow.visible = false;
   this.shadow.fill = colorToString(colors[this.juiceLevel]['SHADOW'][this.threshold])
   this.shadow.noStroke();

   this.faces = [];
   for(var i = 0; i < 4; i++) {
      var face = assets[i].clone();
      face.scale = 0.3;
      face.noStroke();
      face.fill = colorToString(colors[this.juiceLevel]['FACE'][this.threshold])
      face.visible = false;
      this.faces.push(face);
   }

   this.face = this.faces[randomInt(1,4)];

   this.group = two.makeGroup(this.shadow, this.shape, this.faces[0], this.faces[1], this.faces[2], this.faces[3]);
   this.group.translation.set(grid.vectors[this.col].x, grid.vectors[this.row].y); 
   this.group.rotation = 0;
   this.group.scale = 1;

   this.group.addTo(grid.group);

   //BLINK[0](this);
}

Box.prototype.animate = function(fn, vector) {

   fn(this, vector);
}


Box.prototype.stretch = function(delta) {

   this.points[0].x = this.points[0].origin.x + delta.x;
   this.points[2].x = this.points[2].origin.x + delta.x;
}

var BLINK = {
   
   0: function(box) {

         //console.log(box);
         //box.face.children[0].visible = false; 
         //box.face.children[1].visible = false; 


         setTimeout(function() { 
            box.face.visible = false;
         }, 1000);  

         setTimeout(function() { BLINK[0](box) }, (Math.random() * 5000) + 10000);
      }
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
      var delta = mouse.clone(); 
      delta.subSelf(box.group.translation);

      //box.stretch(delta);

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
         .easing(TWEEN.Easing.Cubic.Out)
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
         .easing(TWEEN.Easing.Cubic.Out)
         .onUpdate(function() {

            var delta = box.group.translation.clone();

            box.group['translation'].set(this.x, this.y);

            delta.subSelf(box.group.translation);
            //box.stretch(delta);
         })
         .onComplete(function() {
            //box.stretch({ x: 0, y: 0 });
         })

      if(box.tween['move']) {
         box.tween['move'].stop();
      }

      box.tween['move'] = redraw;

      box.tween['move'].start();
   }

}

var SWEEP = {

   tween: undefined,

   0: function(background) {

      },

   1: function(background) {

         if(SWEEP.tween !== undefined) {
            return;
         }
         //get a random color

         var c = colors[1]['BACKGROUND_FILL'][randomInt(0,5)]

         var rect = new Two.Polygon(generate(two.width, 4), true);
         rect.fill = colorToString(c)
         rect.noStroke();
         rect.visible = false;

         background.add(rect);

         var dir = randomInt(0,4); //0 left, 1 top, 2 right, 3 bottom
         var x, y;

         if(dir == 0) {
            x = -2 * two.width;
            y = 0;

         } else if (dir == 1) {
            y = -2 * two.width;
            x = 0;

         } else if (dir == 2) {
            x = 2 * two.width;
            y = 0;

         } else {
            y = 2 * two.width;
            x = 0;

         }

         SWEEP.tween = new TWEEN.Tween({ 
               rect: rect, 
               x: x, 
               y: y
            })
            .to({ y: 0, x: 0 }, 500) 
            .delay(50)
            .easing(TWEEN.Easing.Cubic.Out)
            .onStart(function() {

               this.rect.visible = true;
               this.rect.translation.set(0, -2 *two.width);
               
            })
            .onUpdate(function() {

               this.rect.translation.set(this.x, this.y);

            })
            .onComplete(function() {
               _.each(background.children, function(v, i) {

                  if(v.id != this.rect.id) {
                     background.remove(v)
                  }

               }, this)

               SWEEP.tween = undefined;

            })
            .start();


      } 
}

var OUR_BUDDY = function(foreground, text) {

   var buddy = assets[4];
   foreground.add(buddy);

   $('#speech-bubble').html(text);
   $('#speech-bubble').css('visibility', 'hidden');
   $('#speech-bubble').css('left', 150+'px');

   var entry = new TWEEN.Tween({ buddy: buddy, x: 400 })
      .to({ x: 190 }, 200)
      .easing(TWEEN.Easing.Cubic.Out)
      .onStart(function() {
         this.buddy.visible = true;

      })
      .onUpdate(function() {
         this.buddy.translation.y = this.x;

      });

   var hover = new TWEEN.Tween({ buddy: buddy, x: 190 })
      .to({ x: 200 }, 700)
      .yoyo(true)
      .repeat(Infinity)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(function() {
         this.buddy.translation.y = this.x;
         $('#speech-bubble').css('top', (this.x+150)+'px');
      })
      .onStart(function() {
         $('#speech-bubble').css('visibility', 'visible');
      })
      .onComplete(function() {
         this.buddy.visible = false;
      })

   entry.chain(hover).start();

   setTimeout(function() {
      $(window).one('mousedown', function(e) {

         e.preventDefault();
         e.stopPropagation();
         hover.stop();
         buddy.visible = false;
         $('#speech-bubble').css('visibility', 'hidden');

      })
   }, 1000)

}

var BARS = {

   0: function() {

      },

   1: function(foreground, background) {

         var bars = 50;
         var width = Math.sqrt(two.width*two.width*2) * (1.0/bars);

         for(var i = 0; i < bars; i++) {

            var isTop = !!(i%2);
            var isLeft = !!((i%4==0) || ((i+1)%4==0));

            var color = colors[1].BACKGROUND_FILL[randomInt(0,5)]; 

            var rect = two.makeRectangle(0, i * width/2 * (isTop?-1:1), two.width-200, width); 
            rect.fill = colorToString(color);
            rect.noStroke();
            rect.visible = false;
            background.add(rect);

            var dest = (two.width) * (isLeft?-1:1);
            var start = (two.width) * (isLeft?1:-1);

            BARS.tween = new TWEEN.Tween({ x: start, rect: rect, i: i })
               .to({ x: dest}, 500)
               .delay(5 * i)
               .easing(TWEEN.Easing.Cubic.Out)
               .onStart(function() {
                  this.rect.visible = true;

                  if(this.i == 0) {
                     background.rotation = Math.random() * Math.PI * 2;
                  }
               })
               .onUpdate(function() {
                  this.rect.translation.x = this.x;
               })
               .onComplete(function() {
                  background.remove(this.rect);

                  if(this.i == 50) {
                     background.rotation = 0;
                  }
               })
               .start();
         }


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

            var rect = new Two.Polygon(generate((two.width / 10) * i, randomInt(4,8)), true);
            rect.fill = "rgba(255,255,255,0)";
            rect.linewidth = 4;
            rect.stroke = "rgba(100,100,100,1)";
            rect.visible = false;
            //rect.rotation= ;
            background.add(rect);

            var settle = new TWEEN.Tween({ scale: 1, rect: rect })
               .to({ scale: 0.5 }, 300)
               .delay(50 * i)
               .easing(TWEEN.Easing.Cubic.Out)
               .onStart(function() {
                  this.rect.visible = true;
               })
               .onUpdate(function() {
                  this.rect.scale = this.scale;
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
   tween: undefined,
   complete: false,
   0: function(box) {

         box.shape['opacity'] = box.origin['opacity'];
         box.shape['rotation'] = box.origin['rotation'];
         box.shape['fill'] = colorToString(colors[0]['FILL'][box.threshold]);
         box.shape['opacity'] = 1;

      },
   1: function(box) {

         var offset = (Math.random() * 100) + 400;
         var delay = (Math.random() * 500) + 200;

         var rotationOffset = box.origin['rotation'] + (Math.random() * 2) - 1;

         SETTLE.tween = new TWEEN.Tween(
               { 
                  y: -offset,
                  o: 0,
                  r: rotationOffset,
                  s: 1.5,
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
            .easing(TWEEN.Easing.Bounce.Out)
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

               box.shape['opacity'] = box.origin['opacity'];
               box.shape['rotation'] = box.origin['rotation'];
               box.shape['fill'] = colorToString(colors[1]['FILL'][box.threshold]);
               box.shape['translation'].x = 0;
            })
            .onComplete(function() {
               //box.shadow.visible = false;
               box.face.visible = true;
               SETTLE.complete = true;
            })
            .start();

      },
   2: function(box) {

         box.shape['opacity'] = box.origin['opacity'];
         box.shape['rotation'] = box.origin['rotation'];
         box.shape['fill'] = colorToString(box.origin['color']);

      },
}

var OUTLINE_EXTRA = {

   0: function(box) {
         if(box.disabled['highlight']) {
            return;
         }
         box.shape.stroke = "black";
         box.shape.linewidth = 4;
         box.group.toFront();
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
                  sh: 0,//box.shadow['translation'].y
                  o: box.shadow['opacity']
               })
            .to({ t: 2.5, tr: -5, sh: 2.5, o: 0.9 }, 500)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(function() {
               box.shape.translation.x = this.tr;
               box.shape.translation.y = this.tr;

               box.shadow.translation.x = this.sh;
               box.shadow.translation.y = this.sh;


               box.face.translation.x = this.tr;
               box.face.translation.y = this.tr;

               box.shadow.opacity = this.o;
            })
            .onStart(function() {
               //box.face.visible = false;

               box.group.toFront();

            })
            .start();
      },

   2: function(box) {

      }
}


var OUTLINE = {

   0: function(box) {
         if(box.disabled['highlight']) {
            return;
         }
         box.shape.stroke = "black";
         box.shape.linewidth = 10;

         //ensures that the highlighted box will be moved to front after all the others
         setTimeout(function() {
            box.group.toFront();
         }, 20)
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
                  sh: 0,//box.shadow['translation'].y
                  o: box.shadow['opacity']
               })
            .to({ t: 5, tr: -10, sh: 5, o: 0.9 }, 500)
            .delay(20)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(function() {
               box.shape.translation.x = this.tr;
               box.shape.translation.y = this.tr;

               box.shadow.translation.x = this.sh;
               box.shadow.translation.y = this.sh;

               box.face.translation.x = this.tr;
               box.face.translation.y = this.tr;

               box.shadow.opacity = this.o;
            })
            .onStart(function() {
               //box.face.visible = false;

               box.group.toFront();

            })
            .start();
      },

   2: function(box) {

      }
}

var UNOUTLINE_EXTRA = {
   0: function(box) {

         box.shape.noStroke();
         //box.shape.stroke = 'black';
         //box.shape.linewidth = 1;
      },
   1: function(box) {

      if(box.tween['highlight'] !== undefined) {
         box.tween['highlight'].stop();
      }

      box.tween['highlight'] = new TWEEN.Tween(
            { 
               tr: box.shape['translation'].x,
               sh: box.shadow['translation'].x,
               o: box.shadow['opacity']
            })
         .to({ tr: 0, sh: 0, o: 0.5 }, 400)
         .easing(TWEEN.Easing.Cubic.Out)
         .onUpdate(function() {
            //box.shape.linewidth = box.origin['linewidth'] + this.t;
            box.shape.translation.x = this.tr;
            box.shape.translation.y = this.tr;
            box.shadow.translation.x = this.sh;
            box.shadow.translation.y = this.sh;

            box.face.translation.x = this.tr;
            box.face.translation.y = this.tr;

            box.shadow.opacity = this.o;
         })
         .onComplete(function() {


         })
         .onStart(function() {
            //box.face.visible = false;
            //box.face = box.faces[randomInt(0,3)];
            //box.face.visible = true;


         })
         .start();

      }

}

var SMILE_ON = function(box) {
   box.face.visible = false;
   box.face = box.faces[0];
   box.face.visible = true;

}

var SMILE_OFF = function(box) {
   box.face.visible = false;
   box.face = box.faces[randomInt(0,3)];
   box.face.visible = true;

}

var UNOUTLINE = {

   0: function(box) {

         box.shape.noStroke();
      },
   
   1: function(box) {

         if(box.tween['highlight'] !== undefined) {
            box.tween['highlight'].stop();
         }

         box.tween['highlight'] = new TWEEN.Tween(
               { 
                  tr: box.shape['translation'].x,
                  sh: box.shadow['translation'].x,
                  o: box.shadow['opacity']
               })
            .to({ tr: 0, sh: 0, o: 0.5 }, 400)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(function() {
               //box.shape.linewidth = box.origin['linewidth'] + this.t;
               box.shape.translation.x = this.tr;
               box.shape.translation.y = this.tr;
               box.shadow.translation.x = this.sh;
               box.shadow.translation.y = this.sh;

               box.face.translation.x = this.tr;
               box.face.translation.y = this.tr;

               box.shadow.opacity = this.o;
            })
            .onComplete(function() {

            })
            .onStart(function() {
              // box.face = box.faces[randomInt(0,3)];
               
            })
            .start();

      }
}

var SLIDE_IN = {
   0: function(box) {

      },
   1: function(box) {

         var slide = new TWEEN.Tween({ x: box.shape.translation.x }) 
            .to({ x: 0 }, 200)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(function() {
               box.shape.translation.x = this.x;
               box.shadow.translation.x = this.x;
               box.face.translation.x = this.x;

               box.shape.translation.y = -this.x;
               box.shadow.translation.y = -this.x;
               box.face.translation.y = -this.x;
            })
            .onStart(function() {

               box.group.opacity = 1;
            })
            .onComplete(function() {
               grid.disabled = false;
            })
            .start();

      },
   2: function(box) {

      }
}

var SLIDE_OUT = {
   0: function(box) {

      },
   1: function(box) {

         if(box.group.translation.y > box.group.translation.x) {
            var destination = -two.width * 0.2;
         } else if(box.group.translation.y == box.group.translation.x) {
            var destination = (Math.random() > 0.5 ? -two.width: two.width) * 0.2;
         } else {
            var destination = two.width * 0.2;
         }

         var slide = new TWEEN.Tween({ x: box.shape.translation.x }) 
            .to({ x: destination }, 200)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(function() {
               box.shape.translation.x = this.x;
               box.shadow.translation.x = this.x;
               box.face.translation.x = this.x;

               box.shape.translation.y = -this.x;
               box.shadow.translation.y = -this.x;
               box.face.translation.y = -this.x;

            })
            .onStart(function() {
               grid.disabled = true;
               box.group.opacity = 0.3;
            })
            .start();

      },
   2: function(box) {

      }
}

var FADE_IN = {

   0: function(box) {

      },
   1: function(box) {

         var delay = Math.random() * 200;

         var fade = new TWEEN.Tween({ s: box.group['scale'], o: box.group['opacity'] })
            .to({ s: 1, o: 1 }, 100)
            .delay(delay)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(function() {
               box.group['scale'] = this.s;
               //box.group['opacity'] = this.o;
            })
            .onStart(function() {
            })
            .start();

      },
   2: function(box) {

      }

}

var FADE_OUT = {

   0: function(box) {

      },
   1: function(box) {

         var delay = Math.random() * 200;
         //var delay = 50 + (grid.orientation.indexOf(box.row) * grid.orientation.indexOf(box.col) * 10);

         var fade = new TWEEN.Tween({ s: box.group['scale'], o: box.group['opacity'] })
            .to({ s: 0, o: 0 }, 100)
            .delay(delay)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(function() {
               box.group['scale'] = this.s;
               //box.group['opacity'] = this.o;

            })
            .onStart(function() {
            })
            .start();

      },
   2: function(box) {

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
