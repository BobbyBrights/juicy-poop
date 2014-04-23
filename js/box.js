var arrows = [];

function Box(grid, row, col) {

   this.grid = grid;
   this.row = row;
   this.col = col;
   this.width = 40;
   this.datum = this.grid.attributes.data[row][col] * 0.01;

   this.points = generate(this.width, 4);

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

   this.group = two.makeGroup();
   this.grid.group.add(this.group);


   if(row == col) {
      this.shape = assets[8].clone();
      this.shadow = assets[8].clone();

      this.shape.scale = 0.4;
      this.shadow.scale = 0.4;

      this.chev = assets[10].clone();
      this.chev.visible = false;
      this.chev.noStroke();
      this.chev.fill = 'red';
      this.chev.scale = 0.4;

   } else {
      this.shape = new Two.Group();
      this.shape.add(new Two.Polygon(this.points, true));

      this.shadow = new Two.Group();
      this.shadow.add(new Two.Polygon(this.points, true));

      this.shape.rotation = Math.PI * 1/4;
      this.shadow.rotation = Math.PI * 1/4;
   }

   this.shape.noStroke();
   this.shape.opacity = 0.8;
   this.shape.visible = false;
   this.shape['fill'] = colorToString(colors[juice]['FILL'][this.threshold]);
   this.shape.translation.set(0,0);

   this.shadow.translation.set(0,0);
   this.shadow.visible = false;
   this.shadow.fill = colorToString(colors[juice]['SHADOW'][this.threshold])
   this.shadow.noStroke();
   this.shadow.opacity = 0.8;

   this.face = assets[0].clone();
   this.face.scale = 0.3;
   this.face.noStroke();
   this.face.fill = colorToString(colors[juice]['FACE'][this.threshold])
   this.face.visible = false;

   this.group.add(this.shadow).add(this.shape).add(this.face);

   if(row == col) {
      this.group.add(this.chev);
   }

   this.group.translation.set(this.grid.vectors[this.col].x, this.grid.vectors[this.row].y); 
   this.group.rotation = 0;
   this.group.scale = 1;
   this.group.opacity = 1;

}

Box.prototype.ADD = function() {

   var vC = this.grid.orientation.indexOf(this.col);
   var vR = this.grid.orientation.indexOf(this.row);

   this.shape.visible = true;
   this.shadow.visible = true;

   switch(juice) {

      case 0:
         break;
      case 1:

         this.tween['add'] = new TWEEN.Tween({
               box: this,
               o: 0,
               x: this.grid.vectors[vC].x + 100,
               y: this.grid.vectors[vR].y + 100
            })
            .to({
               o: 1,
               x: this.grid.vectors[vC].x,
               y: this.grid.vectors[vR].y
            }, 400)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(function() {
               this.box.group.opacity = this.o;
               this.box.group.translation.set(this.x,this.y);
            })
            .start();
         break;
      default:
         break;
   }

}

Box.prototype.REDRAW_MOUSE_COL = function(mouse) {


   switch(juice) {

      case 0:
      case 1:

         var vR = this.grid.orientation.indexOf(this.row);

         this.group['translation'].x = mouse.x; 
         this.group['translation'].y = this.grid.vectors[vR].y; 

         break;

      default:
         break;
   }
}

Box.prototype.REDRAW_MOUSE_ROW = function(mouse) { 

   switch(juice) {

      case 0:
      case 1:

         var vC = this.grid.orientation.indexOf(this.col);

         this.group['translation'].x = grid.vectors[vC].x; 
         this.group['translation'].y = mouse.y; 

         break;

      default:
         break;
   }
}

Box.prototype.REDRAW_MOUSE = function(mouse) {


   switch(juice) {

      case 0:
         this.group.translation.copy(mouse);
         break;

      case 1:
         var delta = mouse.clone(); 
         delta.subSelf(this.group.translation);

         //this.stretch(delta);

         this.group.translation.set(mouse.x, mouse.y);
         break;

      default:
         break;
   }

}

