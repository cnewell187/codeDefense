//edit this function to accept enemies array, and target nearest enemy
newTower = function(index, game, enemies, bullets, sprite) {

    this.game = game;
    this.enemy = "";
    this.enemyBody = "";
    this.enemyHealth = "";
    this.bullets = bullets;
    this.nextFire = 0;
    this.alive = true;

    this.tower = game.add.sprite(Math.round(sprite.position.x / 32) * 32, Math.round(sprite.position.y / 32) * 32, sprite.key);

    game.physics.enable(this.tower, Phaser.Physics.ARCADE);
    this.tower.name = index.toString();


};


dragonBulletTower = function(index, game, enemies, bullets, sprite) {
    newTower.call(this, index, game, enemies, bullets, sprite);
    this.type = "dragonBullet";
    this.damageType = "physical";
    this.range = 200;
    this.fireRate = 100;
    this.damagePower = 1;
    this.bulletSpeed = 1000;

};
dragonBulletTower.prototype = Object.create(newTower.prototype);
dragonBulletTower.prototype.constructor = dragonBulletTower;


skullTower = function(index, game, enemies, bullets, sprite) {
    newTower.call(this, index, game, enemies, bullets, sprite);
    this.type = "skull";
    this.damageType = "flame";
    this.range = 5000;
    this.fireRate = 1000;
    this.damagePower = 10;
    this.bulletSpeed = 300;

};

skullTower.prototype = Object.create(newTower.prototype);
skullTower.prototype.constructor = skullTower;



newTower.prototype.update = function() {

    //this sets the index to the farthest ahead enemy in range
    var enemyIndex = this.firstEnemyInRange();

    if (enemyIndex != undefined) {
        this.enemy = enemies[enemyIndex]; //this is the newEnemy object
        this.enemyBody = enemies[enemyIndex].enemy; //this is the phaser sprite body
        this.enemyHealth = enemies[enemyIndex].health; //this is health property of newEnemyObject
    }

    //this logic needs to be broken up
    //this creates the bullet and sends it to the target enemy, which is found above by finding the closest
    //enemy

    if (this.game.physics.arcade.distanceBetween(this.tower, this.enemyBody) < this.range) {
        if (this.game.time.now > this.nextFire) {
            this.nextFire = this.game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();
            if (this.enemy.alive === true) {
                bullet.reset(this.tower.x+8, this.tower.y+8);
                // bullet.rotation =
                this.game.physics.arcade.moveToObject(bullet, this.enemyBody, this.bulletSpeed);
            }
            for (var i = 0; i < this.bullets.length; i++) {
                if (this.bullets.children[i].alive === true && this.enemy.alive === true) {
                    console.log("updating my bullets!")
                    // this.bullets.children[i].rotation =
                    this.game.physics.arcade.moveToObject(this.bullets.children[i], this.enemyBody, this.bulletSpeed);

                }
                if (this.enemy.alive === false) {

                    this.bullets.children[i].kill();
                }
            }
        }
    }

    //put this in the main update function instead of tower updatE
    //this checks overlap with bullets and all enemies
    //HackerDefense.game.enemiesAlive = 0;

    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].alive) {
            //HackerDefense.game.enemiesAlive++;
            HackerDefense.game.physics.arcade.overlap(this.bullets, enemies[i].enemy, this.bulletHitEnemy, null, this);
            enemies[i].update();
        }
    }

    //makes sure the tower doesn't run out of bullets!!!
    this.bullets.createMultiple(1, 'bullet')

};

newTower.prototype.firstEnemyInRange = function() {

    for (var i = 0; i < enemies.length; i++) {
        if (this.game.physics.arcade.distanceBetween(this.tower, enemies[i].enemy) < this.range &&
            enemies[i].alive === true) {

            return i;
        }
    }
}



newTower.prototype.bulletHitEnemy = function(enemy, bullet) {

    bullet.kill();
    enemies[enemy.name].health -= this.damagePower;

}


