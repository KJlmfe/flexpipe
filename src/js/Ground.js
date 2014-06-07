Ground = {

  speed: -360,

  load: function() {
          game.load.image('ground', 'assets/ground.png');
        },

  init: function() {
          this.ground = game.add.tileSprite(0, game.world.height, Canvas.w, 112, 'ground');
          this.ground.z = 10;
          this.ground.autoScroll(this.speed, 0);
        },

  play: function() {
           this.ground.autoScroll(this.speed, 0);
        },

  pause: function() {
           this.ground.autoScroll(0, 0);
         }
};