Box.prototype.REDRAW = function() {


   switch(juice) { 

      case 0:

         var vC = this.grid.orientation.indexOf(this.col);
         var vR = this.grid.orientation.indexOf(this.row);

         this.group['translation'].x = this.grid.vectors[vC].x; 
         this.group['translation'].y = this.grid.vectors[vR].y; 
         break;

      case 1:

         var vC = this.grid.orientation.indexOf(this.col);
         var vR = this.grid.orientation.indexOf(this.row);

         var end = new Two.Vector(this.grid.vectors[vC].x, this.grid.vectors[vR].y);

         if(this.tween['move']) {
            this.tween['move'].stop();
         }

         this.tween['move'] = new TWEEN.Tween({ 
               box: this,
               x: this.group['translation'].x, 
               y: this.group['translation'].y 
            })
            .to({ 
               x: end.x, 
               y: end.y 
            }, 300)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(function() {
               this.box.group.translation.set(this.x, this.y);
            })
            .start();

         break;

      default:
         break;
   }
}

Box.prototype.SLIDE_IN = function() {

   this.tween['slide'] = new TWEEN.Tween({ box: this, x: this.shape.translation.x }) 
      .to({ x: 0 }, 200)
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate(function() {
         this.box.shape.translation.x = this.x;
         this.box.shadow.translation.x = this.x;
         this.box.face.translation.x = this.x;

         this.box.shape.translation.y = -this.x;
         this.box.shadow.translation.y = -this.x;
         this.box.face.translation.y = -this.x;
      })
      .onStart(function() {
         this.box.group.opacity = 1;
      })
      .onComplete(function() {
         this.box.grid.disabled = false;
      })
      .start();
}

Box.prototype.HIGHLIGHT_REGION = function() {

   var vC = this.grid.orientation.indexOf(this.col);
   var vR = this.grid.orientation.indexOf(this.row);

   switch(juice) {

      case 1:

         if(vC != vR) {

            this.tween['region'] = new TWEEN.Tween({ box: this, linewidth: 0, color: vC > vR ? 'blue' : 'red' })
               .to({ linewidth: 6 }, 200)
               .easing(TWEEN.Easing.Cubic.Out)
               .delay(500 * Math.random())
               .onUpdate(function() {
                  this.box.shape.linewidth = this.linewidth;
               })
               .onStart(function() {
                  this.box.shape.stroke = this.color;
               })
               .start();
            }
         break;
      default:
         break;
   }
}

Box.prototype.UNHIGHLIGHT = function() {
   this.shape.noStroke();
}

Box.prototype.SLIDE_OUT = function() {


   if(this.group.translation.y > this.group.translation.x) {
      var destination = -two.width * 0.2;
   } else if(this.group.translation.y == this.group.translation.x) {
      var destination = (Math.random() > 0.5 ? -two.width: two.width) * 0.2;
   } else {
      var destination = two.width * 0.2;
   }

   this.tween['slide'] = new TWEEN.Tween({ 
         box: this,
         x: this.shape.translation.x 
      }) 
      .to({ 
         x: destination 
      }, 200)
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate(function() {
         this.box.shape.translation.x = this.x;
         this.box.shadow.translation.x = this.x;
         this.box.face.translation.x = this.x;

         this.box.shape.translation.y = -this.x;
         this.box.shadow.translation.y = -this.x;
         this.box.face.translation.y = -this.x;

      })
   .onStart(function() {
      this.box.grid.disabled = true;
      this.box.group.opacity = 0.3;
   })
   .start();
}

Box.prototype.FADE_IN = function() {

   var delay = Math.random() * 200;

   this.tween['fade'] = new TWEEN.Tween({ box: this, s: this.group['scale'], o: this.group['opacity'] })
      .to({ box: this, s: 1, o: 1 }, 100)
      .delay(delay)
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate(function() {
         this.box.group['scale'] = this.s;
      })
      .start();
}

Box.prototype.FADE_OUT = function() {


   var delay = Math.random() * 200;

   var fade = new TWEEN.Tween({ box: this, s: this.group['scale'], o: this.group['opacity'] })
      .to({ s: 0, o: 0 }, 100)
      .delay(delay)
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate(function() {
         this.box.group['scale'] = this.s;
      })
      .start();
}

