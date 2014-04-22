var btnID = 0;

function cssButton(top, left, text, onClick) {

   this.onClick = onClick;

   this.id = btnID++;

   $('#game-container').append('<div class="btn juice-' + juice + '" id="btn-' + this.id + '">' + text + '</div>');

   $('#btn-' + this.id).on('click', function(e) {
      e.stopPropagation();
      onClick();
   }).on('mousedown', function(e) {
      e.stopPropagation();
   }).css('top', top).css('left', left);
}
