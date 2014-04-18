function Grid(numRows, width, data, juiceLevel) {

   this.attributes = { numRows: numRows, width: width, juiceLevel: juiceLevel, data: data };
   this.selected = { row: -1, active: false };
   this.highlighted = { row: -1, active: false, box: null };
   this.orientation = [];

   for(var i = 0; i < data.length; i++) {
      this.orientation.push(i);
   }

   this.vectors = [];

   this.boxes = {
      all: [],
      highlighted: [],
      highlighted_extra: [],
      selected: [],
      scored: []
   };

   this.disabled = false;

   this.background = two.makeGroup();
   this.group = two.makeGroup();
   this.foreground = two.makeGroup();

   this.group.translation.set(two.width/2, two.width/2);
   this.background.translation.set(two.width/2, two.width/2);
   this.foreground.translation.set(two.width/2, two.width/2);

   //this.foreground.rotation = Math.PI * (1/4);


   //this.foreground.add(this.great);

   this.setVectors();
   this.setBoxes();

   //load time... timeout required for grid to actually be initialized
   setTimeout(function() { 
      _.each(grid.boxes.all, function(b) {
         b.SETTLE();
      });

      if(grid.attributes.juiceLevel > 0) {
         SWEEP(grid.foreground, grid.background); 
      }

   }, 500);

   $(window)
   .on('mousemove', function(e) {
      e.preventDefault();
      mouse.x = e.clientX - svg.left;
      mouse.y = e.clientY - svg.top;

      grid.handleMousemove(mouse);

   })
   .on('mousedown', function(e) {
      e.preventDefault();

      mouse.x = e.clientX - svg.left;
      mouse.y = e.clientY - svg.top;

      grid.handleMousedown(mouse);
   })
   .on('mouseup', function(e) {
      e.preventDefault();
      grid.handleMouseup(mouse);
   });

   $('.splash').css('display', 'none');

}

Grid.prototype.setBoxes = function() {


   for(col = 0; col < this.attributes.numRows; col++) {

      for(row = 0; row < this.attributes.numRows; row++) {

         var width = (this.attributes.width / this.attributes.numRows) * 0.5;

         var datum = this.attributes.data[row][col];

         var box = new Box(this, row, col, width, datum);

         this.boxes.all.push(box);
      }
   }
}

Grid.prototype.setVectors = function() {

   var max = (this.attributes.numRows-1) 
      * (this.attributes.width / this.attributes.numRows) / 2;

   for(var i = 0; i < this.attributes.numRows; i++) {

      var distance = i * (this.attributes.width / this.attributes.numRows);

      var v = new Two.Vector(distance, distance);

      v.subSelf(new Two.Vector(max, max));

      this.vectors.push(v);
   }
}

Grid.prototype.getClustersOfSize = function(clusterSize) {

   var numRows = this.attributes.numRows;

   return _.filter(
      _.map(
         _.range(numRows-clusterSize+1), 

         function(clusterStart) {
            return { 
               start: clusterStart, 
               size: clusterSize, 
               cluster: this.getBoxesFromCluster(clusterStart, clusterSize) 
            };
         },

         this
      ),

      function(clusterObject) {

         return _.every(clusterObject.cluster, function(box) {
            return box.datum >= GAME.LOWER_THRESHOLD;
         })
      }

   )
}

Grid.prototype.getBoxesFromCluster = function(clusterStart, clusterSize) {

   return _.filter(this.boxes.all, function(box) {

      var rowIndex = this.orientation.indexOf(box.row);
      var colIndex = this.orientation.indexOf(box.col);

      return (this.orientation.indexOf(box.row) >= clusterStart 
               && this.orientation.indexOf(box.col) >= clusterStart 
               && this.orientation.indexOf(box.row) < clusterStart + clusterSize
               && this.orientation.indexOf(box.col) < clusterStart + clusterSize);
   }, this);
}

Grid.prototype.getSelectedMinusGrabbed= function() {
   return _.reject(this.selected.boxes, function(b) {
      return (b.col == b.row && b.row == this.selected.row);
   }, this);
}

Grid.prototype.getBoxesFromIndex = function(index) {
   return _.filter(this.boxes.all, function(b) {
      return b.row == this.orientation[index] || b.col == this.orientation[index]; 
   }, this);
}

Grid.prototype.getBoxesFromRowCol = function(row) {
   return _.filter(this.boxes.all, function(b) {
      return b.row == row && b.col == row;
   });
}

Grid.prototype.getBoxesFromRowMinus = function(row) {

   return _.filter(this.boxes.all, function(b) {
      return b.row == row && b.col != row;
   });

}

Grid.prototype.getBoxesFromRowOrCol = function(row) {
   return _.filter(this.boxes.all, function(b) {
      return b.row == row || b.col == row;
   });

}

