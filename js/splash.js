function loadSplash() {
   splash = new Splash(middleground, background, foreground);
}

function Splash(group, foreground, background) {

   this.buttons = [];

   //this.buttons.push(new Button(group, 0, 0, 300, 50, 'play the game', this.startGame));
   this.buttons.push(new Button(group, 0, 100, 200, 50, 'start', this.startTutorial));
   this.buttons.push(new Button(group, 0, 200, 150, 50, 'about', this.startAbout));
}

Splash.prototype.startTutorial = function() {
   //SWEEP(foreground, background);

   _.each(splash.buttons, function(button) {
      button.DESTROY();
   })

   grid = new Grid(middleground, background, foreground, data, 3);
   $('.splash').css('display', 'none');
}

Splash.prototype.startAbout = function() {
   console.log('start about');
   SWEEP(foreground, background);

   startAbout();
   $('.splash').css('display', 'none');
}
