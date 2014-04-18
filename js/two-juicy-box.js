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

}

Box.prototype.REDRAW_MOUSE_COL = function(mouse) {

   var box = this;

   switch(grid.attributes.juiceLevel) {

      case 0:
      case 1:

         var vR = grid.orientation.indexOf(box.row);

         box.group['translation'].x = mouse.x; 
         box.group['translation'].y = grid.vectors[vR].y; 

         break;

      default:
         break;
   }
}

Box.prototype.REDRAW_MOUSE_ROW = function(mouse) { 

   var box = this;

   switch(grid.attributes.juiceLevel) {

      case 0:
      case 1:

         var vC = grid.orientation.indexOf(box.col);

         box.group['translation'].x = grid.vectors[vC].x; 
         box.group['translation'].y = mouse.y; 

         break;

      default:
         break;
   }
}

Box.prototype.REDRAW_MOUSE = function(mouse) {

   var box = this;

   switch(grid.attributes.juiceLevel) {

      case 0:
         box.group.translation.copy(mouse);
         break;

      case 1:
         var delta = mouse.clone(); 
         delta.subSelf(box.group.translation);

         //box.stretch(delta);

         box.group.translation.set(mouse.x, mouse.y);
         break;

      default:
         break;
   }

}

Box.prototype.REDRAW = function() {

   var box = this;

   switch(grid.attributes.juiceLevel) { 

      case 0:

         var vC = grid.orientation.indexOf(box.col);
         var vR = grid.orientation.indexOf(box.row);

         box.group['translation'].x = grid.vectors[vC].x; 
         box.group['translation'].y = grid.vectors[vR].y; 
         break;

      case 1:

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

         break;

      default:
         break;
   }
}

Box.prototype.SLIDE_IN = function() {

   var box = this;

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
}

Box.prototype.SLIDE_OUT = function() {

   var box = this;

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
}

Box.prototype.FADE_IN = function() {

   var box = this;

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
}

Box.prototype.FADE_OUT = function() {

   var box = this;

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
}

Box.prototype.SETTLE = function() {
   var box = this;

   //tween: undefined,
   //complete: false,

   switch(grid.attributes.juiceLevel) {

      case 0:

         box.shape['opacity'] = box.origin['opacity'];
         box.shape['rotation'] = box.origin['rotation'];
         box.shape['fill'] = colorToString(colors[0]['FILL'][box.threshold]);
         box.shape['opacity'] = 1;

         break;

      case 1:

         var offset = (Math.random() * 100) + 400;
         var delay = (Math.random() * 500) + 200;

         var rotationOffset = box.origin['rotation'] + (Math.random() * 2) - 1;

         this.tween = new TWEEN.Tween(
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
            //box.face.visible = true;
         })
         .start();

         break;

      default:
         break;

   }
}

Box.prototype.OUTLINE_EXTRA = function() {

   var box = this;

   switch(grid.attributes.juiceLevel) {

      case 0:

         if(box.disabled['highlight']) {
            return;
         }
         box.shape.stroke = "black";
         box.shape.linewidth = 4;
         box.group.toFront();
         break;

      case 1:

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
         break;

      default:
         break;
   }
}


Box.prototype.OUTLINE = function() {
   var box = this;

   switch(grid.attributes.juiceLevel) {

      case 0:
         if(box.disabled['highlight']) {
            return;
         }
         box.shape.stroke = "black";
         box.shape.linewidth = 10;

         //ensures that the highlighted box will be moved to front after all the others
         setTimeout(function() {
            box.group.toFront();
         }, 20)

         break;

      case 1:

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
         break;

      default:
         break;
   }
}

Box.prototype.UNOUTLINE_EXTRA = function() {
   var box = this;

   switch(grid.attributes.juiceLevel) {
      case 0:
         box.shape.noStroke();
         break;

      case 1:
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

         break;
      default:
         break;
   }

}

Box.prototype.SMILE_ON = function() {

   var box = this;

   switch(grid.attributes.juiceLevel) {

      case 1:

         // box.face.visible = false;
         var t = new TWEEN.Tween({ scale: 0.4, o: 0 })
            .to({ scale: 1, o: 1 }, 200)
            .delay(Math.random() * 500 + 200)
            .onStart(function() {
               box.face = box.faces[0];
               box.face.visible = true;
            })
            .onUpdate(function() {
               box.face.opacity = this.opacity;
               box.face.scale = this.scale;
            });

         var t2 = new TWEEN.Tween({ scale: 1 })
            .to({ scale: 0.5 }, 100)
            .onUpdate(function() {
               box.face.scale = this.scale;
            });

         t.chain(t2).start();

         break;

      default:
         break;
   }
}

Box.prototype.SMILE_OFF = function() {
   var box = this;

   switch(grid.attributes.juiceLevel) {

      case 1:

         box.face.visible = false;
         //box.face = box.faces[randomInt(0,3)];
         //box.face.visible = true;

         break;

      default:
         break;
   }
}

Box.prototype.UNOUTLINE = function() {
   var box = this;

   switch(grid.attributes.juiceLevel) {
      case 0:
         box.shape.noStroke();
         break;

      case 1:

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

      default:
         break;

   }
}

var arrows = [];

Box.prototype.DRAG_INDICATOR = function() {

   var box = this;

   switch(grid.attributes.juiceLevel) {

      case 0:
         break;

      case 1:

         _.each(arrows, function(a) {
            a.stop();
         });
         arrows = [];

         for(var i = 0; i < 2; i++) {


            var rect = assets[5].clone();
            rect.stroke = "black";
            rect.linewidth = 4;
            rect.noFill();
            rect.scale = 0.2;
            //rect.noStroke();
            rect.rotation = Math.PI * (i%2 == 0? 3/4 : -1/4);

            arrows.push(new TWEEN.Tween({ 
                  rect: rect, 
                  length: box.group.translation.x + (i%2 == 0 ? 1: -1) * (10),
                  group: grid.foreground 
               })
               .to({ 
                  length: box.group.translation.x + (i%2 == 0 ? 1: -1) * (100)
               }, 500)
               .easing(TWEEN.Easing.Cubic.Out)
               .onUpdate(function() {
                  this.rect.translation.x = this.length;
                  this.rect.translation.y = this.length;

               })
               .onStart(function() {

                  grid.foreground.add(this.rect);
                  //this.group.add(this.rect);
                  //this.group.add(this.rect2);
               })
               .onStop(function() {
                  grid.foreground.remove(this.rect);
               })
               .onComplete(function() {
                  grid.foreground.remove(this.rect);
                  //this.group.remove(this.rect);
                  //this.group.remove(this.rect2);
               })
               .start());
            }


         break;

      default:
         break;

   }
}
