State = {};

State.Boot = function(game) { };
State.Boot.prototype = {

  preload: function () {
             game.stage.backgroundColor = '#fff';
             game.world.height = Canvas.world.h;
             game.physics.setBoundsToWorld();  
             //game.physics.startSystem(Phaser.Physics.ARCADE);
             game.load.image('loading_inner', 'assets/loading_inner.png');
             game.load.image('loading_frame', 'assets/loading_frame.png');

             //根据当前浏览器窗口大小缩放画布尺寸
             //Todo IE浏览器的宽度和高度
             var w = window.innerWidth;
             var h = window.innerHeight;
             if(w/h > Canvas.w/Canvas.h) {
               w = Math.floor(h*(Canvas.w/Canvas.h));
             }
             if(w > Canvas.maxWidth) {
               w = Canvas.maxWidth;
               h = Math.floor(w/(Canvas.w/Canvas.h));
             } else {
               h = Math.floor(w/(window.innerWidth/window.innerHeight));
             }
             var scale = new Phaser.ScaleManager(game, w, h);
             scale.refresh();
           },

  create: function() {
            Score.boot();
            Canvas.boot();
            game.state.start('Load'); 
          }

};

State.Load = function(game) { };
State.Load.prototype = {

  preload: function() {
             var label_loading = game.add.text(Canvas.center_x, Canvas.center_y - 15, 'loading...', { font: '26px Arial', fill: '#000' });
             var label_name = game.add.text(Canvas.center_x, Canvas.h/3, Config.game_name, { font: '36px Arial', fill: '#000' });
             var label_author = game.add.text(Canvas.center_x, Canvas.h - 200, Config.author_info, { font: '24px Arial', fill: '#000' });
             label_loading.anchor.setTo(0.5, 0.5);
             label_name.anchor.setTo(0.5, 0.5);
             label_author.anchor.setTo(0.5, 0.5);

             var loading_frame = game.add.sprite(Canvas.center_x, Canvas.center_y + 15, 'loading_frame');
             loading_frame.x -= loading_frame.width/2
             var loading_inner = game.add.sprite(Canvas.center_x, Canvas.center_y + 19, 'loading_inner');
             loading_inner.x -= loading_inner.width/2
             game.load.setPreloadSprite(loading_inner);

             game.load.image('background', 'assets/background.png');
             //game.load.image('delay_img', 'assets/big.jpg');

             Bird.load();
             Score.load();
             Pipe.load();
             Ground.load();
             Menu.load();
           },

  create: function() {
            GameController.start();
          },
};

State.Play = function(game) { };
State.Play.prototype = {

  preload: function() {
             var background = game.add.sprite(0, 0, 'background');
             background.z = 0;
           },

  create: function() {
             Bird.init();
             Ground.init();
             Pipe.init();
             Score.init();
             GameController.init();
             Keyboard.init();
             Menu.showStartLabel();
          },

  update: function() {
            game.world.sort();
            //hack 貌似ground的z也没有效果 还是要用bringToTop
            game.world.bringToTop(Ground.ground);
            if(GameController.state !== GameController.STATE_PLAYING) {
              return;
            }
            game.physics.arcade.overlap(Bird.sprite, Pipe.pipes, Bird.hitPipe, null, Bird);  
            if(Config.debug === true) {
              Pipe.pipes.forEachAlive(function(p) {
                game.debug.body(p, '#f00', false);
              },this);
              game.debug.body(Bird.sprite);
            }
            var pipe = Pipe.getNextBirdPassPipe();
            if(pipe.init && pipe.x < Bird.sprite.x + Bird.sprite.width){
              Pipe.birdPassOnePipe();
              Score.addScore();
            } 
          }
};