Box.prototype.SETTLE = function() {

   switch(juice) {

      case 0:

         break;

      case 1:

         var offset = (Math.random() * 100) + 400;
         var delay = (Math.random() * 500) + 200;

         var rotationOffset = (Math.random() * 2 * Math.PI) - 1;

         this.tween = new TWEEN.Tween({ 
            box: this,
            y: -offset,
            o: 0,
            r: rotationOffset,
            s: 1.5,
            sh: 0
         })
         .to({ 
            y: 0,
            o: this.shape.opacity,
            r: this.shape.rotation,
            s: this.shape.scale,
            sh: this.shadow.scale,
         }, 500)
         .delay(delay)
         .easing(TWEEN.Easing.Back.Out)
         .onUpdate(function() {
            this.box.shape['translation'].y = this.y;
            this.box.shape['opacity'] = this.o;
            //this.box.shape['rotation'] = this.r;
            //this.box.shape['scale'] = this.s;
            this.box.shadow['scale'] = this.sh;
         })
         .onStart(function() {
            this.box.shape.visible = true;
            this.box.shadow.visible = true;
            //this.box.shadow.visible = false;
            this.box.shadow.scale = 0;

            this.box.shape['translation'].x = 0;

            this.box.grid.disableMouse();
         })
         .onComplete(function() {
            this.box.shadow.visible = true;
            this.box.grid.enableMouse();
         })
         .start();

         break;

      default:
         break;

   }
}

Box.prototype.OUTLINE_EXTRA = function() {


   switch(juice) {

      case 0:

         if(this.disabled['highlight']) {
            return;
         }
         this.shape.stroke = "black";
         this.shape.linewidth = 4;
         this.group.toFront();
         break;

      case 1:

         if(this.disabled['highlight']) {
            return;
         }

         if(this.tween['highlight'] !== undefined) {
            this.tween['highlight'].stop();
         }


         this.tween['highlight'] = new TWEEN.Tween({ 
               box: this,
               t: this.shape['linewidth'],
               tr: 0,
               sh: 0,
               o: this.shadow['opacity']
            })
            .to({ 
               t: 2.5, 
               tr: -5, 
               sh: 2.5, 
               o: 0.9 
            }, 500)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(function() {
               this.box.shape.translation.x = this.tr;
               this.box.shape.translation.y = this.tr;

               this.box.shadow.translation.x = this.sh;
               this.box.shadow.translation.y = this.sh;


               this.box.face.translation.x = this.tr;
               this.box.face.translation.y = this.tr;

               this.box.shadow.opacity = this.o;
            })
            .onStart(function() {
               this.box.group.toFront();
            })
            .start();
         break;

      default:
         break;
   }
}

Box.prototype.DIAG_OUTLINE = function() {

   var t = new TWEEN.Tween({ box: this, x: this.group.translation.x - 5, or: this.group.translation.x })
      .to({ x: this.group.translation.x + 5 }, 20)
      .yoyo(true)
      .repeat(4)
      .delay(Math.random() * 20)
      .onUpdate(function() {
         this.box.group.translation.set(this.x, this.x);
      })
      .onComplete(function() {
         this.box.group.translation.set(this.or, this.or);
      })
      .start();

}

Box.prototype.OUTLINE = function() {

   switch(juice) {

      case 0:
         if(this.disabled['highlight']) {
            return;
         }
         this.shape.stroke = "black";
         this.shape.linewidth = 10;

         //ensures that the highlighted this will be moved to front after all the others
         var box = this;
         setTimeout(function() {
            box.group.toFront();
         }, 20)

         break;

      case 1:

         if(this.disabled['highlight']) {
            return;
         }

         if(this.tween['highlight'] !== undefined) {
            this.tween['highlight'].stop();
         }

         if(this.tween['chev']) {
            this.tween['chev'].stop();
         }

         this.tween['chev'] = new TWEEN.Tween({
               box: this,
               scale: this.chev.scale,
               origin: this.chev.scale,
               opacity: 0.2,
            })
            .to({ 
               scale: this.chev.scale * 1.4,
               opacity: 1
            }, 500)
            .delay(300)
            .repeat(Infinity)
            .yoyo(true)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(function() {
               this.box.chev.scale = this.scale;
               this.box.chev.opacity = this.opacity;
            })
            .onStart(function() {
               this.box.chev.visible = true;
               this.box.chev.translation.set(0, 0);
            })
            .onStop(function() {
               this.box.chev.scale = this.origin;
               this.box.chev.visible = false;
            })
            .start();



         this.tween['highlight'] = new TWEEN.Tween({ 
               box: this,
               t: this.shape['linewidth'],
               tr: 0,
               sh: 0,
               o: this.shadow['opacity']
            })
            .to({ 
               t: 5, 
               tr: -10, 
               sh: 5, 
               o: 0.9 
            }, 500)
            .delay(20)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(function() {
               this.box.shape.translation.x = this.tr;
               this.box.shape.translation.y = this.tr;

               this.box.chev.translation.x = this.tr;
               this.box.chev.translation.y = this.tr;

               this.box.shadow.translation.x = this.sh;
               this.box.shadow.translation.y = this.sh;

               this.box.face.translation.x = this.tr;
               this.box.face.translation.y = this.tr;

               this.box.shadow.opacity = this.o;
            })
         .onStart(function() {
            this.box.group.toFront();
         })
         .start();
         break;

      default:
         break;
   }
}

