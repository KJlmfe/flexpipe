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

