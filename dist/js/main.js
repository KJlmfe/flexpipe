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

GameController = {

  STATE_START: 0,
  STATE_PLAYING: 1,
  STATE_END: 2,
  state: 0,

  init: function() {
    this.state = this.STATE_START;
  },

  start: function() {
           game.state.start('Play');
         },

  resume: function() {
            this.state = GameController.STATE_PLAYING;
            Bird.relive();
            Pipe.play();
            Menu.restart_button.kill();
            Score.hideScoreBoard();
            Ground.play();
          },

  end: function() {
         this.state = this.STATE_END;
         Ground.pause();
         Bird.die();
         Pipe.stop();
         Score.updateBestScore();
         Score.showScoreBoard();
         Menu.showRestartButton();
       }
};


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


Menu = {

  tip_style: { font: "30px Arial", fill: "#ffffff" ,align: "center"},
  name_style: { font: "50px Arial", fill: "#ffffff" ,align: "center"},

  load: function() {
          game.load.image('restart_button', 'assets/restart.png');
  },

  showRestartButton: function() {
                       this.restart_button = game.add.sprite(Canvas.center_x, Canvas.center_y + 69, 'restart_button');
                       this.restart_button.anchor.setTo(0.5, 0.5);
                       this.restart_button.inputEnabled = true;
                       this.restart_button.events.onInputDown.add(function() {
                         var option = confirm("^_^ Like this game will relive the bird.");
                         if(option) {
                           GameController.resume();
                         } else {
                           GameController.start();
                         }
                       });

                     },
  showStartLabel: function() {
                    this.label_tip = game.add.text(game.world.centerX, game.world.centerY+100, "Tap to play\n (Press space key to play)\n\nInspired by Flappy Bird\nBy KJlmfe", this.tip_style);
                    this.label_name = game.add.text(game.world.centerX, game.world.centerY/3, "Flex Pipe", this.name_style);
                    this.label_name.anchor.setTo(0.5, 0.5);
                    this.label_tip.anchor.setTo(0.5,0.5);
                    this.label_tip.z = 20;
                  },

  hideStartInfo: function() {
                   game.world.remove(this.label_tip);
                   game.world.remove(this.label_name);
                 }
};

Pipe = {

  count: 10,

  load: function() {
          game.load.image('pipe', 'assets/pipe.png'); 
        },

  init: function() {
          this.pipes = game.add.group();
          this.pipes.z = 5;
          this.pipes.createMultiple(this.count, 'pipe');
          game.physics.enable(this.pipes, Phaser.Physics.ARCADE);  
          this.next_bird_pass_pipe_index = 1;
          this.pipes.resetCursor();
        },

  play: function() {
          this.timer = game.time.events.loop(1500, this.addPipes, this);
          this.pipes.forEachAlive(function(p) {
            p.body.velocity.x = -300;
            if(p.pistion_motion) {
              p.pistion_motion.resume();
            }
          },this);
        },

  stop: function() {
          game.time.events.remove(this.timer);
          this.pipes.forEachAlive(function(p) {
            p.body.velocity.x = 0;
            if(p.pistion_motion) {
              p.pistion_motion.pause();
            }
          },this);
        },

  getNextBirdPassPipe: function() {
                         return this.pipes.getAt(this.next_bird_pass_pipe_index);
                       },

  birdPassOnePipe: function() {
                     this.next_bird_pass_pipe_index = (this.next_bird_pass_pipe_index + 2) % this.count;
                   },

  addPipes: function() {
                var top_pipe = this.pipes.next();
                var top_y = Math.floor(Math.random()*350)+100;
                top_pipe.angle = 180;
                //在AABB中 sprite rotate后 body并不会rotate 所以
                top_pipe.body.offset.setTo(-top_pipe.width, -top_pipe.height);
                this._addOnePipe(top_pipe, game.world.width + top_pipe.width, top_y);

                var bottom_pipe = this.pipes.next();
                var bottom_y = top_y + 200;
                this._addOnePipe(bottom_pipe, game.world.width, bottom_y);
                this.addPistionMotion(bottom_pipe);
              },

  addPistionMotion: function(pipe) {
                      if(pipe.pistion_motion) {
                        pipe.pistion_motion.stop();
                      }
                      pipe.pistion_motion = game.add.tween(pipe);
                      var delay = Math.floor(Math.random()*300)+0;
                      pipe.pistion_motion.to({y: pipe.y + 200}, 1000, null,true, delay, Number.MAX_VALUE, true);
                    },

  _addOnePipe: function(pipe, x, y) {
                 pipe.init = true;
                 pipe.reset(x, y);
                 pipe.body.velocity.x = -300;
                 pipe.outOfBoundsKill = true;
                 pipe.checkWorldBounds = true;
                 pipe.hasScore = false;
               }

};


Score = {

  style: { font: "50px Arial", fill: "#ffffff" },

  load: function() {
          game.load.image('score_board', 'assets/score.png');
  },

  boot: function() {
          this.best_score = 0;
          this.board_x = Canvas.w/2;
          this.board_y = Canvas.h/2 - 139;
        },

  init: function() {
          this.score = 0;
          this.label_score = game.add.text(this.board_x, this.board_y - 25, "0", this.style);
          this.label_score.anchor.setTo(0.5, 0.5);
          this.label_score.z = 20;
        },

  addScore: function() {
              this.score += 1;
              this.label_score.setText(this.score.toString());
            },

  updateBestScore: function() {
                     this.best_score = this.best_score > this.score ? this.best_score : this.score;
                   },

  showScoreBoard: function() {
                    this.board = game.add.sprite(this.board_x, this.board_y, 'score_board');
                    this.board.anchor.setTo(0.5, 0.5);
                    this.board.z = 20;
                    //hack 貌似z对text类的sprite无效  所以用bringToTop
                    game.world.bringToTop(this.label_score);
                    this.label_best_score = game.add.text(this.board_x, this.board_y + 59, this.best_score.toString(), this.style);
                    this.label_best_score.anchor.setTo(0.5, 0.5);
                    this.label_best_score.z = 25;
                  },

  hideScoreBoard: function() {
                    game.world.remove(this.board);
                    game.world.remove(this.label_best_score);
                  }
};


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

Canvas = {
  w: 768,
  h: 896+112,
  //显示的最大宽度 高度由上面的原始素材w，h比例算出
  maxWidth: 512,
  //物理世界的大小
  world: {
    h: 896,
    w: 768
  },

  boot: function() {
    this.center_x = Math.floor(this.w/2) + 0.5;
    this.center_y = Math.floor(this.h/2) + 0.5;
  }
};

Config = {
  game_name: "Flex Bird",
  author_info: "By KJlmfe",
  debug: false
}

var game = new Phaser.Game(Canvas.w, Canvas.h, Phaser.AUTO, 'game_wrapper');

game.state.add('Boot', State.Boot);
game.state.add('Load', State.Load);
game.state.add('Play', State.Play);

game.state.start('Boot');

