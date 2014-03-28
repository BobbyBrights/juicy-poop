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
      selected: [],
      scored: []
   };

   this.background = two.makeGroup();
   this.group = two.makeGroup();

   this.group.translation.set(two.width/2, two.width/2);
   this.background.translation.set(two.width/2, two.width/2);

   this.setVectors();
   this.setBoxes();

   _.each(this.boxes.all, function(b) {
      b.animate(SETTLE[this.attributes.juiceLevel]);
   }, this);
}

Grid.prototype.setBoxes = function() {


   for(col = 0; col < this.attributes.numRows; col++) {

      for(row = 0; row < this.attributes.numRows; row++) {

         var width = (this.attributes.width / this.attributes.numRows) * 0.5;

         var datum = this.attributes.data[row][col];

         var box = new Box(this, row, col, width, datum);

         this.boxes.all.push(box);

         this.group.add(box.shape);
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

Grid.prototype.getBoxesFromCluster = function(clusterStart, clusterSize) {

   return _.filter(this.boxes.all, function(box) {

      var rowIndex = this.orientation.indexOf(box.row);
      var colIndex = this.orientation.indexOf(box.col);

      return (this.orientation.indexOf(box.row) >= clusterStart 
               && this.orientation.indexOf(box.col) >= clusterStart 
               && this.orientation.indexOf(box.row) <= clusterStart + clusterSize
               && this.orientation.indexOf(box.col) <= clusterStart + clusterSize);
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

   var i = r.indexOf(min);

   return i;
}

Grid.prototype.getNearestRow = function(mouse) {
   return this.orientation[this.getNearestIndex(mouse)];
}

Grid.prototype.getDistanceToIndex = function(index, vector) {

   if(index < 0 || index > this.orientation.length-1) {
      return Number.MAX_VALUE;
   }

   return vector.distanceToSquared(this.vectors[index]);
}

Grid.prototype.select = function(row) {

   this.selected.active = true;
   this.selected.vector = {};

   this.selected.row = row;
   this.boxes.selected = this.getBoxesFromRowCol(this.selected.row);
   this.boxes.selected_all = this.getBoxesFromRowOrCol(this.selected.row);
   this.boxes.selected_col = this.getBoxesFromColMinus(this.selected.row);
   this.boxes.selected_row = this.getBoxesFromRowMinus(this.selected.row);

   this.selected.index = this.orientation.indexOf(this.selected.row);

}

Grid.prototype.calcScore = function() {

   this.boxes.scored = [];

   for(var clusterStart = 0; clusterStart < this.attributes.numRows; clusterStart++) {

      for(var clusterSize = 0; clusterSize < this.attributes.numRows-clusterStart; clusterSize++) {

         var cluster = this.getBoxesFromCluster(clusterStart, clusterSize);

         var isCluster = _.every(cluster, function(box) {
            return (box.datum >= GAME.LOWER_THRESHOLD);
         });

         if(isCluster) {
            this.boxes.scored = _.union(this.boxes.scored, cluster);
         } else {
            break;
         }

      }
   }

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

   _.each(this.boxes.highlighted, function(b) {
      b.animate(UNOUTLINE[this.attributes.juiceLevel]);
   }, this);

   this.highlighted.active = true;
   this.highlighted.row = row;
   this.boxes.highlighted = this.getBoxesFromRowCol(this.highlighted.row);

   _.each(this.boxes.highlighted, function(b) {
      b.animate(OUTLINE[this.attributes.juiceLevel]);
   }, this);
}

Grid.prototype.deselect = function() {

   this.calcScore();

   _.each(this.boxes.selected_all, function(b) { 
      b.animate(REDRAW[this.attributes.juiceLevel]);
   }, this)

   _.each(this.boxes.scored, function(b) {
      b.animate(SHINE[this.attributes.juiceLevel]);
   }, this);

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
      b.animate(REDRAW[this.attributes.juiceLevel]);
   }, this)

   this.selected.index = this.orientation.indexOf(this.selected.row);
}

Grid.prototype.handleMouseup = function(mouse) {
   this.deselect();
}

Grid.prototype.handleMousedown = function(mouse) {

   mouse.subSelf(this.group.translation);

   if(!this.isMouseInGrid(mouse)) {
      return;
   }

   this.select(this.getNearestRow(mouse));
}

Grid.prototype.handleMousemove = function(mouse) {


   //put mouse in Grid's matrix
   mouse.subSelf(this.group.translation);

   //if nothing is dragging
   if(!this.selected.active) {
      this.highlight(this.getNearestRow(mouse));
      return;
   }

   _.each(this.boxes.selected, function(b) {
      b.animate(REDRAW_MOUSE[0], mouse);
   });

   _.each(this.boxes.selected_row, function(b) {
      b.animate(REDRAW_MOUSE_ROW[0], mouse);
   });

   _.each(this.boxes.selected_col, function(b) {
      b.animate(REDRAW_MOUSE_COL[0], mouse);
   });

   var mouseToSel = this.getDistanceToIndex(this.selected.index, mouse); 
   var mouseToPrev = this.getDistanceToIndex(this.selected.index-1, mouse); 
   var mouseToNext = this.getDistanceToIndex(this.selected.index+1, mouse); 

   if(mouseToPrev < mouseToSel) {
      this.swapOrientation(this.selected.index-1);
   } else if (mouseToNext < mouseToSel) {
      this.swapOrientation(this.selected.index+1);
   }
}
