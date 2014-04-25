var background_animations = [];

var tweens = [];

function stopAllTweens() {

   _.each(tweens, function(tween) {
      tween.stop();
   })
}

var SHAKE = function(group, intensity) {

   if(!intensity) {
      intensity = 0;
   }

   var t = new TWEEN.Tween({ translation_x: group.translation.x })
      .to({ translation_x: group.translation.x + (3*(intensity-4)) }, intensity*2) 
      .delay(50)
      .repeat(3)
      .yoyo(true)
      .onUpdate(function() {
         group.translation.y = this.translation_x;
      })
      .start();
}
      

var RESET = function(group) {

   var t = new TWEEN.Tween({ scale: 1, group: group })
      .to({ scale: 0.5 }, 300)
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate(function() {
         this.group.scale = this.scale;
      })

   var t2 = new TWEEN.Tween({ scale: 0.5, group: group })
      .to({ scale: 1}, 150)
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate(function() {
         this.group.scale = this.scale;
      })

   t.chain(t2).start();
}

var SQUARES = function(repeat) {

   var group = sweepground;

   if(repeat == undefined) {
      repeat = Infinity;
   }

   for(var i = 0; i < 10; i++) {

      var rect = new Two.Polygon(generate((two.width / 10) * i, randomInt(4,8)), true);
      rect.fill = "rgba(255,255,255,0)";
      rect.linewidth = 4;
      rect.stroke = "rgba(100,100,100,1)";
      rect.visible = false;
      group.add(rect);

      tweens.push(new TWEEN.Tween({ scale: 1, rect: rect, i: i })
         .to({ scale: 0.5 }, 300)
         .delay(50 * i)
         .repeat(repeat)
         .yoyo(true)
         .easing(TWEEN.Easing.Cubic.Out)
         .onStart(function() {
            this.rect.visible = true;
         })
         .onUpdate(function() {
            this.rect.scale = this.scale;
         })
         .onComplete(function() {
            group.remove(this.rect);
         })
         .start());
   }
}
background_animations.push(SQUARES);

var INTENSE = function() {

   var group = sweepground;
   var lines = 60;

   for(var i = 0; i < lines; i++) {

      var line = two.makeLine(-two.width * 1.2, 0, two.width * 1.2, 0);

      var delay = Math.random() * 400;

      line.noFill();
      line.stroke = colorToString(colors[1]['BACKGROUND_FILL'][randomInt(0,5)]);
      line.linewidth = 7;

      //line.rotation = Math.PI * 2 * (i/lines);

      line.visible = false;

      group.add(line);

      var enter = new TWEEN.Tween({ line: line, r: Math.PI*2*(i/lines) })
         .to({ r: Math.PI*2*(i/lines)+((i%2==0?-1:1)*Math.PI*2*(1/lines)) }, 300)
         .delay(delay)
         .repeat(Infinity)
         .yoyo(true)
         .easing(TWEEN.Easing.Cubic.Out)
         .onStart(function() {

            this.line.visible = true;
         })
         .onUpdate(function() {
            this.line.rotation = this.r;

         })
               
      var exit = new TWEEN.Tween({ line: line, s: 1 })
         .to({ s: 0 }, 200)
         .easing(TWEEN.Easing.Cubic.Out)
         .onUpdate(function() {
            this.line.scale = this.s;
         })
         .onComplete(function() {

            group.remove(this.line);
         });

      enter.chain(exit).start();


   }

}
background_animations.push(INTENSE);

var BUBBLES = function() {

   var group = sweepground;
   var bubbles = 70;

   for(var i = 0; i < bubbles; i++) {

      //var y = i*10*Math.random();
      //var x = i*10*Math.random();
      //
      var width = Math.random() * 40 + 10;

      var y = two.width / 2;
      var x = Math.random() * two.width - (two.width/2 + 50);

      var delay = 500 * Math.random() + 100;

      var dest_y = y + (-1 * ((two.width-400) * Math.random() + 400));
      var dest_x = x + ((i%2 == 0 ? 1 : -1) * 300 * Math.random());

      var color = colors[1].BACKGROUND_FILL[randomInt(0,5)]; 

      var circle = two.makeCircle(x, y, width);
      circle.fill = colorToString(color);
      circle.noStroke();
      //circle.stroke = "black";
      //circle.linewidth = 1;
      circle.visible = false;
      group.add(circle);

      group.rotation = Math.random() * Math.PI * 2;

      BUBBLES.tween = new TWEEN.Tween({ circle: circle, y: y, x: x })
         .to({ y: dest_y, x: dest_x }, 500)
         .delay(delay)
         .repeat(Infinity)
         .yoyo(true)
         .easing(TWEEN.Easing.Cubic.Out)
         .onStart(function() {

            this.circle.visible = true;
         })
         .onUpdate(function() {
            this.circle.translation.set(this.x, this.y);

         })
         .onComplete(function() {

            group.remove(this.circle);
         })
         .start();

   }
}
background_animations.push(BUBBLES);