Box.prototype.UNOUTLINE_EXTRA = function() {

   switch(juice) {
      case 0:
         this.shape.noStroke();
         break;

      case 1:
         if(this.tween['highlight'] !== undefined) {
            this.tween['highlight'].stop();
         }

         this.tween['highlight'] = new TWEEN.Tween({ 
               box: this,
               tr: this.shape['translation'].x,
               sh: this.shadow['translation'].x,
               o: this.shadow['opacity']
            })
            .to({ 
               tr: 0, 
               sh: 0, 
               o: 0.5 
            }, 400)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(function() {
               this.box.shape.translation.x = this.tr;
               this.box.shape.translation.y = this.tr;
               this.box.shadow.translation.x = this.sh;
               this.box.shadow.translation.y = this.sh;

               this.box.face.translation.x = this.tr;
               this.box.face.translation.y = this.tr;

               this.box.shadow.opacity = this.o;
            })
         .start();

         break;
      default:
         break;
   }

}

Box.prototype.SMILE_ON = function() {


   switch(juice) {

      case 1:

         var t = new TWEEN.Tween({ 
               box: this,
               scale: 0.4, 
               o: 0 
            })
            .to({ 
               scale: 1, 
               o: 1 
            }, 200)
            .delay(Math.random() * 500 + 200)
            .onStart(function() {
               //this.box.face = this.box.faces[0];
               this.box.face.visible = true;
            })
            .onUpdate(function() {
               this.box.face.opacity = this.o;
               this.box.face.scale = this.scale;
            });

         var t2 = new TWEEN.Tween({ 
               box: this,
               scale: 1 
            })
            .to({ 
               scale: 0.5 
            }, 100)
            .onUpdate(function() {
               this.box.face.scale = this.scale;
            });

         t.chain(t2).start();

         break;

      default:
         break;
   }
}

Box.prototype.SMILE_OFF = function() {

   switch(juice) {

      case 1:

         this.face.visible = false;
         //this.face = this.faces[randomInt(0,3)];
         //this.face.visible = true;

         break;

      default:
         break;
   }
}

Box.prototype.UNOUTLINE = function() {

   switch(juice) {
      case 0:
         this.shape.noStroke();
         break;

      case 1:

         if(this.tween['highlight'] !== undefined) {
            this.tween['highlight'].stop();
         }

         if(this.tween['chev']) {
            this.tween['chev'].stop();
         }

         this.tween['highlight'] = new TWEEN.Tween({ 
               box: this,
               tr: this.shape['translation'].x,
               sh: this.shadow['translation'].x,
               o: this.shadow['opacity']
            })
            .to({ 
               tr: 0, 
               sh: 0, 
               o: 0.5 
            }, 400)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(function() {
               this.box.shape.translation.x = this.tr;
               this.box.shape.translation.y = this.tr;
               this.box.shadow.translation.x = this.sh;
               this.box.shadow.translation.y = this.sh;

               this.box.face.translation.x = this.tr;
               this.box.face.translation.y = this.tr;

               this.box.shadow.opacity = this.o;
            })
            .onComplete(function() {
               this.box.chev.visible = false;
            })
         .start();

      default:
         break;

   }
}
