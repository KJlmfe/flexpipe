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

