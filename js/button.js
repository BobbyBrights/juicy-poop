function Button(group, x, y, width, height, text, onClick) {

   this.height = height;
   this.width = width;
   this.onClick = onClick;

   this.group = two.makeGroup();

   this.shadow = two.makeRectangle(0, 0, this.width, this.height);
   this.shape = two.makeRectangle(0, 0, this.width, this.height);

   this.shape.noStroke().fill = colorToString(colors[juice].FILL['UPPER_THRESHOLD']);
   this.shadow.noStroke().fill = colorToString(colors[juice].SHADOW['UPPER_THRESHOLD']);

   this.group.add(this.shadow);
   this.group.add(this.shape);

   this.parent = group;
   this.parent.add(this.group);

   this.group.translation.set(x,y);

   $('#game-container').append('<div class="text juice-' + juice + '" id=text-' + this.group.id + '>' + text + '</div>')

   this.text = $('#text-' + this.group.id);
   this.textoffset = { 
      x: this.parent.translation.x + this.group.translation.x - (this.width/2),
      y: this.parent.translation.y + this.group.translation.y - (this.height/2)
   } 

   this.text.css('width', this.width);
   this.text.css('height', this.height);
   this.text.css('line-height', '50px');
   this.text.offset({ 
      top: this.textoffset.y,
      left: this.textoffset.x
   })

   two.update();

   $(this.group._renderer.elem)
      .css('cursor', 'pointer')
      .on('mouseenter', { button: this }, function(e) {
         e.preventDefault();
         var btn = e.data.button;
         btn.OUTLINE();
      })
      .on('mouseleave', { button: this }, function(e) {
         e.preventDefault();
         var btn = e.data.button;
         btn.UNOUTLINE();
      })
      .on('click', { button: this }, function(e) {
         e.preventDefault();
         e.stopPropagation();
         var btn = e.data.button;
         btn.CLICK();
      })
      .on('mousedown', function(e) {
         e.stopPropagation();
      })
}

Button.prototype.DESTROY = function() {
   this.text.remove();

   this.parent.remove(this.group);
}

Button.prototype.CLICK = function() {
   var box = this;

   switch(juice) {

      case 0:
         box.shape.stroke = "black";
         box.shape.linewidth = 10;
         box.onClick();
         break;

      case 1:
         if(box.tween !== undefined) {
            box.tween.stop();
         }

         box.tween = new TWEEN.Tween({ 
               tr: box.shape.translation.x,
               sh: box.shadow.translation.x 
         })
         .to({ tr: 0, sh: 0 }, 100)
         .easing(TWEEN.Easing.Cubic.Out)
         .onUpdate(function() {
            box.shape.translation.x = this.tr;
            box.shape.translation.y = this.tr;

            box.shadow.translation.x = this.sh;
            box.shadow.translation.y = this.sh;

            box.shadow.opacity = this.o;

            box.text.offset({ 
               top: box.textoffset.y + this.tr,
               left: box.textoffset.x + this.tr
            })
         })
         .onComplete(function() {
            box.onClick();
         })
         .start();
         break;

      default:
         break;
   }
}

Button.prototype.OUTLINE = function() {
   var box = this;

   switch(juice) {

      case 0:

         box.shape.stroke = "black";
         box.shape.linewidth = 10;

         break;

      case 1:
         if(box.tween !== undefined) {
            box.tween.stop();
         }

         box.tween = new TWEEN.Tween({
            tr: 0,
            sh: 0
         })
         .to({ tr: -10, sh: 5 }, 500)
            .delay(20)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(function() {
               box.shape.translation.x = this.tr;
               box.shape.translation.y = this.tr;

               box.text.offset({ 
                  top: box.textoffset.y + this.tr,
                  left: box.textoffset.x + this.tr
               })

               box.shadow.translation.x = this.sh;
               box.shadow.translation.y = this.sh;

         })
         .start();

         break;

      default:
         break;
   }
}

Button.prototype.UNOUTLINE = function() {
   var box = this;

   switch(juice) {
      case 0:
         box.shape.noStroke();
         break;

      case 1:
         if(box.tween !== undefined) {
            box.tween.stop();
         }

         box.tween = new TWEEN.Tween({ 
            tr: box.shape['translation'].x, 
            sh: box.shadow['translation'].x,
         })
         .to({ tr: 0, sh: 0 }, 400)
         .easing(TWEEN.Easing.Cubic.Out)
         .onUpdate(function() {
            box.shape.translation.x = this.tr;
            box.shape.translation.y = this.tr;
            box.shadow.translation.x = this.sh;
            box.shadow.translation.y = this.sh;

            box.text.offset({ 
               top: box.textoffset.y + this.tr,
               left: box.textoffset.x + this.tr
            })
         })
         .start();

      default:
         break;

   }
}
