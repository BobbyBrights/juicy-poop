function Splash() {

   this.tutorial = {
      index: -1,
      steps: [
         {
            startFn: function(splash) {

               SWEEP();

               splash.buddy = new BUDDY(background);
               splash.buddy.ENTER();
            },
            completeFn: function() {
               return true;
            }
         },
         {
            startFn: function(splash) {

               SWEEP();
            },
            completeFn: function() {
               return true;
            }
         },
         {
            startFn: function(splash) {
               splash.pyro = ENTER_PYRO(foreground);
               SWEEP();
            },
            completeFn: function(grid) {
               return true;
            }
         },
         {
            startFn: function(grid) {

               splash.buddy.MOVE();

               SWEEP();

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
               SWEEP();
            },
            completeFn: function(grid) {
               splash.dna.DETWEEN();
               return true;
            }
         },
         {
            startFn: function() {
               splash.dna.DESTROY();
               grid = new Grid(middleground, background, foreground, data, 3);
               grid.addLabels();
               SWEEP();
            },
            completeFn: function(grid) {
               return true;
            }
         },
         {
            startFn: function() {
               SWEEP();
            },
            completeFn: function() {
               return true;
            }
         },
         {
            startFn: function() {
               SWEEP();
            },
            completeFn: function() {
               return true;
            },
         },
         {
            startFn: function() {

               grid.orientation[0] = 1;
               grid.orientation[1] = 0;
               grid.orientation[2] = 2;

               grid.redraw();

               grid.smiles = true;
               grid.execEffects();

               SWEEP();


            },
            completeFn: function() {
               return true; 
            },
         },
         {
            startFn: function() {

               grid.removeLabels();
               SWEEP();

               grid.addRow();
            },
            completeFn: function() {
               return true;
            },
         },
         {
            startFn: function() {

               SWEEP();
            },
            completeFn: function() {
               return grid.clusters[0].length >= 9;
            },
         },
         {
            startFn: function() {
               SWEEP();

               grid.orientation[0] = 2;
               grid.orientation[1] = 1;
               grid.orientation[2] = 0;
               grid.orientation[3] = 3;

               _.each(grid.boxes.all, function(b) {
                  
                  b.SMILE_OFF();

                  if(b.row == 2 && b.col == 3) {
                     b.FROWN_ON();
                  }

                  if(b.row == 2 && b.col == 0) {
                     b.FROWN_ON();
                  }

                  if(b.row == 1 && b.col == 0) {
                     b.FROWN_ON();
                  }

                  if(b.row == 1 && b.col == 3) {
                     b.FROWN_ON();
                  }

               })

               grid.redraw();
            },
            completeFn: function() {
               return true;
            },
         },
         {
            startFn: function() {

               BARS();

               $('.btn')[0].innerHTML = 'part deux';
            },
            completeFn: function() {
               return true;
            },
         },
         {
            startFn: function() {
               SWEEP();
               $('.btn').remove();

               setTimeout(function() { grid.addRow() }, 200);
               setTimeout(function() { grid.addRow() }, 400);
               setTimeout(function() { grid.addRow() }, 600);
               setTimeout(function() { 
               
                  grid.orientation[0] = 2;
                  grid.orientation[1] = 1;
                  grid.orientation[2] = 0;
                  grid.orientation[3] = 3;
                  grid.orientation[4] = 6;
                  grid.orientation[5] = 4;
                  grid.orientation[6] = 5;

                  grid.redraw();
                  grid.execEffects();

                  grid.effects = true;

               }, 1000);

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

      $('#game-container .active').removeClass('active')
      $('#game-container .tut.step-' + this.tutorial.index).addClass('active');

      $('#game-container .btn').addClass('disabled').removeClass('pulse');

      setTimeout(function() {
         $('#game-container .btn').removeClass('disabled');
      }, 1500);

      if("bt" in window) {
         clearInterval(window.bt);
      }
   }
}
