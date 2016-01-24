
'use strict';
//var Bird = require('../prefabs/bird');
//var Pipe = require('../prefabs/pipe');
//var PipeGroup = require('../prefabs/pipeGroup');
//var Scoreboard = require('../prefabs/scoreboard');

function Play() {
}

function take_snapshot() {
    Webcam.snap( function(data_uri) {

        //var reactionImage = new Image(100, 200);
        //reactionImage.src = data_uri;
        console.log(data_uri);
        //console.log("what");

        
        //document.getElementById('my_result').innerHTML = '<img src="'+data_uri+'"/>';
        var data = new Image();
        data.src = data_uri;
        console.log(data);
        game.cache.addImage('image-data', data_uri, data);


        //setTimeout(postImage(data), 0);
        $.ajax({
        type: 'POST',
        url:'https://ec2-52-90-67-8.compute-1.amazonaws.com:8080/api/photo',
        data: '{"data": "'+ data_uri.toString() +'"}', 
        contentType: 'application/json',
        success:function(data_uri){
            console.log("success");
            console.log(JSON.stringify(data_uri));
        },
        error: function(data_uri){
            console.log("error");
            console.log(JSON.stringify(data_uri));
        }
        });

    } );
}

function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}

Play.prototype = {
  create: function() {
    // start the phaser arcade physics engine
    this.game.physics.startSystem(Phaser.Physics.ARCADE);


    // give our world an initial gravity of 1200
    this.game.physics.arcade.gravity.y = 0;

    // add the background sprite
    this.background = this.game.add.sprite(0,0,'background');

    // create and add a group to hold our pipeGroup prefabs
    this.pipes = this.game.add.group();
    
    // create and add a new Bird object
    this.bird = new Bird(this.game, 100, this.game.height/2);
    this.game.add.existing(this.bird);
    
    

    // create and add a new Ground object
    this.ground = new Ground(this.game, 0, 505-66, 335, 66);
    this.game.add.existing(this.ground);



    this.ground2 = new Ground(this.game, 168,33, 335, 66);
    this.ground2.anchor.x = .5;//this.ground.width;
    this.ground2.anchor.y = .5//this.ground.height;
    this.ground2.angle = 180;
    this.ground2.autoScroll(200,0);
    this.game.add.existing(this.ground2);

    //game.debug.body(this.ground2);
    //game.debug.body(this.ground);

    
    
   

    // add keyboard controls
    this.flapKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.flapKey.onDown.addOnce(this.startGame, this);
    this.flapKey.onDown.add(this.bird.left, this.bird);

        this.flapKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.flapKey.onDown.addOnce(this.startGame, this);
    this.flapKey.onDown.add(this.bird.right, this.bird);
    

    // add mouse/touch controls
    this.game.input.onDown.addOnce(this.startGame, this);
    this.game.input.onDown.add(this.bird.left, this.bird);
    

    // keep the spacebar from propogating up to the browser
    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    

    this.score = 0;
    this.scoreText = this.game.add.bitmapText(this.game.width/2, 10, 'flappyfont',this.score.toString(), 24);

    this.instructionGroup = this.game.add.group();
    this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 100,'getReady'));
    this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 325,'instructions'));
    this.instructionGroup.setAll('anchor.x', 0.5);
    this.instructionGroup.setAll('anchor.y', 0.5);

    this.pipeGenerator = null;

    this.gameover = false;

    this.pipeHitSound = this.game.add.audio('pipeHit');
    this.groundHitSound = this.game.add.audio('groundHit');
    this.scoreSound = this.game.add.audio('score');
    
  },
  update: function() {
    // enable collisions between the bird and the ground
    this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this);
    this.game.physics.arcade.collide(this.bird, this.ground2, this.deathHandler, null, this);

    if(!this.gameover) {    
        // enable collisions between the bird and each group in the pipes group
        this.pipes.forEach(function(pipeGroup) {
            this.checkScore(pipeGroup);
            this.game.physics.arcade.collide(this.bird, pipeGroup, this.deathHandler, null, this);
        }, this);
    }


    
  },
  shutdown: function() {
    this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
    this.bird.destroy();
    this.pipes.destroy();
    this.scoreboard.destroy();
  },
  startGame: function() {
    if(!this.bird.alive && !this.gameover) {
        this.bird.body.allowGravity = true;
        this.bird.alive = true;
        // add a timer
        this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this);
        this.pipeGenerator.timer.start();

        this.instructionGroup.destroy();
    }
  },
  checkScore: function(pipeGroup) {
    if(pipeGroup.exists && !pipeGroup.hasScored && pipeGroup.topPipe.world.x <= this.bird.world.x) {
        pipeGroup.hasScored = true;
        this.score++;
        pipeGroup.setVelocity(-1*(200+ this.score*10));
        this.ground.autoScroll(-1*(200+ this.score*10),0);
        this.ground2.autoScroll(200+ this.score*10, 0);
        this.scoreText.setText(this.score.toString());
        this.scoreSound.play();
    }
  },
  deathHandler: function(bird, enemy) {

    var scoring = function(){
        if(!this.gameover){
            this.reactionImage = take_snapshot(); 
        }
     

        if(enemy instanceof Ground && !this.bird.onGround) {
            this.groundHitSound.play();
            this.scoreboard = new Scoreboard(this.game, this.reactionImage);
            this.game.add.existing(this.scoreboard);
            this.scoreboard.show(this.score);
            this.bird.onGround = true;
        } else if (enemy instanceof Pipe){
            this.pipeHitSound.play();
            this.scoreboard = new Scoreboard(this.game, this.reactionImage );
            this.game.add.existing(this.scoreboard);
            this.scoreboard.show(this.score);
            this.bird.onGround = true;
        }

    }

    var sleepThenAct = function(){ sleepFor(900); console.log("taking Picture!"); };
    sleepThenAct().then(scoring();
  //your code to be executed after 1 seconds
    

     
     

    if(!this.gameover) {
        this.gameover = true;
        this.bird.kill();
        this.pipes.callAll('stop');
        this.pipeGenerator.timer.stop();
        this.ground.stopScroll();
        this.ground2.stopScroll();
    }
    
  },
  generatePipes: function() {
    var pipeY = this.game.rnd.integerInRange(-100, 100);
    var pipeGroup = this.pipes.getFirstExists(false);
    if(!pipeGroup) {
        pipeGroup = new PipeGroup(this.game, this.pipes);  
    }
    pipeGroup.reset(this.game.width + 27, pipeY, (-1*(200+ this.score*10)));
    

  }
};