function newEnemy(index, game) {
    this.game = game;
    this.health = 10;
    this.alive = true;


    //spawns enemy at spawn point
    this.enemy = game.add.sprite(0, 544, 'enemy1');

    //sets how fast the enemies spawn!
    this.spawnRate = 100;
    this.enemy.name = index.toString();
    game.physics.enable(this.enemy, Phaser.Physics.ARCADE);

    //sets the initial path to zero
    this.nextStep = 0;

    //need to add the enemy to the enemies array or group?
};



newEnemy.prototype.update = function() {


    if (this.health <= 0 && this.alive === true) {
        this.enemy.kill();
        var splosion = this.game.add.sprite(this.enemy.position.x-16, this.enemy.position.y-16, 'kaboom');
        splosion.animations.add('BOOM');
        splosion.animations.play('BOOM', 30, false, true);

        this.alive = false;
        this.game.state.states.Game.levelCount = this.game.state.states.Game.levelCount + 1
        this.game.state.states.Game.resourceA = this.game.state.states.Game.resourceA + 10
    }
};


function newEnemy2(index, game) {
    this.game = game;
    this.health = 20;
    this.alive = true;


    //spawns enemy at spawn point
    this.enemy = game.add.sprite(0, 544, 'enemy2');

    //sets how fast the enemies spawn!
    this.spawnRate = 100;
    this.enemy.name = index.toString();
    game.physics.enable(this.enemy, Phaser.Physics.ARCADE);

    //sets the initial path to zero
    this.nextStep = 0;

    //need to add the enemy to the enemies array or group?
};

newEnemy2.prototype.update = function() {


    if (this.health <= 0 && this.alive === true) {
        this.enemy.kill();
        var splosion = this.game.add.sprite(this.enemy.position.x, this.enemy.position.y, 'kaboom');
        splosion.animations.add('BOOM');
        splosion.animations.play('BOOM', 30, false, true);

        HackerDefense.game.levelCount = HackerDefense.game.levelCount + 1
        this.game.state.states.Game.resourceA = this.game.state.states.Game.resourceA + 10
        this.alive = false;
    }
};


var HackerDefense = HackerDefense || {};

HackerDefense.Game = function() {};

var enemyPaths = [];
var enemyPath = [];
// var nextStep = 0;
var towerGroup;
var buildGroup;
var enemies;
var towerBullets;
var nextLevelButton;

