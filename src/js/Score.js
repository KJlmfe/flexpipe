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

