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
