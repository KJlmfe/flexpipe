Bird = {

  load: function() {
          game.load.spritesheet('bird', 'assets/bird.png', 92, 64); 
        },

  init: function() {
          this.sprite = game.add.sprite(100, game.world.centerY, 'bird');  
          this.sprite.anchor.setTo(0.5, 0.5);
          this.sprite.z = 15;
          game.physics.enable(this.sprite, Phaser.Physics.ARCADE);  
          this.sprite.animations.add('fly', [0, 1, 2], 10, true);  
          this.sprite.animations.play('fly');
          this.sprite.body.collideWorldBounds = true;  
          this.alive = true;
          this.whosyourdaddy = false;
        },

  jump: function() {
          if(!this.alive) {
            return;
          }
          this.sprite.body.velocity.y = -400;
        },

  hitPipe: function() {
             if(Bird.whosyourdaddy) {
               return;
             }
             GameController.end();
           },

  die: function() {
         this.sprite.animations.stop('fly');
         this.alive = false;
       },

  relive: function() {
            var timer = game.time.create(game);
            this.whosyourdaddy = true;
            timer.add(2600, function() {
              Bird.whosyourdaddy = false;
            });
            timer.start();
            this.sprite.animations.play('fly');
            this.alive = true;
            this.jump();
          }

};
