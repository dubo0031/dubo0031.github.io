
var width = window.screen.width*0.99;
var height = window.screen.height*0.80;

console.log(width, height);

var config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

new Phaser.Game(config);
var score = 0;
var scoreText;
var bullets;
var timer;
var timerspawn;
var shoots;
var asteroids;
var paused=false;
var reset;
function preload() {
  //console.log(this);
  this.load.setBaseURL('phaser');
    this.load.image('ship', 'assets/games/asteroids/ship.png');
    this.load.image('bullet', 'assets/games/asteroids/bullets.png');
    this.load.image('aste1', 'assets/games/asteroids/asteroid1.png');
    this.load.image('aste2', 'assets/games/asteroids/asteroid2.png');
    this.load.image('aste3', 'assets/games/asteroids/asteroid3.png');
    this.load.image('flash', 'assets/games/asteroids/muzzle-flash.png');
}

function create() {
  scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
  this.shoots = this.add.group();
  this.asteroids = this.add.group();
    //this.physics.startSystem(Phaser.Physics.ARCADE);
    timer=this.time.now;
    timerspawn=0;
    sprite = this.add.sprite(width/2, height*0.95, 'ship');
    //sprite.anchor.set(0.5);
    sprite.angle = 270;
    this.scene.backgroundColor = '#313131';

    bullets = this.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(50, 'bullet');
    for(var i = 0; i < 50; i++){
      bullets.create(sprite.x, sprite.y, 'bullet', null, false, false);
    }
    bullets.children.each(function(bullet) {
      bullet.checkWorldBounds = true;
      bullet.outOfBoundsKill = true;
      bullet.enableBody = true;
      bullet.physicsBodyType = Phaser.Physics.ARCADE;
  }, this);
    /*bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);*/



    //this.physics.enable(sprite, Phaser.Physics.ARCADE);

    //sprite.body.allowRotation = false;
    this.input.on('pointerdown', function (pointer)
    {
      if(timer+100 < this.time.now){
        var bullet = this.physics.add.image(sprite.x - 8, sprite.y - 8, 'bullet');
        bullet.checkWorldBounds = true;
        bullet.outOfBoundsKill = true;
        bullet.setVisible(true);
        bullet.setActive(true);
        this.physics.moveToObject(bullet, pointer, 1000);
        timer = this.time.now;

        bullet.setCollideWorldBounds(true);

// Turning this on will allow you to listen to the 'worldbounds' event
        bullet.body.onWorldBounds = true;

        // 'worldbounds' event listener
        bullet.body.world.on('worldbounds', function(body) {
  // Check if the body's game object is the sprite you are listening for
          if (body.gameObject === this) {
            // Stop physics and render updates for this object
            this.setActive(false);
            this.setVisible(false);
            this.destroy();
          }
        }, bullet);
        this.shoots.add(bullet);
    }
  }, this);

  this.time.addEvent({
    delay: 1000,
    callback: function() {
      if(!this.paused){
      var num =Phaser.Math.Between(1, 3);
      var aste= this.physics.add.image(Phaser.Math.Between(width*0.2, width*0.80), 50, 'aste'+num);
      aste.angle= Phaser.Math.Between(1, 360);
      this.physics.moveTo(aste, aste.x, 1000, 100);
      timerspawn = this.time.now;

      aste.setCollideWorldBounds(true);


      aste.body.onWorldBounds = true;
      aste.body.world.on('worldbounds', function(body, aste) {
        if (body.gameObject === this) {
          aste.setActive(false);
          aste.setVisible(false);
        }
        if(body.gameObject.texture.key != 'bullet'){
          this.physics.pause();
          this.add.text(width/2*0.80, height/2, 'GAME OVER', { fontSize: '32px', fill: '#FFF' });
          this.reset =this.add.text(width/2*0.80, height/2+30, 'Restart', { fontSize: '32px', fill: '#FFF' })
          .setInteractive()
          .on('pointerdown', () => window.location.reload(false) )
          .on('pointerover', () => this.reset.setStyle({ fill: '#ff0'}))
          .on('pointerout', () => this.reset.setStyle({ fill: '#fff'}));
          this.paused = true;
        }
          //gameOver();
      }, this);
      this.asteroids.add(aste);
    }
    },
    callbackScope: this,
    loop: true
  }, this);


}

function collisionHandler(shoot, asteroid){
  asteroid.setActive(false);
  asteroid.setVisible(false);
  shoot.setActive(false);
  shoot.setVisible(false);
  score+=100;
  scoreText.setText('Score: ' + score);
  var boom = this.physics.add.image(asteroid.x, asteroid.y, 'flash');
  shoot.destroy();
  asteroid.destroy();
  var timer = this.time.delayedCall(100, function (){
    boom.destroy();
  }, boom, this);
}
function update() {

    this.physics.overlap(this.shoots, this.asteroids, collisionHandler, null, this);

    //sprite.rotation = this.physics.arcade.angleToPointer(sprite);

    /*if (this.input.activePointer.isDown)
    {
      var bullet = bullets.getFirstDead();
      bullet.enableBody = true;
      console.log(bullet);
      bullet.x = sprite.x - 8;
      bullet.y = sprite.y - 8;
      bullet.setVisible(true);
      bullet.setActive(true);
      this.physics.moveToObject(bullet, this.input.activePointer, 300);
    }*/



}

function gameOver(){
  console.log(this);
  this.Phaser.Physics.Arcade.Events.pause();
  this.add.Text(width/2*0,80, height/2, 'GAME OVER', { fontSize: '32px', fill: '#FFF' });
}
