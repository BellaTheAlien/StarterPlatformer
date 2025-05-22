class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        this.load.image("tilemap_tiles", "tilemap_packed.png");                         // Packed tilemap
        this.load.tilemapTiledJSON("donut_level", "donut_level..tmj");   // Tilemap in JSON

        this.load.image("tilemap-backgrounds", "tilemap-backgrounds_packed.png");
        //load in the candy tiles
        this.load.image("candy_tiles", "tilemap_packed_candy.png");
        this.load.spritesheet("foods_sheet", "tilemap_packed_candy.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        //load in the vfx particals
        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        //audio for pick up
        this.load.audio("collect", "jingles_PIZZI09.ogg");

    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0000.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0001.png" }
            ],
        });

         // ...and pass to the next Scene
         this.scene.start("platformerScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}