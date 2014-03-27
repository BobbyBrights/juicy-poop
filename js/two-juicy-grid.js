function Grid(numRows, width, orientation) {

   this.attributes = { numRows: numRows, width: width };
   this.selected = { row: -1, active: false };
   this.highlighted = { row: -1, active: false, box: null };
   this.orientation = orientation;

   this.vectors = [];
   this.boxes = []

   this.background = two.makeGroup();
   this.group = two.makeGroup();

   this.init();
}

Grid.prototype.init = function() {


   for(col = 0; col < this.attributes.numRows; col++) {

      this.boxes.push([]);

      for(row = 0; row < this.attributes.numRows; row++) {

         var x = this.orientation.indexOf(col) * 
            (this.attributes.width / (this.attributes.numRows));
         var y = this.orientation.indexOf(row) * 
            (this.attributes.width / (this.attributes.numRows));

         var box = new Box(row, col, (this.attributes.width / this.attributes.numRows)*0.5, x, y);


         this.boxes[col].push(box);

         this.group.add(box.shape);
      }
   }

   this.group.center();
   this.group.translation.set(two.width/2, two.width/2);
   this.background.translation.set(two.width/2, two.width/2);

   this.initVectors();
}

Grid.prototype.initVectors = function() {

   _.each(_.flatten(this.boxes), function(b) {
      if(b.row == b.col) {
         this.vectors.push(b.shape.translation.clone());
      }
   }, this);

   this.vectors = _.sortBy(this.vectors, function(v) {
      return v.x;
   });

}

Grid.prototype.getSelectedMinusGrabbed= function() {
   return _.reject(this.selected.boxes, function(b) {
      return (b.col == b.row && b.row == this.selected.row);
   }, this);
}

Grid.prototype.getBoxesFromIndex = function(index) {
   return _.filter(_.flatten(this.boxes), function(b) {
      return b.row == this.orientation[index] || b.col == this.orientation[index]; 
   }, this);
}

Grid.prototype.getBoxesFromRow = function(row) {
   return _.filter(_.flatten(this.boxes), function(b) {
      return b.row == row || b.col == row;
   });
}

Grid.prototype.getBoxesMinusRow = function(row) {
   return _.reject(_.flatten(this.boxes), function(b) {
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
   this.selected.boxes = this.getBoxesFromRow(this.selected.row);
   this.selected.box = this.boxes[this.selected.row][this.selected.row];
   this.selected.plingCount = 0;

   this.selected.index = this.orientation.indexOf(this.selected.row);

}


Grid.prototype.isMouseInGrid = function(mouse) {

   //because mouse is in grid coords already
   var halfheight = halfwidth = this.attributes.width/2;
   return (mouse.x > -halfwidth && mouse.x < halfwidth && mouse.y > -halfheight && mouse.y < halfheight);
}

Grid.prototype.highlight = function(row) {

   if(row == this.highlighted.row) {
      return;
   }

   if(this.highlighted.box && typeof this.highlighted.box.unighlight !== undefined) {
      this.highlighted.box.animate(UNOUTLINE);
   }

   _.each(this.highlighted.boxes, function(b) {
      //b.animate(UNOUTLINE);
   });

   this.highlighted.active = true;
   this.highlighted.row = row;

   this.highlighted.boxes = this.getBoxesFromRow(this.highlighted.row);
   this.highlighted.box = this.boxes[this.highlighted.row][this.highlighted.row];

   this.highlighted.box.animate(OUTLINE);

   _.each(this.highlighted.boxes, function(b) {
      //b.animate(OUTLINE);
   });
}

Grid.prototype.deselect = function() {

   if(!this.selected.active) {
      return;
   }

   _.each(this.selected.boxes, function(b) { 
      b.animate(REDRAW);
      b.animate(SHINE);
   })

   this.selected.active = false;

}

Grid.prototype.swapOrientation = function(indexToSwap) {

   var tmp = this.orientation[this.selected.index];
   this.orientation[this.selected.index] = this.orientation[indexToSwap];
   this.orientation[indexToSwap] = tmp;


   _.each(
         _.reject(this.getBoxesFromIndex(this.selected.index), function(b) {
            return b.row == grid.selected.row || b.col == grid.selected.row;
         }), 
         function(b) { 
      b.animate(REDRAW);
   })

   this.selected.index = this.orientation.indexOf(this.selected.row);
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

   _.each(_.flatten(this.selected.boxes), function(b) { 

      if(b.col == b.row && b.row == this.selected.row) {
         b.animate(REDRAW_MOUSE, mouse);
      } else if(b.col == this.selected.row) {
         b.animate(REDRAW_MOUSE_COL, mouse);
      } else if(b.row == this.selected.row) {
         b.animate(REDRAW_MOUSE_ROW, mouse);
      }

   }, this)

   var mouseToSel = this.getDistanceToIndex(this.selected.index, mouse); 
   var mouseToPrev = this.getDistanceToIndex(this.selected.index-1, mouse); 
   var mouseToNext = this.getDistanceToIndex(this.selected.index+1, mouse); 

   if(mouseToPrev < mouseToSel) {
      this.swapOrientation(this.selected.index-1);
   } else if (mouseToNext < mouseToSel) {
      this.swapOrientation(this.selected.index+1);
   }
}
