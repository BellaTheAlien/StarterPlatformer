class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 400; //500
        this.DRAG = 500;    // DRAG < ACCELERATION = icy slide - 700
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600; //-900
        //for the particles
        this.PARTICLE_VELOCITY = 50;
        //for the camera
        this.SCALE = 2.0;
    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("donut_level", 18, 18, 45, 25);//platformer-level-1

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.backgroundTiles = this.map.addTilesetImage("tilemap-backgrounds", "tilemap-backgrounds");
        this.background = this.map.createLayer("Background", this.backgroundTiles, 0, 0);


        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap_tiles");

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        //this.groundLayer.setScale(2.0);

        //Create the backgroud layer
        
        //this.background.setScale(2.0);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        //the food objects
        this.donut = this.map.createFromObjects("Foods", {
            name: "donuts",
            key: "foods_sheet",
            frame: 14,
            //scale: 2.0, 
        });


        this.physics.world.enable(this.donut, Phaser.Physics.Arcade.STATIC_BODY);

        this.donutGroup = this.add.group(this.donut);

        // set up player avatar
        //my.sprite.player = this.physics.add.sprite(game.config.width/4, game.config.height/2, "platformer_characters", "tile_0000.png").setScale(SCALE)
        my.sprite.player = this.physics.add.sprite(30, 200, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        //makeing the collection vfx
        my.vfx.foodCollect =  this.add.particles(0,0, "kenny-particles", {
            frame: 'star_01.png',
            scale: {start: 0.03, end: 0.1},
            lifespan: 350,
            alpha: {start:1, end: 0.1},
        });

        my.vfx.foodCollect.stop();

        //the dount collision with player
        this.physics.add.overlap(my.sprite.player, this.donutGroup, (obj1, obj2) => {
            my.vfx.foodCollect.explode(10, obj2.x, obj2.y);
            obj2.destroy();
        });

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // debug key listener (assigned to D key)
        /*
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);
        */

        //adding the walking vfx
        my.vfx.walking = this.add.particles(0,0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_01.png'],
            random: true,
            scale: {start: 0.03, end: 0.1},
            maxAliveParticles: 20,
            gravityY: -300,
            alpha: {start: 1, end: 0.1},
        });
        my.vfx.walking.stop();

        //the camera code
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(5, 5);
        this.cameras.main.setZoom(this.SCALE);

    }

    update() {
        if(cursors.left.isDown) {
            //have the player accelerate to the left
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);

            //adding the particle code
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            //adding the limit for the particles to only play when the player is on the ground
            if(my.sprite.player.body.blocked.down){
                my.vfx.walking.start();
            }

        } else if(cursors.right.isDown) {
            //have the player accelerate to the right
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);

            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

            //adding the particles
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }

        } else {
            //set acceleration to 0 and have DRAG take over
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);

            my.sprite.player.anims.play('idle');

            //stoping the vfx
            my.vfx.walking.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            // TODO: set a Y velocity to have the player "jump" upwards (negative Y direction)
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);

        }
    }
}