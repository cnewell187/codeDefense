var HackerDefense = HackerDefense || {};

//loading the game assets
HackerDefense.Preload = function() {};

HackerDefense.Preload.prototype = {
    preload: function() {



        WebFontConfig = {

            //  'active' means all requested fonts have finished loading
            //  We set a 1 second delay before calling 'createText'.
            //  For some reason if we don't the browser cannot render the text the first time it's created.
            active: function() {
                game.time.events.add(Phaser.Timer.SECOND, createText, this);
            },

            //  The Google Fonts we want to load (specify as many as you like in the array)
            google: {
                families: ['Revalia']
            }

        };

        //This stuff is if I want to add a loading bar and a logo!!!!!
        // this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        // this.splash.anchor.setTo(0.5);
        //
        // this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
        // this.preloadBar.anchor.setTo(0.5);
        //
        // this.load.setPreloadSprite(this.preloadBar);

        //load game assets
        this.load.image('greenCode', 'assets/images/greenCode.png');

        this.load.tilemap('level2', 'assets/images/level2.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('gameTiles', 'assets/images/scifi_platformTiles_32x32.png');
        this.load.image('enemy1', 'assets/images/enemy_1.png');
        this.load.image('fireGuy', 'assets/images/fireGuy.png');
        this.load.image('skullGuy', 'assets/images/skullGuy.png');
        this.load.image('towerBox', 'assets/images/spaceBackground.png');
        this.load.image('bullet', 'assets/images/bullet.png');
        this.load.image('enemy2', 'assets/images/enemy_2.png');
        this.load.image('enemy3', 'assets/images/enemy_3.png');
        this.load.image('enemy4', 'assets/images/enemy_4.png');
        this.load.image('finalBoss', 'assets/images/finalBoss.png');
        this.load.image('button', 'assets/images/startButton.png');
        this.load.image('flame', 'assets/images/flame.png');
        this.load.image('skullBullet', 'assets/images/skullBullet.png');
        this.load.image('laserGuy', 'assets/images/laserTurret.png');
        this.load.image('greenLaser', 'assets/images/greenLaser.png');
        this.load.spritesheet('kaboom', 'assets/images/explosion.png', 64, 64, 23);
        this.load.image('archerGuy', 'assets/images/archerTower.png');
        this.load.image('arrow', 'assets/images/arrow.png');
        //this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js');

        // this.load.audio('explosion', 'assets/audio/explosion.ogg');
    },
    create: function() {
        this.state.start('MainMenu');
    }
};