HackerDefense.Game.prototype = {

    create: function() {
        this.map = this.game.add.tilemap('level2');
        this.level = 1;
        this.levelCount = 0;
        this.levelPass = false;
        this.enemiesAlive = 0;
        this.resourceA = 100;
        this.lives = 50;
        this.resourcesText = this.game.add.text(this.game.world.centerX - 40, this.game.world.centerY + 250, "Resources:", {
            font: "40px Arial",
            fill: "#00000",
            align: "center"
        });

        this.resourcesText.setText("Resources: " + this.resourceA);

        this.livesText = this.game.add.text(this.game.world.centerX - 40, this.game.world.centerY + 200, "Lives:", {
            font: "40px Arial",
            fill: "#00000",
            align: "center"
        });

        this.livesText.setText("Lives: " + this.lives);

        this.statusText = this.game.add.text(this.game.world.centerX + 100,
            this.game.world.centerY + 120, "Click To Start Level 1", {
                font: "40px Arial",
                fill: "#00000",
                align: "center"
            });

        //add a button to play next level
        nextLevelButton = this.game.add.button(this.game.world.centerX - 50, 400, 'button', this.actionOnClick, this);

        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        this.map.addTilesetImage('scifi_platformTiles_32x32', 'gameTiles');
        this.map.addTilesetImage('enemy_1', 'enemy1');


        //creates tile layers
        this.wallLayer = this.map.createLayer('wallLayer');
        this.pathLayer = this.map.createLayer('pathLayer');

        //collision on wallLayer
        this.map.setCollisionBetween(1, 100000, true, 'wallLayer');
        towerGroup = this.game.add.group();
        buildGroup = this.game.add.group();

        enemies = [];
        // enemies = this.game.add.group();
        towers = [];

        //adds a grid for building towers
        var grid = this.game.add.sprite(640, 0, 'towerBox');
        this.game.world.sendToBack(grid);

        //puts the first available tower in the grid and makes it draggable


        var fireGuy = buildGroup.create(640, 0, 'fireGuy');
        fireGuy.inputEnabled = true;
        fireGuy.input.enableDrag();
        fireGuy.defaultx = 640;
        fireGuy.defaulty = 0;
        fireGuy.towerCost = 50;
        fireGuy.bulletKey = 'flame';
        fireGuy.constructorType = dragonBulletTower;
        this.fireGuyCostText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 320, "TowerCost: 50", {
            font: "20px Arial",
            fill: "#00000",
            align: "center"
        });

        // fireGuy.events.onDragStart.add(onDragStart, this);
        fireGuy.events.onDragStop.add(this.onDragStop, this);


        var skullGuy = buildGroup.create(640, 32, 'skullGuy');
        skullGuy.inputEnabled = true;
        skullGuy.input.enableDrag();
        skullGuy.defaultx = 640;
        skullGuy.defaulty = 32;
        skullGuy.towerCost = 50;
        skullGuy.bulletKey = 'skullBullet';
        skullGuy.constructorType = skullTower;
        this.skullGuyCostText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 288, "TowerCost: 50", {
            font: "20px Arial",
            fill: "#00000",
            align: "center"
        });

        // fireGuy.events.onDragStart.add(onDragStart, this);
        skullGuy.events.onDragStop.add(this.onDragStop, this);


        //resizes the game world to match the layer dimensions
        this.pathLayer.resizeWorld();

        //creates enemies
        //this.createEnemies();
        //sets the second spawn 1 second after start
        this.nextSpawn = 2000;



        maze = [];
        for (maze_row = 0; maze_row < this.map.layers[1].data.length; maze_row += 1) {
            maze[maze_row] = [];
            for (maze_column = 0; maze_column < this.map.layers[1].data[maze_row].length; maze_column += 1) {
                maze[maze_row][maze_column] = this.map.layers[1].data[maze_row][maze_column].index;;

                //this.map.layers[1].data[maze_row][maze_column].index;
            }
        }

        //create pathfinding with easy star
        var easystar = new EasyStar.js();
        easystar.setGrid(maze);
        easystar.setAcceptableTiles([-1]);
        //this.enemyPathMaker is the callback for findPath, it passes in a path argument
        easystar.findPath(0, 16, 0, 2, this.enemyPathMaker);
        easystar.calculate();

    },

    actionOnClick: function() {

        this.levelPass = true;
        this.statusText.setText("Enemies To Be Spawned: 30");
    },

    onDragStop: function(sprite, pointer) {

        // add if not on track logic!
        //add if enough money logic!

        towerBullets = HackerDefense.game.add.group();
        towerBullets.enableBody = true;
        towerBullets.physicsBodyType = Phaser.Physics.ARCADE;
        towerBullets.createMultiple(10, sprite.bulletKey);

        //this pushes a new tower to the towers Array, should possibly make a towers group?
        //edit this to push the enemies group, so tower can attack nearest enemy
        if (this.resourceA >= sprite.towerCost) {
            towers.push(new sprite.constructorType(towers.length - 1, HackerDefense.game, enemies, towerBullets, sprite));
            this.resourceA -= sprite.towerCost;
        };

        sprite.position.x = sprite.defaultx;
        sprite.position.y = sprite.defaulty;
    },

    //this modifies the path created by easystar to create an array of points that are in pixels
    // need to add a way to have paths for MULTIPLE enemies
    enemyPathMaker: function(path) {

        path.forEach(function(element, index, array) {
            enemyPath.push([array[index].x * 32, array[index].y * 32]);
        }, this);

    },


    //uses the pixel based path to move the enemy
    enemyMove: function(enemyPath) {
        //is making a path for each enemy
        enemies.forEach(function(enemy, index, array) {

            //makes sure another path step exists!

            if (enemyPath[enemy.nextStep] != undefined) {

                //enemyPath[enemy.nextStep][0] is the x value,  enemyPath[enemy.nextStep][1] is the y value,
                next_position = new Phaser.Point(enemyPath[enemy.nextStep][0], enemyPath[enemy.nextStep][1]);

                var distance = Phaser.Point.distance(enemy.enemy.position, next_position);

                if (distance > 5 && enemy.nextStep < enemyPath.length-1) {
                    velocity = new Phaser.Point(next_position.x - enemy.enemy.position.x,
                        next_position.y - enemy.enemy.position.y);
                    velocity.normalize();
                    enemy.enemy.body.velocity.x = velocity.x * 200;
                    enemy.enemy.body.velocity.y = velocity.y * 200;
                }




                else {
                    if (enemy.nextStep < enemyPath.length) {
                        enemy.nextStep += 1;

                    }
                }

            }

            if(enemy.nextStep >= enemyPath.length && enemy.alive === true){
             // enemy.enemy.kill();
             enemy.alive = false;
             console.log("enemy killed")

            HackerDefense.game.state.states.Game.levelCount = HackerDefense.game.state.states.Game.levelCount + 1
            HackerDefense.game.state.states.Game.lives = HackerDefense.game.state.states.Game.lives -1
            HackerDefense.game.state.states.Game.livesText.setText("Lives: " + HackerDefense.game.state.states.Game.lives);

           }

        })

    },

    createEnemies: function() {
        this.spawnRate = 1000;

        //create enemies
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;


        //creating a new enemy using enemy constructor!
        if (this.game.time.now > this.nextSpawn && enemies.length < 30) {

            this.statusText.setText("Enemies To Be Spawned: " + (29 - enemies.length));

            this.nextSpawn = this.game.time.now + this.spawnRate;

            enemies.push(new newEnemy(enemies.length, HackerDefense.game));

        }

        //old way pulling from map
        // enemies.push(new newEnemy(enemies.length - 1, HackerDefense.game, enemies.children[0], towerBullets, sprite));

        // var enemy;
        // result = this.findObjectsByType('enemy1', this.map, 'enemyLayer');
        // result.forEach(function(element) {

        //     this.createFromTiledObject(element, enemies);
        // }, this);
    },

    createEnemies2: function() {
        this.spawnRate = 1000;

        //create enemies
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;


        //creating a new enemy using enemy constructor!
        if (this.game.time.now > this.nextSpawn && enemies.length < 30) {

            this.statusText.setText("Enemies To Be Spawned: " + (30 - enemies.length));

            this.nextSpawn = this.game.time.now + this.spawnRate;

            enemies.push(new newEnemy2(enemies.length, HackerDefense.game));
        }

        //old way pulling from map
        // enemies.push(new newEnemy(enemies.length - 1, HackerDefense.game, enemies.children[0], towerBullets, sprite));

        // var enemy;
        // result = this.findObjectsByType('enemy1', this.map, 'enemyLayer');
        // result.forEach(function(element) {

        //     this.createFromTiledObject(element, enemies);
        // }, this);
    },
    //find objects in a Tiled layer that containt a property called "type" equal to a certain value
    findObjectsByType: function(type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function(element) {

            if (element.properties.type === type) {

                //Phaser uses top left, Tiled bottom left so we have to adjust
                //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
                //so they might not be placed in the exact position as in Tiled
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    },
    //create a sprite from an object
    createFromTiledObject: function(element, group) {
        var sprite = group.create(element.x, element.y, element.properties.sprite);

        //copy all properties to the sprite
        Object.keys(element.properties).forEach(function(key) {
            sprite[key] = element.properties[key];
        });

    },

    levelClearCheck: function() {

        // for(var i = 0)
    },

    update: function() {

        this.resourcesText.setText("Resources: " + this.resourceA);
        this.enemyMove(enemyPath);
        if(towers[0] != undefined){
        towers[0].update();
      }


        if (this.level === 1 && this.levelPass === true) {
            this.createEnemies();
        }
        if (this.level === 2 && this.levelPass === true) {
            this.createEnemies2();
        }
        for (var i = 0; i < towers.length; i++) {
            towers[i].update();
        }

        for (var i = 0; i < enemies.length; i++) {
            enemies[i].update();
        }
        if (this.levelCount >= 30) {
            console.log("LEVEL UP!!!")
            this.levelPass = false;

            this.levelCount = 0;
            this.level = this.level + 1
            this.statusText.setText("Click to begin Level " + this.level);
            enemies = [];
        }

    },


};