var BARS = function() {

   switch(juice) {
      case 1:
      var group = sweepground;

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
         group.add(rect);

         var dest = (two.width) * (isLeft?-1:1);
         var start = (two.width) * (isLeft?1:-1);

         BARS.tween = new TWEEN.Tween({ x: start, rect: rect, i: i })
            .to({ x: dest}, 500)
            .delay(5 * i)
            .repeat(Infinity)
            .easing(TWEEN.Easing.Cubic.Out)
            .onStart(function() {
               this.rect.visible = true;

               if(this.i == 0) {
                  group.rotation = Math.random() * Math.PI * 2;
               }
            })
            .onUpdate(function() {
               this.rect.translation.x = this.x;
            })
            .onComplete(function() {
               group.remove(this.rect);

               if(this.i == 50) {
                  group.rotation = 0;
               }
            })
            .start();
      }

      default:
      break;
   }
}

background_animations.push(BARS);

var SWEEP = function() {

   var group = sweepground;

   switch(juice) {

      case 1:

         if(SWEEP.tween !== undefined) {
            return;
         }
         //get a random color

         var c = colors[1]['BACKGROUND_FILL'][randomInt(0,5)]

         var rect = new Two.Polygon(generate(two.width, 4), true);
         rect.fill = colorToString(c)
         rect.noStroke();
         rect.visible = false;

         group.add(rect);

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
               _.each(group.children, function(v, i) {

                  if(v.id != this.rect.id) {
                     group.remove(v)
                  }

               }, this)

               SWEEP.tween = undefined;

            })
            .start();
      break;
      default:
      break;
   }
}

var ENTER_PYRO = function(group) {

   var subgroup = two.makeGroup();
   group.add(subgroup);

   var circle1 = two.makeCircle(-150, -50, 100);
   circle1.stroke = 'black';
   circle1.linewidth = 5;

   var circle2 = two.makeCircle(50, 40, 10);
   circle2.stroke = 'black';
   circle2.linewidth = 5;

   var line1 = two.makeLine(-150,50, 50, 50);
   line1.stroke = 'black';
   line1.linewidth = 5;

   var line2 = two.makeLine(-92, -132, 60, 37);
   line2.stroke = 'black';
   line2.linewidth = 5;

   var mag = [];

   mag.push(two.makeLine(-220, -80, -100, -80));
   mag.push(two.makeLine(-220, -60, -100, -60));
   mag.push(two.makeLine(-220, -40, -100, -40));

   subgroup.add(line1);
   subgroup.add(line2);
   subgroup.add(circle2);
   subgroup.add(circle1);
   subgroup.add(mag[0]);
   subgroup.add(mag[1]);
   subgroup.add(mag[2]);

   subgroup.translation.set(0,30);

   switch(juice) {

      case 0:

         _.each(mag, function(m, i) {
            m.linewidth = 10;
            m.cap = 'round';
            m.stroke = "#666";
            m.visible = true;
         }, this)
         break;

      case 1:

         _.each(mag, function(m, i) {
            m.linewidth = 10;
            m.cap = 'round';
            m.stroke = 'orangered';

            m.visible = false;

            var t = new TWEEN.Tween({ m: m, x: -100 })
            .to({ x: 0 }, 2000)
            .delay(120 * i)
            .easing(TWEEN.Easing.Cubic.InOut)
            .repeat(Infinity)
            .onStart(function() {
               this.m.visible = true;
               this.m.vertices[1].origin = this.m.vertices[1].clone();
               console.log(this.m.vertices);
            })
            .onUpdate(function() {
               this.m.vertices[1].x = this.m.vertices[1].origin.x + this.x;
            })
            .start();
         })
         break;
      default:
         break;
   }

   return subgroup;

}

