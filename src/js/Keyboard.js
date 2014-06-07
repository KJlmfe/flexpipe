Keyboard = {

  init: function() {
          var space_key = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
          space_key.onDown.add(this.play);
          game.input.onTap.add(this.play);
        },

  play: function() {
         if(GameController.state === GameController.STATE_START) {
           GameController.state = GameController.STATE_PLAYING;
           Bird.sprite.body.gravity.y = 1200;
           Bird.jump();
           Pipe.play();
           Ground.play();
           Menu.hideStartInfo();
         } else if(GameController.state === GameController.STATE_PLAYING) {
           Bird.jump();
         } else if(GameController.state === GameController.STATE_END) {
           return;
         }
       }
};

