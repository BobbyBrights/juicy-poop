var buffers = [];

$(document).on('ready', function() {

   bufferLoader = new BufferLoader(
      context,
         [
            'super-sfx/ball-paddle.mp3',
            'super-sfx/pling1.mp3',
            'super-sfx/pling2.mp3',
            'super-sfx/pling3.mp3',
            'super-sfx/pling4.mp3',
            'super-sfx/pling5.mp3',
            'super-sfx/pling6.mp3',
            'super-sfx/pling7.mp3',
            'super-sfx/pling8.mp3',
            'super-sfx/pling9.mp3',
            'super-sfx/pling10.mp3'
         ],
      finishedLoading
      );

   bufferLoader.load();

});

function finishedLoading(bufferlist) {

   _.each(bufferlist, function(b, i) {
      buffers[i] = b;
   });

}

function playCheer() {
   var source = context.createBufferSource();

   source.connect(context.destination);

   source.buffer = buffers[0];

   source.start(0);
}

function playPling(i) {
   var source = context.createBufferSource();

   source.connect(context.destination);

   source.buffer = buffers[(i % 8) + 1];

   source.start(0);
}