var BUDDY = function(group) {

   this.buddy = assets[4];
   group.add(this.buddy);
   this.buddy.visible = false;
   this.buddy.translation.y = 0;
}

BUDDY.prototype.ENTER = function() {

   switch(juice) {

      case 0:

         this.buddy.visible = true;
         this.buddy.children[18].fill = '#666';
         this.buddy.translation.set(0,0);

         break;

      case 1:

         this.tween = new TWEEN.Tween({ buddy: this.buddy, x: 400 })
            .to({ x: 0 }, 200)
            .easing(TWEEN.Easing.Cubic.Out)
            .onStart(function() {
               this.buddy.visible = true;
            })
            .onUpdate(function() {
               this.buddy.translation.y = this.x;

            });

         var hover = new TWEEN.Tween({ buddy: this.buddy, x: 0 })
            .to({ x: 10 }, 700)
            .delay(100 * Math.random() + 100)
            .yoyo(true)
            .repeat(Infinity)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(function() {
               this.buddy.translation.y = this.x;
            })
            .onComplete(function() {
               this.buddy.visible = false;
            })

         this.tween.chain(hover).start();

         break;

      default:
         break;
   }
}

BUDDY.prototype.MOVE = function() {

   switch(juice) {
      
      case 0:

         this.buddy.visible = false;
         this.buddy.translation.set(-350, 300);

         break;

      case 1:

         if(this.tween) {
            this.tween.stop();
         }

         this.tween = new TWEEN.Tween({ buddy: this.buddy, x: this.buddy.translation.x, y: this.buddy.translation.y })
            .to({ x: -350, y: 300 }, 1500)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(function() {
               this.buddy.translation.set(this.x, this.y);
            })
            .start();

      default:
         break;
   }
}

function DNA(foreground) {

   this.dna1 = assets[9].clone();
   this.dna2 = assets[9].clone();

   this.dna1.scale = 1.8;
   this.dna2.scale = 2;

   this.group = two.makeGroup();
   this.group.add(this.dna1).add(this.dna2);

   this.dna1.visible = false;
   this.dna2.visible = false;

   this.group.scale = 1;

   this.sep = [];
   this.seg1 = [];
   this.seg2 = [];

   var index = 0;
   _.each(this.dna1.children, function(seg, i) {
      if(index == 1 || index == 3) {
         this.sep.push(seg);
      } else if (index == 0) {
         this.seg1.push(seg);
      } else {
         this.seg2.push(seg);
      }

      index++;
   }, this)

   var index = 0;
   _.each(this.dna2.children, function(seg, i) {
      if(index == 1 || index == 3) {
         this.sep.push(seg);
      } else if (index == 0) {
         this.seg1.push(seg);
      } else {
         this.seg2.push(seg);
      }
      index++;
   }, this)


   foreground.add(this.group);
}

DNA.prototype.DETWEEN = function() {

   _.each(this.tween, function(t) {
      t.stop();
   })
}

