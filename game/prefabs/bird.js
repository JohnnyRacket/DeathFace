'use strict';

var Bird = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'bird', frame);
  this.anchor.setTo(0.5, 0.5);
  this.animations.add('flap');
  this.animations.play('flap', 12, true);

  this.flapSound = this.game.add.audio('flap');

  this.name = 'bird';
  this.alive = false;
  this.onGround = false;
  this.scale.set(.4, .5);

  // enable physics on the bird
  // and disable gravity on the bird
  // until the game is started
  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = false;
  this.body.collideWorldBounds = true;
  this.body.allowRotation = true;
  this.body.setSize(80,40,0,0);

  this.events.onKilled.add(this.onKilled, this);

  
  
};

Bird.prototype = Object.create(Phaser.Sprite.prototype);
Bird.prototype.constructor = Bird;
Bird.prototype.switchDir = false;

Bird.prototype.update = function() {
  // check to see if our angle is less than 90
  // if it is rotate the bird towards the ground by 2.5 degrees
  //game.debug.body(this);
 
}

Bird.prototype.left = function() {
  if(!!this.alive) {
    this.flapSound.play();
    //cause our bird to "jump" upward
    this.body.velocity.y = -250;
    // rotate the bird to -40 degrees
    this.game.add.tween(this).to({angle: -40}, 150).start();
  }
}

Bird.prototype.right = function() {
  if(!!this.alive) {
    this.flapSound.play();
    //cause our bird to "jump" upward
    this.body.velocity.y = 250;
    // rotate the bird to -40 degrees
    this.game.add.tween(this).to({angle: 40}, 150).start();
  }
};

Bird.prototype.switch = function() {
  if(!!this.alive) {
    this.flapSound.play();
    //cause our bird to "jump" upward
    if(Bird.prototype.switchDir){
    this.body.velocity.y = 250;
    Bird.prototype.switchDir = false;
    this.game.add.tween(this).to({angle: 40}, 150).start();
    }else{
      this.body.velocity.y = -250;
    Bird.prototype.switchDir = true;
    this.game.add.tween(this).to({angle: -40}, 150).start();
    }
    // rotate the bird to -40 degrees
    
  }
};

Bird.prototype.revived = function() { 
};

Bird.prototype.onKilled = function() {
  this.exists = true;
  this.visible = true;
  this.animations.stop();
  var duration = 90 / this.y * 100;
  this.game.add.tween(this).to({angle: 1080}, 10000).start();
  console.log('killed');
  console.log('alive:', this.alive);
};
