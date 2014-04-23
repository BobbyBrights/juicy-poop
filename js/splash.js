function Splash() {


   this.tutorial = {
      index: -1,
      steps: [
         {
            startFn: function(splash) {

               SWEEP(foreground, background);

               splash.buddy = new BUDDY(foreground);
               splash.buddy.ENTER();
            },
            completeFn: function() {
               return true;
            }
         },
         {
            text: '<tag>E coli.</tag> is a serious food source contaminent and occasionally responsible for food product recalls. Scientists want to monitor known populations and associate them into strains.',
            startFn: function(splash) {

               SWEEP(foreground, background);
            },
            completeFn: function() {
               return true;
            }
         },
         {
            text: 'Scientists at Cal Poly have determined a cost-effective way to sequence E. coli DNA using a process called Pyroprinting.',
            startFn: function(splash) {
               splash.pyro = ENTER_PYRO(foreground);
               SWEEP(foreground, background);
            },
            completeFn: function(grid) {
               return true;
            }
         },
         {
            text: 'E. coli strains are uniquely identified by two regions of DNA, the 23-5S region and the 16-23S region. Cal Poly has gathered and sequenced a large number of E. coli samples.',
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
            text: 'Using some science called the Pearson Correlation Coefficient, we can determine if a sample from the 23-5S is similar to another, or if a sample from the 16-23S region is similar to another. Neat!',
            startFn: function(grid) {
               splash.displayText(this.text)
               splash.dna.SPLIT();
               SWEEP(foreground, background);
            },
            completeFn: function(grid) {
               return true;
            }
         },
         {
            text: 'Two E. coli samples are potentially in the same strain if both the 16-23S region and the 23-5S region are similar!',
            startFn: function(grid) {
               splash.displayText(this.text)
               SWEEP(foreground, background);
            },
            completeFn: function(grid) {
               return true;
            }
         },
         {
            text: 'POOPSNOOP is a tool to identify potential strains in many samples at once. Three samples are compared to each other in this grid.',
            startFn: function() {
               splash.displayText(this.text)
               splash.dna.DESTROY();
               grid = new Grid(middleground, background, foreground, data, 3);
               SWEEP(foreground, background);
            },
            completeFn: function(grid) {
               return true;
            }
         },
         {
            text: 'One half compares the 23-5S region and the other compares the 16S-23 region. Samples are compared to themselves along the diagonal and will always match themselves.',
            startFn: function() {
               splash.displayText(this.text)
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
               splash.displayText(this.text)
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
            text: 'A potential strain is identified by creating a perfect square of cells that are blue! Here is a potential strain of 2 samples of E. coli.',
            startFn: function() {
               splash.displayText(this.text)

               grid.orientation[0] = 1;
               grid.orientation[1] = 0;
               grid.orientation[2] = 2;
               _.each(grid.boxes.all, function(b) {
                  b.REDRAW();
               })

               //HIGHLIGHT 2 SQUARE CLUSTER
            },
            completeFn: function() {
               //SWEEP(foreground, background);
               grid.newCalcScore();
               return (grid.currentBest >= 4);
            },
         },
         {
            text: 'The puzzle can consist of any number of E. coli samples if we know how they compare to our dataset. A larger potential strain is always better.',
            startFn: function() {
               splash.displayText(this.text)
               SWEEP(foreground, background);
               grid.addRow();
            },
            completeFn: function() {
               return (grid.currentBest >= 4);
            },
         },
         {
            text: 'Because our columns and rows are linked, clusters must be symetrical with respect to the diagonal. This cluster doesn\'t work because it is not a comparison between the same two original samples.',
            startFn: function() {
               splash.displayText(this.text)
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
            text: 'You know science! Go ahead and take the first survey here. Thank you.',
            startFn: function() {

               splash.displayText(this.text)

               $('.btn')[0].innerHTML = 'part deux';
            },
            completeFn: function() {
               return true;
            },
         },
         {
            text: '',
            startFn: function() {
               splash.displayText(this.text)
               $('.btn').remove();

               setTimeout(function() { grid.addRow() }, 500);
               setTimeout(function() { grid.addRow() }, 1000);
               setTimeout(function() { grid.addRow() }, 1500);
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


      this.tutorial.steps[++this.tutorial.index].startFn(this);

      $('#game-container .active').removeClass('active');
      $('#game-container .tut.step-' + this.tutorial.index).addClass('active');
   }
}

Splash.prototype.displayText = function(text, top, left) {

   $('#game-container .head').remove();

   $('#game-container .hint').remove();

   $('#game-container').append('<div class="hint juice-' + juice + '">' + text + '</div>');
}

