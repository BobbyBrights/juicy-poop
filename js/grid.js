function Grid(group, background, foreground, data, size) {

   this.attributes = { numRows: size, data: data, boxSpace : 75 };
   this.selected = { row: -1, active: false };
   this.highlighted = { row: -1, active: false };

   this.boxes = {
      all: [],
      diagonal: [],
      highlighted: [],
      highlighted_extra: [],
      selected: [],
      scored: []
   };


   this.background = background; //two.makeGroup();
   this.group = group; //two.makeGroup();
   this.foreground = foreground; 

   this.setOrientation(this.attributes.data.length);
   this.setVectors(this.attributes.numRows);
   this.setBoxes();


   this.effects = false;

   this.disabled = true;
   
   var grid = this;
   setTimeout(function() {
      grid.disabled = false;
   }, 500);

   //load time... timeout required for grid to actually be initialized
   _.each(this.boxes.all, function(b) {
      b.SETTLE();
   });

   SWEEP(this.foreground, sweepground); 

   $(document)
   .on('mousemove', { grid: this }, function(e) {
      e.preventDefault();
      mouse.x = e.clientX - svg.left;
      mouse.y = e.clientY - svg.top;

      e.data.grid.handleMousemove(mouse);

   })
   .on('mousedown', { grid: this}, function(e) {
      console.log('mousedowning');
      e.preventDefault();

      mouse.x = e.clientX - svg.left;
      mouse.y = e.clientY - svg.top;

      e.data.grid.handleMousedown(mouse);
   })
   .on('mouseup', { grid: this }, function(e) {
      e.preventDefault();

      mouse.x = e.clientX - svg.left;
      mouse.y = e.clientY - svg.top;

      e.data.grid.handleMouseup(mouse);
   });


}

Grid.prototype.setBoxes = function() {

   for(col = 0; col < this.attributes.numRows; col++) {

      for(row = 0; row < this.attributes.numRows; row++) {

         var box = new Box(this, row, col);
         this.boxes.all.push(box);
         if(row == col) {
            this.boxes.diagonal.push(box);
         }
      }
   }
}

Grid.prototype.updateBoxes = function() {

   this.boxes.adding = [];

   if(this.attributes.numRows < this.vectors.length) { //adding boxes

      for(var l = this.vectors.length - this.attributes.numRows; l > 0; l--) {

         var row = this.attributes.numRows;

         var mid = new Box(this, row, row);
         this.boxes.adding.push(mid);
         this.boxes.diagonal.push(mid);

         for(var r = 0; r < row; r++) {

            var box = new Box(this, r, row);
            this.boxes.adding.push(box);
         }

         for(var c = 0; c < row; c++) {
            var box = new Box(this, row, c);
            this.boxes.adding.push(box);
         }
      }

   } else { //subbing boxes
   }

}

Grid.prototype.addRow = function() {

   if(this.attributes.numRows == this.attributes.data.length) {
      return;
   }

   this.setVectors(this.attributes.numRows + 1);
   this.updateBoxes();

   this.attributes.numRows = this.vectors.length;

   _.each(this.boxes.adding, function(box) {
      box.ADD();
   })

   _.each(this.boxes.all, function(box) {
      box.REDRAW();
   })

   this.boxes.all = this.boxes.all.concat(this.boxes.adding);
}

Grid.prototype.setOrientation = function(numOrientation) {
   this.orientation = [];

   for(var i = 0; i < numOrientation; i++) {
      this.orientation.push(i);
   }
}

Grid.prototype.setVectors = function(numVectors) {

   this.vectors = [];

   var max = (numVectors-1) * (this.attributes.boxSpace) / 2;

   for(var i = 0; i < numVectors; i++) {

      var distance = i * this.attributes.boxSpace;

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

   if(index < 0 || index > this.vectors.length-1) {
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

   this.currentBest = (_.max(this.clusters, function(cluster) {
      return cluster.length;
   })).length;

}

Grid.prototype.calcScore = function() {

   this.boxes.scored = [];
   this.clusters = [];

   for(var clusterStart = 0, bestCluster; clusterStart < this.attributes.numRows; clusterStart++) {

      for(var clusterSize = 1; clusterSize < this.attributes.numRows-clusterStart; clusterSize++) {

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
   var halfheight = halfwidth = two.width/2;

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
      //b.DRAG_INDICATOR();
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

Grid.prototype.effectAfterScore = function() {

   this.newCalcScore();

   if(this.boxes.scored.length > 0) {

      if(juice > 0) {

         randomChoice(background_animations)(grid.foreground, grid.background);

         _.each(this.boxes.highlighted_extra, function(b) {
            b.UNOUTLINE_EXTRA();
         }, this);

         _.each(this.boxes.highlighted, function(b) {
            b.UNOUTLINE();
         }, this);

         _.each(this.boxes.unscored, function(b) {
            b.SLIDE_OUT();
         }, this);

         _.each(this.boxes.scored, function(b) {
            b.SMILE_ON();

         }, this);

         SHAKE(grid.group, this.clusters[0].length);

         var timeout = setTimeout(function() {
            console.log('triggering');
            $(document).trigger('mousedown');
         }, 5000);

         $(window).one('mousedown', function(event) { 
            event.stopPropagation();

            window.clearTimeout(timeout);
            stopAllTweens();
            SWEEP(grid.foreground, grid.background); 

            _.each(grid.background.children, function(child) {

               grid.background.remove(child);
            })

            RESET(grid.group);
            _.each(grid.boxes.unscored, function(b) {
               b.SLIDE_IN();
            });

            grid.highlight(null);
            setTimeout(function() {
               grid.highlight(grid.getNearestRow(mouse));
            }, 1000);

         });


      }
   }
}


Grid.prototype.deselect = function() {

   if(!this.selected.active) {
      return;
   }

   _.each(this.boxes.all, function(b) {
      b.SMILE_OFF();
   }, this);

   _.each(this.boxes.selected_all, function(b) { 
      b.REDRAW();
   }, this)

   this.selected.active = false;

   if(this.effects) {
      this.effectAfterScore();
   }
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