DNA.prototype.ENTER = function() {

   this.group.visible = true;
   this.dna1.visible = true;
   this.dna2.opacity = 0;

   this.group.noFill();
   this.group.linewidth = 20;

   this.tween = [];

   switch(juice) {

      case 0:

         _.each(this.sep, function(seg) {
            seg.stroke = 'black';
         });
         _.each(this.seg1, function(seg) {
            seg.stroke = '#bbb';
         });
         _.each(this.seg2, function(seg) {
            seg.stroke = '#666';
         });


         break;

      case 1:

         _.each(this.sep, function(seg) {
            seg.stroke = 'black';
         });
         _.each(this.seg1, function(seg) {
            seg.stroke = 'red';
         });
         _.each(this.seg2, function(seg) {
            seg.stroke = 'blue';
         });

         var enter = new TWEEN.Tween({ dna: this, r: Math.PI * 12, scale: 0, opacity: 0, y: 0 })
               .to({ r: 0, scale: 1, opacity: 1, y: -10  }, 5000)
               .easing(TWEEN.Easing.Back.Out)
               .onUpdate(function() {
                  this.dna.group.translation.y = this.y;
                  this.dna.group.rotation = this.r;
                  this.dna.group.scale = this.scale;
                  this.dna.group.opacity = this.opacity;
               });


         var spin = new TWEEN.Tween({ dna: this, r: 0, scale: 1 })
               .to({ r: -Math.PI / 6, scale: 1.1 }, 2000)
               .easing(TWEEN.Easing.Cubic.InOut)
               .repeat(Infinity)
               .yoyo(true)
               .onUpdate(function() {
                  this.dna.group.rotation = this.r;
                  this.dna.group.scale = this.scale;
               });

         enter.chain(spin).start();
         //enter.start();

         this.tween.push(enter);

         /*
         this.tween.push(new TWEEN.Tween({ dna: this, x1: this.dna1.translation.x, x2: this.dna2.translation.x })
            .to({ x1: this.dna1.translation.x - 10, x2: this.dna1.translation.x + 10 }, 1400)
            .easing(TWEEN.Easing.Bounce.Out)
            .delay(4000)
            .onUpdate(function() {

               this.dna.dna1.translation.x = this.x1;
               this.dna.dna2.translation.x = this.x2;
            })
            .start());

            */
         break;
      default:
         break;
   }
}

DNA.prototype.SPLIT = function() {


   this.dots = [];
   this.dots.push(two.makeCircle(-160, 0, 5));
   this.dots.push(two.makeCircle(-140, 0, 5));
   this.dots.push(two.makeCircle(-120, 0, 5));
   
   this.dots.push(two.makeCircle(160, 0, 5));
   this.dots.push(two.makeCircle(140, 0, 5));
   this.dots.push(two.makeCircle(120, 0, 5));

   _.each(this.dots, function(dot) {
      dot.noFill();
      dot.noStroke();
   })

   this.group.add(this.dots);
   

   switch(juice) {
      case 0:

         this.dna2.opacity = 1;

         this.dna1.translation.x -= 70;
         this.dna2.translation.x += 70;

         _.each(this.sep, function(sep) {
            sep.stroke = 'black';
            sep.opacity = 0.2;
         })

         _.each(this.dots, function(dot) {

            dot.stroke = "black";
         });

         break;
      case 1:


         var split = new TWEEN.Tween({ 
               dna: this, 
               r: this.group.rotation,
               x1: this.dna1.translation.x,
               x2: this.dna2.translation.x + 1000,
               dnao: 0,
               o: 1
            })
            .to({
               r: 0,
               x1: this.dna1.translation.x - 70,
               x2: this.dna2.translation.x + 70,
               dnao: 1,
               o: 0.2
            }, 1000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(function() {

               this.dna.dna2.opacity = this.dnao;
               //this.dna.dna1.opacity = this.dnao;

               _.each(this.dna.sep, function(seg) {
                  seg.opacity = this.o;
               }, this);


               this.dna.group.rotation = this.r;
               this.dna.dna1.translation.x = this.x1;
               this.dna.dna2.translation.x = this.x2;
            }).start();


            _.each(this.dots, function(dot, i) {

               setTimeout(function(dna, dot) {

                  dna.tween.push(new TWEEN.Tween({ dot: dot, scale: 1.4 })
                     .to({ scale: 1 }, 600)
                     .delay(1500)
                     .repeat(Infinity)
                     .easing(TWEEN.Easing.Back.Out)
                     .onUpdate(function() {
                        this.dot.scale = this.scale;
                     })
                     .onStart(function() {
                        this.dot.stroke = 'black';
                     })
                     .onStop(function() {
                        this.dot.scale = 1;
                     })
                     .start());

               }, i * 300, this, dot);

            }, this)
      
         break;
      default:
         break;
   }

}

DNA.prototype.CHECK = function() {

   switch(juice) {
      case 0:
         break;
      case 1:
         _.each(this.dots, function(dot, i) {

            this.tween.push(new TWEEN.Tween({ dot: dot, scale: 1, x: dot.translation.x })
               .to({ scale: 0, x: (i > 2 ? 60 : -60) }, 600)
               .easing(TWEEN.Easing.Back.Out)
               .onUpdate(function() {
                  this.dot.scale = this.scale;
                  this.dot.translation.x = this.x;
               })
               .onStart(function() {
                  this.dot.stroke = 'black';
               })
               .start());
         }, this);

         break;
      default:
         break;
   }
   
}

DNA.prototype.DESTROY = function() {
   foreground.remove(this.group);
}

var OUR_BUDDY = function(foreground, background, html) {

   var buddy = assets[4];
   foreground.add(buddy);

   $('#speech-bubble').html(html);
   $('#speech-bubble').css('visibility', 'hidden');
   $('#speech-bubble').css('right', '230px');
   $('#speech-bubble').css('width', 'auto');

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
         $('#speech-bubble').css('bottom', (this.x+60)+'px');
      })
      .onStart(function() {
         $('#speech-bubble').css('visibility', 'visible');
      })
      .onComplete(function() {
         this.buddy.visible = false;
      })

   entry.chain(hover).start();

   grid.disableMouse();


   setTimeout(function() {
      $(window).one('mousedown', function(e) {

         e.preventDefault();
         e.stopPropagation();
         hover.stop();
         buddy.visible = false;
         grid.enableMouse();
         //$('#speech-bubble').css('visibility', 'hidden');

         var remember = new TWEEN.Tween({ 
               b: parseInt($('#speech-bubble').css('bottom').slice(0,-2)),
               r: parseInt($('#speech-bubble').css('right').slice(0,-2)),
               w: $('#speech-bubble').innerWidth()
            })
            .to({
               b: 0,
               r: 0, 
               w: 600-40
            }, 200)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(function() {
               $('#speech-bubble')
                  .css('bottom', this.b+'px')
                  .css('right', this.r+'px')
                  .width(this.w)
            })
            .start();

      })
   }, 1000)

}