Grid.prototype.getBoxesFromColMinus = function(row) {

   return _.filter(this.boxes.all, function(b) {
      return b.col == row && b.row != row;
   });

}

Grid.prototype.getBoxesFromRow = function(row) {
   return _.filter(this.boxes, function(b) {
      return b.row == row || b.col == row;
   });
}

Grid.prototype.getBoxesMinusRow = function(row) {
   return _.reject(this.boxes, function(b) {
      return b.row == row || b.col == row;
   });
}

Grid.prototype.getVectorFromIndex = function(index) {
   if(index < 0 || index > this.vectors.length-1) {
      return null;
   } else {
      return this.vectors[index].clone();
   }
}

Grid.prototype.getNearestIndex = function(mouse) {

   var r = _.map(this.vectors, function(v) { return v.distanceToSquared(mouse); });

   var min = _.min(r);

   if(min < 5000) { //magic distance
      return r.indexOf(min);
   } else {
      return null;
   }
}

Grid.prototype.getNearestRow = function(mouse) {
   var i = this.getNearestIndex(mouse);
   if(i == null) {
      return null;
   } else {
      return this.orientation[i];
   }
}

Grid.prototype.getDistanceToIndex = function(index, vector) {

   if(index < 0 || index > this.orientation.length-1) {
      return Number.MAX_VALUE;
   }

   return vector.distanceToSquared(this.vectors[index]);
}

Grid.prototype.select = function(row) {

   if(row == null) {
      GRAB_INDICATOR();
      return;
   }

   this.selected.active = true;
   this.selected.vector = {};

   this.selected.row = row;
   this.boxes.selected = this.getBoxesFromRowCol(this.selected.row);
   this.boxes.selected_all = this.getBoxesFromRowOrCol(this.selected.row);
   this.boxes.selected_col = this.getBoxesFromColMinus(this.selected.row);
   this.boxes.selected_row = this.getBoxesFromRowMinus(this.selected.row);

   this.selected.index = this.orientation.indexOf(this.selected.row);


   //DRAG_INDICATOR(this.foreground, this.background, this.selected.index);

}

Grid.prototype.newCalcScore = function() {

   var numRows = this.attributes.numRows;

   this.boxes.scored = [];
   this.boxes.unscored = [];
   this.clusters = [];
   
   var ret = _.flatten(_.map(
      _.range(numRows, 1, -1),
      function(clusterSize) {
         //console.log(clusterSize);
         return this.getClustersOfSize(clusterSize);
      },
      this
   ))

   _.each(ret, function(cluster) {

      if(_.intersection(cluster.cluster, this.boxes.scored).length == 0) {
         this.clusters.push(cluster.cluster);
         this.boxes.scored = this.boxes.scored.concat(cluster.cluster);
      }

   }, this)

   //console.log(this.boxes.scored);
   this.boxes.unscored = _.difference(this.boxes.all, this.boxes.scored);

}

Grid.prototype.calcScore = function() {

   this.boxes.scored = [];
   this.clusters = [];

   for(var clusterStart = 0, bestCluster; clusterStart < this.attributes.numRows; clusterStart++) {

      for(var clusterSize = 1; clusterSize < this.attributes.numRows-clusterStart; clusterSize++) {
         console.log(clusterStart, clusterSize);

         var cluster = this.getBoxesFromCluster(clusterStart, clusterSize);

         var isCluster = _.every(cluster, function(box) {
            return (box.datum >= GAME.LOWER_THRESHOLD);
         });

         if(isCluster) {
            this.boxes.scored = _.union(this.boxes.scored, cluster);
            //this.clusters.push({start: clusterStart, size: clusterSize, cluster: cluster}); 
            bestCluster = { start: clusterStart, size: clusterSize, cluster: cluster };

         } else {
            break;
         }
      }

      this.clusters.push(bestCluster);
   }

   this.boxes.unscored = _.difference(this.boxes.all, this.boxes.scored);
   console.log(this.clusters);

}

Grid.prototype.isMouseInGrid = function(mouse) {

   //because mouse is in grid coords already
   var halfheight = halfwidth = this.attributes.width/2;
   return (mouse.x > -halfwidth && mouse.x < halfwidth && 
           mouse.y > -halfheight && mouse.y < halfheight);
}

