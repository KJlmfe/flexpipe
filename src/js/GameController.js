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