var GRAB_INDICATOR = function() {

   switch(juice) {

      case 0:

      _.each(grid.boxes.diagonal, function(box) {
         box.chev.fill = 'black';
         box.chev.visible = true;
         box.chev.stroke = 'black';
         box.chev.linewidth = 3;

         setTimeout(function(box) { box.chev.visible = false; }, 500, box);
      })

      break;

      case 1:
      _.each(grid.boxes.diagonal, function(box) {
         box.DIAG_OUTLINE();
      })

      break;

      default:
      break;
   }
}

var LABELS = function(grid) {

   this.grid = grid;
   this.colshapes = [];
   this.rowshapes = [];

   for(var i = 0; i < grid.vectors.length; i++) {

      var rowshape = two.makeRectangle(0,0, grid.vectors.length * 110, 15);
      var colshape = two.makeRectangle(0,0, 15, grid.vectors.length * 110);
/*
      if(i == 0) {
         var rowshape = two.makeCircle(0,0,1);
         var colshape = two.makeCircle(0,0,1);

         colshape.fill = "black";
         rowshape.fill = "black";
      } else {
         var points = generate(10, i+1);
         var rowshape = new Two.Polygon(points, true);
         var colshape = new Two.Polygon(points, true);

         rowshape.noFill();
         colshape.noFill();
      }

      rowshape.stroke = 'black';
      rowshape.linewidth = 4;

      colshape.stroke = 'black';
      colshape.linewidth = 4;
      */

      rowshape.fill= colorToString(colors[juice]['BACKGROUND_FILL'][i]);
      colshape.fill = colorToString(colors[juice]['BACKGROUND_FILL'][i]);
      rowshape.stroke = "white";
      colshape.stroke = "white";

      rowshape.linewidth = 3;
      colshape.linewidth = 3;

      //console.log(grid, colshape, rowshape);
      grid.background.add(colshape);
      grid.background.add(rowshape);

      this.colshapes.push(colshape);
      this.rowshapes.push(rowshape);

   }

}

LABELS.prototype.REMOVE = function() {

   this.grid.background.remove(this.colshapes);
   this.grid.background.remove(this.rowshapes);
}

LABELS.prototype.REDRAW = function() {


   _.each(this.colshapes, function(c, i) {

      var vC = this.grid.orientation.indexOf(i);
      c.translation.set(this.grid.vectors[vC].x, 0);

   },this)

   _.each(this.rowshapes, function(c, i) {

      var vC = this.grid.orientation.indexOf(i);
      c.translation.set(0, this.grid.vectors[vC].y);

   },this)
}
