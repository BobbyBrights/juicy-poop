function Splash() {

   this.tutorial = {
      index: -1,
      steps: [
         {
            startFn: function(splash) {

               SWEEP(foreground, background);

               splash.buddy = new BUDDY(background);
               splash.buddy.ENTER();
            },
            completeFn: function() {
               return true;
            }
         },
         {
            startFn: function(splash) {

               SWEEP(foreground, background);
            },
            completeFn: function() {
               return true;
            }
         },
         {
            startFn: function(splash) {
               splash.pyro = ENTER_PYRO(foreground);
               SWEEP(foreground, background);
            },
            completeFn: function(grid) {
               return true;
            }
         },
         {
            startFn: function(grid) {

               splash.buddy.MOVE();

               SWEEP(foreground, background);

               foreground.remove(splash.pyro)

               splash.dna = new DNA(foreground);
               splash.dna.ENTER();

            },
            completeFn: function(grid) {
               splash.dna.DETWEEN();
               return true;
            }
         },
         {
            startFn: function(grid) {
               splash.dna.SPLIT();
               SWEEP(foreground, background);
            },
            completeFn: function(grid) {
               splash.dna.DETWEEN();
               return true;
            }
         },
         {
            startFn: function(grid) {
               splash.dna.CHECK();
               SWEEP(foreground, background);
            },
            completeFn: function(grid) {
               return true;
            }
         },
         {
            startFn: function() {
               splash.dna.DESTROY();
               grid = new Grid(middleground, background, foreground, data, 3);
               SWEEP(foreground, background);
            },
            completeFn: function(grid) {
               return true;
            }
         },
         {
            startFn: function() {
               _.each(grid.boxes.all, function(box) {
                  box.HIGHLIGHT_REGION();
               })
            },
            completeFn: function() {
               SWEEP(foreground, background);

               _.each(grid.boxes.all, function(box) {
                  box.UNHIGHLIGHT();
               })
               return true;
            }
         },
         {
            startFn: function() {
            },
            completeFn: function() {
               /*if(grid.orientation[0] == 0 && grid.orientation[1] == 1 && grid.orientation[2] == 2) {

                  GRAB_INDICATOR();
                  return false;
               }*/
               SWEEP(foreground, background);
               return true;
            },
         },
         {
            startFn: function() {

               grid.orientation[0] = 1;
               grid.orientation[1] = 0;
               grid.orientation[2] = 2;
               _.each(grid.boxes.all, function(b) {
                  b.REDRAW();
               })

               grid.newCalcScore();

               _.each(grid.boxes.scored, function(box) {

                  box.SMILE_ON();
               })

            },
            completeFn: function() {
               return true; 
            },
         },
         {
            startFn: function() {
               _.each(grid.boxes.scored, function(box) {
                  box.SMILE_OFF();
               })
               SWEEP(foreground, background);
               grid.addRow();
            },
            completeFn: function() {
               return (grid.currentBest >= 4);
            },
         },
         {
            startFn: function() {
               grid.orientation[0] = 2;
               grid.orientation[1] = 1;
               grid.orientation[2] = 0;
               grid.orientation[3] = 3;

               _.each(grid.boxes.all, function(box) {
                  box.REDRAW();
               })
            },
            completeFn: function() {
               //SWEEP(foreground, background);
               return (grid.currentBest >= 4);
            },
         },
         {
            startFn: function() {

               $('.btn')[0].innerHTML = 'part deux';
            },
            completeFn: function() {
               return true;
            },
         },
         {
            startFn: function() {
               $('.btn').remove();

               grid.effects = true;
               setTimeout(function() { grid.addRow() }, 200);
               setTimeout(function() { grid.addRow() }, 400);
               setTimeout(function() { grid.addRow() }, 600);

            },
            completeFn: function() {
               return false;
            },
         },

      ]
   }

   this.nextTutorial();
}

Splash.prototype.prevTutorial = function() {
}

Splash.prototype.nextTutorial = function() {


   if(this.tutorial.index >= 0) {
      if(!this.tutorial.steps[this.tutorial.index].completeFn(this)) {
         return;
      }
   }

   if(this.tutorial.index < this.tutorial.steps.length-1) {


      this.tutorial.steps[++this.tutorial.index].startFn(this);

      $('#game-container .active').removeClass('active');
      $('#game-container .tut.step-' + this.tutorial.index).addClass('active');

      /*
      $('.juice-1.active.center').animate({ 
         left: '-=100px',
         opacity: '1',
      }, 500, 'easeOutCubic', null );

      $('.juice-1.active.top-left').animate({ 
         left: '-=100px',
         opacity: '1',
      }, 500, 'easeOutCubic', null );
      */
   }
}