Grid.prototype.highlight = function(row) {

   if(row == this.highlighted.row) {
      return;
   }

   _.each(this.boxes.highlighted_extra, function(b) {
      b.UNOUTLINE_EXTRA();
   }, this);

   _.each(this.boxes.highlighted, function(b) {
      b.UNOUTLINE();
   }, this);


   this.highlighted.active = true;
   this.highlighted.row = row;

   if(row == null) { //unhighlight if 
      document.querySelector("#game-container").classList.remove("hover");
      this.boxes.highlighted = [];
      this.boxes.highlighted_extra = [];
      return;
   }

   document.querySelector("#game-container").classList.add("hover");

   this.boxes.highlighted = this.getBoxesFromRowCol(this.highlighted.row);
   this.boxes.highlighted_extra = this.getBoxesFromRowOrCol(this.highlighted.row);

   this.boxes.highlighted_extra = _.reject(this.boxes.highlighted_extra, function(b) {
      return b.row == b.col;
   })

   _.each(this.boxes.highlighted, function(b) {
      b.OUTLINE();
      b.DRAG_INDICATOR();
   }, this);

   _.each(this.boxes.highlighted_extra, function(b) {
      b.OUTLINE_EXTRA();
   }, this);
}

Grid.prototype.enableMouse = function() {

   this.disabled = false;

}

Grid.prototype.disableMouse = function() {

   this.disabled = true;

}

Grid.prototype.deselect = function() {

   if(!this.selected.active) {
      return;
   }

   this.newCalcScore();

   _.each(this.boxes.all, function(b) {
      b.SMILE_OFF();
   }, this);

   _.each(this.boxes.selected_all, function(b) { 
      b.REDRAW();
   }, this)


   if(this.boxes.scored.length > 0) {

      if(grid.attributes.juiceLevel > 0) {

         randomChoice(background_animations)(grid.foreground, grid.background);

         _.each(this.boxes.unscored, function(b) {
            b.SLIDE_OUT();
         }, this);

         _.each(this.boxes.scored, function(b) {
            b.UNOUTLINE();
            b.SMILE_ON();

         }, this);

         SHAKE(grid.group, this.clusters[0].length);

         var timeout = setTimeout(function() {
            console.log('triggering');
            $(document).trigger('mousedown');
         }, 5000);

         $(document).one('mousedown', function(event) { 
            event.stopPropagation();
            window.clearTimeout(timeout);
            stopAllTweens();
            SWEEP(grid.foreground, grid.background); 

            RESET(grid.group);
            _.each(grid.boxes.unscored, function(b) {
               b.SLIDE_IN();
            });

         });


      }
   }

   //SQUARES[this.attributes.juiceLevel](grid.background);
   //SWEEP[0](grid.background);
   //GREAT[0](grid.foreground, grid.background);
   //playCheer();

   this.selected.active = false;
}

Grid.prototype.swapOrientation = function(indexToSwap) {


   var toSwap = _.reject(this.getBoxesFromIndex(indexToSwap), function(b) {
      return b.row == this.selected.row || b.col == this.selected.row;
   }, this);

   var tmp = this.orientation[this.selected.index];
   this.orientation[this.selected.index] = this.orientation[indexToSwap];
   this.orientation[indexToSwap] = tmp;

   _.each(toSwap, function(b) {
      b.REDRAW();
   }, this)

   this.selected.index = this.orientation.indexOf(this.selected.row);
}

Grid.prototype.handleMouseup = function(mouse) {
   if(this.disabled) {
      return;
   }

   this.deselect();
}

Grid.prototype.handleMousedown = function(mouse) {

   if(this.disabled) {
      return;
   }

   mouse.subSelf(this.group.translation);

   if(!this.isMouseInGrid(mouse)) {
      return;
   }

   this.select(this.highlighted.row);
}

Grid.prototype.handleMousemove = function(mouse) {


   if(this.disabled) {
      return;
   }


   //put mouse in Grid's matrix
   mouse.subSelf(this.group.translation);

   //if nothing is dragging
   if(!this.selected.active) {
      this.highlight(this.getNearestRow(mouse));
      return;
   }

   var diag = new Two.Vector(1,1);
   diag.normalize();

   var draw = diag.dot(mouse);
   diag.multiplyScalar(draw);

   _.each(this.boxes.selected, function(b) {
      b.REDRAW_MOUSE(diag);
   }, this);

   _.each(this.boxes.selected_row, function(b) {
      b.REDRAW_MOUSE_ROW(diag);
   });

   _.each(this.boxes.selected_col, function(b) {
      b.REDRAW_MOUSE_COL(diag);
   });

   var mouseToSel = this.getDistanceToIndex(this.selected.index, diag); 
   var mouseToPrev = this.getDistanceToIndex(this.selected.index-1, diag); 
   var mouseToNext = this.getDistanceToIndex(this.selected.index+1, diag); 

   if(mouseToPrev > 5000 && mouseToNext > 5000) { //only swap if we're close
      return;
   }

   if(mouseToPrev < mouseToSel) {
      this.swapOrientation(this.selected.index-1);
   } else if (mouseToNext < mouseToSel) {
      this.swapOrientation(this.selected.index+1);
   }
}
