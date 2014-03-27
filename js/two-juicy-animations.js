function colorToString(r,g,b,a) {
   return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

function Box(row, col, width, x, y, datum) {

   this.width = width;
   this.row = row;
   this.col = col;
   this.datum = datum;

   this.animations = 
   {
      points:
      {
         origin: this.generate(this.width, 4),
      },
      color: 
      {
         origin: { r: 0, g: this.datum > 0 ? 255 : 0, b: this.datum == 0 ? 255 : 0 },
      },
      linewidth:
      {
         origin: 1,
      },
      translation:
      {
         origin: { x: x, y: y },
      },
      rotation:
      {
         origin: Math.PI / 4,
      },
      scale:
      {
         origin: 1,
      }
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

   this.shape = new Two.Polygon(this.animations['points'].origin, true);

   this.setTranslation(); 
   this.shape.rotation = this.animations['rotation'].origin;
   this.shape.fill = colorToString(
         this.animations['color'].origin.r,
         this.animations['color'].origin.g,
         this.animations['color'].origin.b,
         0.75); 
}

Box.prototype.setTranslation = function() {
   this.shape.translation.set(
      this.animations['translation'].origin.x, 
      this.animations['translation'].origin.y);

}

Box.prototype.generate = function(radius, amount) {

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

Box.prototype.animate = function(fn, vector) {

   fn(this, vector);
}

var REDRAW_MOUSE_COL = function(box, mouse) {
   var vR = grid.orientation.indexOf(box.row);

   box.animations['translation'].origin.x = mouse.x; 
   box.animations['translation'].origin.y = grid.vectors[vR].y; 

   box.setTranslation(); 
}

var REDRAW_MOUSE_ROW = function(box, mouse) {
   var vC = grid.orientation.indexOf(box.col);

   box.animations['translation'].origin.x = grid.vectors[vC].x; 
   box.animations['translation'].origin.y = mouse.y; 

   box.setTranslation(); 
}

var REDRAW_MOUSE = function(box, mouse) {

   box.shape.translation.set(mouse.x, mouse.y);
}

function squish(box, vector) {
   box.shape.vertices[1].y = box.shape.vertices[1].origin.y - 20;
   box.shape.vertices[3].y = box.shape.vertices[3].origin.y + 20;
}

var REDRAW_JUICY = function(box) {

   var vC = grid.orientation.indexOf(box.col);
   var vR = grid.orientation.indexOf(box.row);

   box.animations['translation'].origin.x = grid.vectors[vC].x; 
   box.animations['translation'].origin.y = grid.vectors[vR].y; 


   var half_movex = box.animations['translation'].origin.x - box.shape['translation'].x / 2;
   var half_movey = box.animations['translation'].origin.y - box.shape['translation'].y / 2;

   var vecStart = box.shape['translation'].clone(); 
   var vecEnd = new Two.Vector(
         box.animations['translation'].origin.x, 
         box.animations['translation'].origin.y); 

   var redraw = new TWEEN
      .Tween({ 
         x: box.shape['translation'].x,
         y: box.shape['translation'].y
      })
      .to({ 
         x: box.animations['translation'].origin.x,
         y: box.animations['translation'].origin.y,
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

}

var REDRAW = function(box) {

   var vC = grid.orientation.indexOf(box.col);
   var vR = grid.orientation.indexOf(box.row);

   box.animations['translation'].origin.x = grid.vectors[vC].x; 
   box.animations['translation'].origin.y = grid.vectors[vR].y; 

   var redraw = new TWEEN
      .Tween({ 
         x: box.shape['translation'].x,
         y: box.shape['translation'].y
      })
      .to({ 
         x: box.animations['translation'].origin.x,
         y: box.animations['translation'].origin.y,
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


var OUTLINE = function(box) {

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
         box.shape.linewidth = box.animations['linewidth'].origin + this.t;
      })

   box.tween['highlight'].start();
};

var UNOUTLINE = function(box) {

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
         box.shape.linewidth = box.animations['linewidth'].origin + this.t;
      })
      .onComplete(function() {
         box.shape.stroke = "black";
      })

   box.tween['highlight'].start();
}

var POP = function(box) {

   var big = new TWEEN.Tween({ s: box.shape['scale'] })
      .to({ s: 1.42 }, 100)
      .delay(300)
      .easing(TWEEN.Easing.Cubic.In)
      .onUpdate(function() {
         box.shape['scale'] = this.s;
      })

   var small = new TWEEN.Tween({ s: 1.42 })
      .to({ s: box.animations['scale'].origin }, 100)
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

var SHINE = function(box) {

   var big = new TWEEN.Tween({ s: box.shape['scale'], r: box.shape['rotation'] })
      .to({ s: 1.42, r: box.animations['rotation'].origin + Math.PI*2 }, 100)
      .delay(300)
      .easing(TWEEN.Easing.Cubic.In)
      .onUpdate(function() {
         box.shape['scale'] = this.s;
         box.shape['rotation'] = this.r;
      })
      .onStart(function() {
         box.animations['linewidth'].origin = 0;
         box.shape['linewidth'] = 0;
         box.disabled['highlight'] = true;
      })

   var color_in = new TWEEN.Tween(
         { 
            r: box.animations['color'].origin.r, 
            g: box.animations['color'].origin.g, 
            b: box.animations['color'].origin.b, 
         })
         .to({ r: 255, b: 255, g: 255 }, 100)
         .delay(30 * grid.orientation.indexOf(box.row) + 30* grid.orientation.indexOf(box.col))
         .easing(TWEEN.Easing.Cubic.InOut)
         .onUpdate(function() {
            box.shape.fill = colorToString(Math.round(this.r),Math.round(this.g),Math.round(this.b), 0.75);
         })

   var color_out = new TWEEN.Tween({ r: 255, b: 255, g: 255 })
         .to(
         { 
            r: box.animations['color'].origin.r, 
            g: box.animations['color'].origin.g, 
            b: box.animations['color'].origin.b, 
         }, 100)
         .onUpdate(function() {
            box.shape.fill = colorToString(Math.round(this.r),Math.round(this.g),Math.round(this.b), 0.75);
         })

   var small = new TWEEN.Tween({ s: 1.42, r: box.shape['rotation'] })
      .to({ s: box.animations['scale'].origin, r: box.animations['rotation'].origin }, 200)
      .delay(500)
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate(function() {
         box.shape['scale'] = this.s;
         box.shape['rotation'] = this.r;
      })
      .onComplete(function() {
         box.animations['linewidth'].origin = 1;
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

var SPIN = function(box) {

   var group = new Two.Group();
}

var FLIP = function(box) {

}

var bounce = function(box) {

   box.animation = new TWEEN.Tween({ y: box.shape.translation.y })
      .to({ y : box.shape.translation.y - 15 }, 100)
      .easing(TWEEN.Easing.Cubic.In)
      .onUpdate(function() {
         box.shape.translation.y = this.y;

      })

   var animation_out = new TWEEN.Tween({ y: box.shape.translation.y - 15 })
      .to({ y : box.shape.translation.y }, 100)
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate(function() {
         box.shape.translation.y = this.y;

      })

   box.animation.chain(animation_out);
   box.animation.start();

}

var flip = function(box) {

   function apply() {

   }

   function unapply() {

   }

   function reset() {

   }

   return {
      apply: apply(),
      unapply: unapply(),
      reset: reset()
   }
}

var pop = function(box) {

   function apply() {

      var originalRotation = box.shape.rotation;
      var cIndex = grid.orientation.indexOf(box.col);
      var rIndex = grid.orientation.indexOf(box.row);

      var animation = new TWEEN.Tween({ scale: box.shape.scale, rotation: originalRotation })
         .to({ scale: 1.42, rotation: originalRotation + 2*Math.PI }, 100)
         .delay(25 * cIndex + 25 * rIndex)
         .easing(TWEEN.Easing.Cubic.In)
         .onUpdate(function() {
            box.shape.scale = this.scale;
            box.shape.rotation = this.rotation;
         })
         .onComplete(function() {
            box.shape.linewidth = 0;
         });


      var animation_color = new TWEEN.Tween({ r: box.color.r, b: box.color.b, g: box.color.g })
         .to({ r: 255, b: 255, g: 255 }, 100)
         .delay(500)
         .easing(TWEEN.Easing.Cubic.InOut)
         .onUpdate(function() {
            box.shape.fill = 'rgba(' 
               + Math.round(this.r) + ',' 
               + Math.round(this.b) + ',' 
               + Math.round(this.g) + ', 0.75)';
         })

      var animation_color_out = new TWEEN.Tween({ r: 255, b: 255, g: 255 })
         .to({ r: box.color.r, b: box.color.b, g: box.color.g }, 100)
         .onUpdate(function() {
            box.shape.fill = 'rgba(' 
               + Math.round(this.r) + ',' 
               + Math.round(this.b) + ',' 
               + Math.round(this.g) + ', 0.75)';
         })

      var animation_out = new TWEEN.Tween({ scale: 1.42, rotation: originalRotation + 2*Math.PI })
         .to({ scale: 1, rotation: originalRotation }, 100)
         .delay(500)
         .easing(TWEEN.Easing.Cubic.Out)
         .onUpdate(function() {
            box.shape.scale = this.scale;
            box.shape.rotation = this.rotation;
         })
         .onComplete(function() {
            box.shape.linewidth = 1;
         });

      animation.chain(animation_color);
      animation_color.chain(animation_color_out);
      animation_color_out.chain(animation_out);
      animation.start();

   }

   function clear() {

   }

   function unapply() {

   }

   return {
      apply: apply,
      unapply: unapply,
      clear: clear
   }

}

var outline = function(box) {

   function unapply(){ 

      var a_unapply = new TWEEN.Tween({ linewidth: box.shape.linewidth })
         .to({ linewidth: 1 }, 50)
         .easing(TWEEN.Easing.Cubic.Out)
         .onUpdate(function() {
            box.shape.linewidth = this.linewidth;
         })
         .onComplete(function() {
            box.shape.stroke = "black";
            //grid.background.remove(rects);
         })
         .start();
   };

   function apply() {
      var a_apply = new TWEEN.Tween({ linewidth: box.shape.linewidth })
         .to({ linewidth: 15 }, 50)
         .easing(TWEEN.Easing.Cubic.Out)
         .onUpdate(function() {
            box.shape.linewidth = this.linewidth;
         })
         .start();

      box.shape.stroke = "orangered";
   }

   function clear() {
      console.log('clear ' + box.row);
   }

   return {
      apply:apply,
      unapply:unapply,
      clear:clear
   }
}


var fade = function(box) {
   box.unhighlight = function() { 
      box.animation.stop(); 
      console.log('unhighlight') 

      box.animation = new TWEEN.Tween({ scale: box.shape.scale, opacity: box.shape.opacity })
         .to({ scale: 1, opacity: 1 })
         .easing(TWEEN.Easing.Cubic.Out)
         .onUpdate(function() {
            box.shape.scale = this.scale;
            box.shape.opacity = this.opacity;
         }).start();

   };

   if(box.animation) {
      box.animation.stop();
   }

   box.animation = new TWEEN.Tween({ scale: box.shape.scale, opacity: box.shape.opacity })
      .to({ scale: 2, opacity: 0 })
      .easing(TWEEN.Easing.Elastic.Out)
      .onUpdate(function() {
         box.shape.scale = this.scale;
         box.shape.opacity = this.opacity;
      });

   var animation_out = new TWEEN.Tween({ scale: 0.3, opacity: 0 })
      .to({ scale: 1, opacity: 1 })
      .easing(TWEEN.Easing.Elastic.Out)
      .onUpdate(function() {
         box.shape.scale = this.scale;
         box.shape.opacity = this.opacity;
      });
   
   box.animation.chain(animation_out);
   box.animation.start();

}
