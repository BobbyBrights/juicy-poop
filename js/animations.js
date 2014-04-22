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
      .to({ translation_x: group.translation.x + (3*(intensity-9)) }, intensity*2) 
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

var SQUARES = function(foreground, background, repeat) {

   if(repeat == undefined) {
      repeat = Infinity;
   }

   for(var i = 0; i < 10; i++) {

      var rect = new Two.Polygon(generate((two.width / 10) * i, randomInt(4,8)), true);
      rect.fill = "rgba(255,255,255,0)";
      rect.linewidth = 4;
      rect.stroke = "rgba(100,100,100,1)";
      rect.visible = false;
      //rect.rotation= ;
      background.add(rect);

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
            background.remove(this.rect);
         })
         .start());
   }
}
background_animations.push(SQUARES);

var INTENSE = function(foreground, background) {

   var lines = 60;

   for(var i = 0; i < lines; i++) {

      var line = two.makeLine(-two.width * 1.2, 0, two.width * 1.2, 0);

      var delay = Math.random() * 400;

      line.noFill();
      line.stroke = colorToString(colors[1]['BACKGROUND_FILL'][randomInt(0,5)]);
      line.linewidth = 7;

      //line.rotation = Math.PI * 2 * (i/lines);

      line.visible = false;

      background.add(line);

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

            background.remove(this.line);
         });

      enter.chain(exit).start();


   }

}
background_animations.push(INTENSE);

var BUBBLES = function(foreground, background) {

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
      background.add(circle);

      background.rotation = Math.random() * Math.PI * 2;

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

            background.remove(this.circle);
         })
         .start();

   }
}
background_animations.push(BUBBLES);

var BARS = function(foreground, background) {

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
         .repeat(Infinity)
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

background_animations.push(BARS);

var SWEEP = function(foreground, background) {

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

   _.each(mag, function(m, i) {
      m.linewidth = 10;
      m.cap = 'round';
      m.stroke = 'orangered';
      subgroup.add(m);

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


   return subgroup;

}

var ENTER_BUDDY = function(group) {

   var buddy = assets[4];
   group.add(buddy);
   buddy.visible = false;
   buddy.translation.y = 0;

   var entry = new TWEEN.Tween({ buddy: buddy, x: 400 })
      .to({ x: 0 }, 200)
      .easing(TWEEN.Easing.Cubic.Out)
      .onStart(function() {
         this.buddy.visible = true;
      })
      .onUpdate(function() {
         this.buddy.translation.y = this.x;

      });

   var hover = new TWEEN.Tween({ buddy: buddy, x: 0 })
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

   entry.chain(hover).start();

   return buddy;
}

function DNA(foreground) {

   this.group = assets[9];
   this.group.visible = false;
   this.group.stroke = 'black';
   this.group.linewidth = 2;

   this.group.scale = 2;

   this.sep = [];

   var index = 0;
   _.each(this.group.children, function(seg, i) {
      if(index == 0) {
         this.dna1 = seg;
      } else if (index == 2) {
         this.dna2 = seg;
      } else {

         this.sep.push(seg);
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

   this.group.noFill();
   this.group.linewidth = 20;
   this.dna1.stroke = 'blue';
   this.dna2.stroke = 'red';

   this.tween = [];

   switch(juice) {

      case 1:

         this.tween.push(new TWEEN.Tween({ dna: this, r: 0, y: 0 })
            .to({ r: Math.PI / 24 * Math.random(), y: -10 }, 2000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .delay(Math.random() * 100 + 200)
            .repeat(Infinity)
            .yoyo(true)
            .onUpdate(function() {
               this.dna.group.translation.y = this.y;
               this.dna.group.rotation = this.r;
            })
            .start());

         this.tween.push(new TWEEN.Tween({ dna: this, x1: this.dna1.translation.x, x2: this.dna2.translation.x })
            .to({ x1: this.dna1.translation.x - 10, x2: this.dna1.translation.x + 10 }, 1400)
            .easing(TWEEN.Easing.Bounce.Out)
            .delay(Math.random() * 200 + 4000)
            .repeat(Infinity)
            .yoyo(true)
            .onUpdate(function() {

               this.dna.dna1.translation.x = this.x1;
               this.dna.dna2.translation.x = this.x2;
            })
            .start());

         break;
      default:
         break;
   }
}

DNA.prototype.SPLIT = function() {

   console.log(this.dna1.vertices);


   this.dnacopy1 = this.dna1.clone();
   this.dnacopy2 = this.dna2.clone();

   switch(juice) {
      case 1:
      
         this.dnacopy1.noFill();
         this.dnacopy1.stroke = 'blue';
         this.dnacopy1.linewidth = 20;

         this.dnacopy2.noFill();
         this.dnacopy2.stroke = 'red';
         this.dnacopy2.linewidth = 20;

         this.tween.push(new TWEEN.Tween({ 
               dna: this, 
               r: this.group.rotation,
               x1: this.dna1.translation.x,
               xc1: this.dnacopy1.translation.x,
               x2: this.dna2.translation.x,
               xc2: this.dnacopy2.translation.x,
               o: 1
            })
            .to({
               r: 0,
               x1: this.dna1.translation.x - 40,
               xc1: this.dnacopy1.translation.x + 40,
               x2: this.dna2.translation.x - 40,
               xc2: this.dnacopy2.translation.x + 40,
               o: 0
            }, 1000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(function() {

               _.each(this.dna.sep, function(sep) {
                  sep.opacity = this.o;
               }, this)

               this.dna.group.rotation = this.r;
               this.dna.dna1.translation.x = this.x1;
               this.dna.dnacopy1.translation.x = this.xc1;
               this.dna.dna2.translation.x = this.x2;
               this.dna.dnacopy2.translation.x = this.xc2;
            })
            .start());
      
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
   var background = grid.background;
   var foreground = grid.foreground;

   background.rotation = 0;

   var line = two.makeLine(-two.width, 0, two.width, 0);
   line.rotation = Math.PI * 1/4;
   line.translation.set(two.width/2, -two.width/2);
   line.stroke = "black";

   var line2 = two.makeLine(-two.width, 0, two.width, 0);
   line2.rotation = Math.PI * 1/4;
   line2.translation.set(two.width/2, -two.width/2);
   line2.stroke = "black";


   var t = new TWEEN.Tween({
         x: two.width/2,
         y: -two.width/2,
         line: line,
         x2: -two.width/2,
         y2: two.width/2,
         line2: line2, 
         width: 100,
         o: 0

      })
      .easing(TWEEN.Easing.Cubic.Out)
      .to({ x: 0, y: 0, x2: 0, y2: 0, width: 1, o: 0.2 }, 1000)
      .onStart(function() {
         background.add(line);
         background.add(line2);
      })
      .onUpdate(function() {
         this.line.opacity = this.o;
         this.line.linewidth = this.width;
         this.line.translation.set(this.x, this.y);

         this.line2.opacity = this.o;
         this.line2.linewidth = this.width;
         this.line2.translation.set(this.x2, this.y2);
      })
      .onComplete(function() {
         background.remove(line);
         background.remove(line2);
      })
      .start();

}

/*
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
*/
