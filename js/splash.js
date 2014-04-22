function loadSplash() {
   splash = new Splash(middleground, background, foreground);
}

function Splash() {

   var start = new cssButton(500, 200, 'start', function() {
      splash.nextTutorial();
   });

   this.tutorial = {
      index: -1,
      steps: [
         {
            text: 'E coli. is a serious food source contaminent and occasionally responsible for food product recalls. Scientists want to monitor known populations and associate them into strains.',
            startFn: function(splash) {

               $('.btn').remove();

               /*this.prev = new cssButton(500, 100, 'prev', function() {
                  splash.prevTutorial();
               });
               */

               splash.next = new cssButton(500, 400, 'next', function() {
                  splash.nextTutorial();
               });

               splash.buddy = ENTER_BUDDY(foreground);

               
            },
            completeFn: function() {
               SWEEP(foreground, background);
               return true;
            }
         },
         {
            text: 'Scientists at Cal Poly have determined a cost-effective way to sequence E. coli DNA using a process called Pyroprinting.',
            startFn: function(splash) {
               splash.pyro = ENTER_PYRO(foreground);

            },
            completeFn: function(grid) {
               SWEEP(foreground, background);
               return true;
            }
         },
         {
            text: 'E. coli strains are uniquely identified by two regions of DNA, the 23-5S region and the 16-23S region. Cal Poly has gathered and sequenced a large number of E. coli samples.',
            startFn: function(grid) {

               foreground.remove(splash.buddy)
               foreground.remove(splash.pyro)

               splash.dna = new DNA(foreground);
               splash.dna.ENTER();

            },
            completeFn: function(grid) {
               SWEEP(foreground, background);
               splash.dna.DETWEEN();
               return true;
            }
         },
         {
            text: 'Using some science called the Pearson Correlation Coefficient, we can determine if a sample from the 23-5S is similar to another, or if a sample from the 16-23S region is similar to another. Neat!',
            startFn: function(grid) {
               splash.dna.SPLIT();
            },
            completeFn: function(grid) {
               SWEEP(foreground, background);
               return true;
            }
         },
         {
            text: 'Two E. coli samples are potentially in the same strain if both the 16-23S region and the 23-5S region are similar!',
            startFn: function(grid) {
            },
            completeFn: function(grid) {
               SWEEP(foreground, background);
               return true;
            }
         },
         {
            text: 'POOPSNOOP is a tool to identify potential strains in many samples at once. Three samples are compared to each other in this grid.',
            startFn: function() {
               splash.dna.DESTROY();
               grid = new Grid(middleground, background, foreground, data, 3);
            },
            completeFn: function(grid) {
               SWEEP(foreground, background);
               return true;
            }
         },
         {
            text: 'One half compares the 23-5S region and the other compares the 16S-23 region. Samples are compared to themselves along the diagonal and will always match themselves.',
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
            text: 'The Grid can be rearranged by clicking and dragging the Cells along the Diagonal. When you rearrange the grid, the row and column you move are linked together because they represent the same sample. Go ahead and try it!',
            startFn: function() {
            },
            completeFn: function() {
               if(grid.orientation[0] == 0 && grid.orientation[1] == 1 && grid.orientation[2] == 2) {

                  splash.displayText('Rearrange the grid by clicking and dragging a cell on the diagonal!');
                  GRAB_INDICATOR();
                  return false;
               }
               SWEEP(foreground, background);
               return true;
            },
         },
         {
            text: 'A potential strain is identified by creating a perfect square of cells that are blue! A square of three means that each of the three samples are similar to the other two. It\'s a strain! Bigger strains are worth more.',
            startFn: function() {},
            completeFn: function() {
               SWEEP(foreground, background);
               return true;
            },
         },

      ]
   }
}

Splash.prototype.prevTutorial = function() {

   if(this.tutorial.index > 0) {
      this.displayText(this.tutorial.steps[--this.tutorial.index].text)
   }
}

Splash.prototype.nextTutorial = function() {

   if(this.tutorial.index >= 0) {
      if(!this.tutorial.steps[this.tutorial.index].completeFn(this)) {
         return;
      }
   }

   if(this.tutorial.index < this.tutorial.steps.length-1) {


      this.displayText(this.tutorial.steps[++this.tutorial.index].text)

      this.tutorial.steps[this.tutorial.index].startFn(this);
   }
}

Splash.prototype.displayText = function(text) {

   $('#game-container .hint').remove();

   $('#game-container').append('<div class="hint juice-' + juice + '">' + text + '</div>');
}
