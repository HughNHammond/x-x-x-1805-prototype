//TILE VARIABLES
let tilemap = [];
let tileSize = 50;
let numAcross = 20;
let numDown = 10;
let textures = [];
let graphicsMap = [
// 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //0
  [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1], //1
  [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1], //2
  [1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1], //3
  [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1], //4
  [1, 2, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1], //5
  [1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1], //6
  [1, 1, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1], //7
  [1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //8
  [1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]  //9
]

let tileRules = [

    //0 = empty space
    //1 = ground
    //2 = unwalkable
// 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19
  [2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], //0
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2], //1
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2], //2
  [2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2], //3
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2], //4
  [2, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2], //5
  [2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2], //6
  [2, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2], //7
  [2, 2, 1, 1, 1, 2, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2], //8
  [2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]  //9
]

//PLAYER VARIABLES
let player;
let playerSprite;
let playerXSpeed = 2;
let playerYSpeed = 5;

//CANVAS VARIABLES
let canvasWidth = 1000;
let canvasHeight = 500;

function preload() {
    textures[0] = loadImage("void_50x.png");
    textures[1] = loadImage("wall_50x.png");
    textures[2] = loadImage("crack-l_50x.png");
    textures[3] = loadImage("crack-r_50x.png");

    playerSprite = loadImage("librarian-r.png")
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);

  let tileID = 0;
  for (let across = 0; across < numAcross; across++) {
      tilemap[across] = [];
      for (let down = 0; down < numDown; down++) {

          tilemap[across][down] = new Tile(textures[graphicsMap[down][across]], across, down, tileSize, tileID);

          tileID++;
      }
  }
  player = new Player(playerSprite, 1, 2, tileSize, playerXSpeed, playerYSpeed, tileSize, tileRules);
}

function draw() {
  background(0);
  
  for (let across = 0; across < numAcross; across++) {
      for (let down = 0; down < numDown; down++) {
        tilemap[across][down].display();
        //tilemap[across][down].debug();
      }
  }

  player.update();
}

function keyPressed() { //this will trigger every time a key is presed
    if (!player.isJumping && !player.isFalling && player.isGrounded) { //checks if player.isJUMPING = false, player.isFalling = false, AND player.isGrounded = true
        //Check if key is space bar (our jump button).
        if (key === " ") {
            player.isJumping = true;
            player.jumpTarget = player.yPos - player.jumpDistance;
        }
    }
}

class Player {
    constructor(sprite, startAcross, startDown, size, xSpeed, ySpeed, tileSize, tileRules) {
        //Attach sprite to key in object
        this.sprite = sprite;

        //Store starting tile info. Later, we will use these to store the current tile the player is on.
        this.across = startAcross;
        this.down = startDown;
        
        //convert tile coordinates into pixel coordinates
        this.xPos = this.across * tileSize;
        this.yPos = this.down * tileSize;

        //storing size and speed
        this.size = size;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;

        //Check rules/collisions for the tile the player wants to move to (target Tile)
        this.tileRules = tileRules;
        this.tileSize = tileSize;

        //some extra properties that we will use to control player movement below
        //what direction the player will travel in
        this.dirX = 0;
        this.dirY = 0;
        
        //the x/y position of the tile the player is moving to (the target)
        this.tx = this.xPos; //set these to the initial player pos
        this.ty = this.yPos;

        //Checking if player is in air
        this.isJumping = false;
        this.isFalling = false;
        this.isGrounded = true;
        this.collision = false;
        this.startJumpYPos = this.yPos;
        this.jumpTarget;

        //Setting Jump Distance in pixels
        this.jumpDistance = 120; //must be divisible by 10!

        //TRACK COLLISION PARAMETERS
        this.playerLeft;
        this.playerRight;
        this.playerTop;
        this.playerBottom;

        this.topLeft = { 
        }

        this.topRight = {

        }

        this.bottomLeft = {
        }
        this.bottomRight = {}
        

        this.collisionXPadding = 10;
        this.collisionYPadding = 5;
    }

    update() {
        this.trackCorners();
        this.setXDirection();
        this.hasPlayerReachedJumpHeight();
        this.collisions();
        this.move();

        this.display();
        this.debug();
    }

    trackCorners() {
        this.playerLeft = this.xPos + this.collisionXPadding;
        this.playerRight = this.xPos + this.tileSize - 1 - this.collisionXPadding;
        this.playerTop = this.yPos + this.collisionYPadding;
        this.playerBottom = this.yPos + this.tileSize - 1;

        this.topLeft = {
            x: this.playerLeft,
            y: this.playerTop
        }

        this.topRight = {
            x: this.playerRight,
            y: this.playerTop
        }

        this.bottomLeft = {
            x: this.playerLeft, 
            y: this.playerBottom
        }
        this.bottomRight = {
            x: this.playerRight, 
            y: this.playerBottom
        }
    }
    
    setXDirection() {
        if (keyIsDown("65")) {
            this.dirX = -1;
        }

        if (keyIsDown("68")) {
            this.dirX = 1;
        }

        if (!keyIsDown("65") && !keyIsDown("68")) {
            this.dirX = 0;
        }
    }

    hasPlayerReachedJumpHeight() {
        //Check if max height of jump reached
        if (this.yPos === this.jumpTarget) {
            //console.log("jump height reached");
            this.isFalling = true;
            this.isJumping = false;
        }
    }

    collisions() {
        this.setYDirection();
        //CHECK CURRENT VELOCITY
        let velX = this.dirX * this.xSpeed;
        let velY = this.dirY * this.ySpeed;

        //CHECK X AXIS
        if (this.checkCollisions(velX, 0)) {
            //console.log("collision on x axis");
            this.dirX = 0;
            velX = this.dirX * this.xSpeed;
        }

        //check for collisions on top
        if (this.isOverlappingCollisionTile(this.topLeft.x, this.topLeft.y + velY) ||
            this.isOverlappingCollisionTile(this.topRight.x, this.topRight.y + velY)) {
                //console.log("Collision above");
                this.isJumping = false;
                this.isfalling = true;
                
                this.setYDirection();
                velY = this.dirY * this.ySpeed;
        }

        
        if (this.isOverlappingGroundTile(this.bottomRight.x, this.bottomRight.y) ||
            this.isOverlappingGroundTile(this.bottomLeft.x, this.bottomLeft.y)) {
                //console.log("CORNERS COLLISION")
                this.yPos -= this.ySpeed;
        }
        
        

        //Get Coordinates of tiles below
        if (this.isOverlappingGroundTile(this.bottomLeft.x, this.bottomLeft.y + 1) ||
            this.isOverlappingGroundTile(this.bottomRight.x, this.bottomRight.y + 1)) {
                //console.log("Player is on the ground");
                this.isGrounded = true;
                this.isFalling = false;

                this.setYDirection();
                velY = this.dirY * this.ySpeed;
            } else {
                //console.log("Player is in the air");
                this.isGrounded = false;
                
    
                if (!this.isJumping) {
                    this.isFalling = true;
                }

                this.setYDirection();
                velY = this.dirY * this.ySpeed;
        }
        this.setYDirection();


        //DEBUG INFO
        
        //Prints Booleans
        //console.log("BEFORE Isgrounded =", this.isGrounded,"\n isJumping =", this.isJumping, "\n isFalling =", this.isFalling);
        
        //Prints Dir
        //console.log("BEFORE this.dirX", this.dirX, "this.dirY =", this.dirY);

        //draws collision targets
        //rect(this.topRight.x + velX, this.topRight.y + velY, 5)
        //rect(this.topLeft.x + velX, this.topRight.y + velY, 5)
        //rect(this.bottomRight.x + velX, this.bottomRight.y + velY, 5);
        //rect(this.bottomLeft.x + velX, this.bottomRight.y + velY, 5)

    }

    setYDirection() {
        if (this.isGrounded) {
            this.dirY = 0;
        }
        
        if (this.isJumping) {
            this.dirY = -1;
        }

        if (this.isFalling) {
            this.dirY = 1;
        }
    }

    checkCollisions(velX, velY) {
        if (this.isOverlappingCollisionTile(this.topLeft.x + velX, this.topLeft.y + velY) ||
            this.isOverlappingCollisionTile(this.bottomLeft.x + velX, this.bottomLeft.y + velY) ||
            this.isOverlappingCollisionTile(this.topRight.x + velX, this.topRight.y + velY) ||
            this.isOverlappingCollisionTile(this.bottomRight.x + velX, this.bottomRight.y + velY)) {
            //COLLISION ON X AXIS
            return true;
        } else {
            return false;
        }
    }

    isOverlappingCollisionTile(pointX, pointY) { //Used to check if there is ANYTHING THAT IS COLLIDABLE at the specified points
        let tileX = Math.floor(pointX / this.tileSize);
        let tileY = Math.floor(pointY / this.tileSize);

        return this.tileRules[tileY][tileX] != 0; //will return TRUE if the tileRules value is NOT 0 for this tile
    }

    isOverlappingGroundTile(pointX, pointY) { //Used to check if the point is intersecting with a GROUND tile (but will return false if either empty space of unwalkable)
        let tileX = Math.floor(pointX / this.tileSize);
        let tileY = Math.floor(pointY / this.tileSize);

        return this.tileRules[tileY][tileX] === 1; //will return TRUE if the tileRules value IS 1 for this tile
    }


    move() {
        this.xPos += this.xSpeed * this.dirX;
        this.yPos += this.ySpeed * this.dirY;
    }


    display() {
        imageMode(CORNER);
        image(this.sprite, this.xPos, this.yPos, this.size, this.size);
    }

    debug() {
        this.trackCorners();
        
        //COLLISION BOX
        stroke(255,0,0); // red top
        line(this.topLeft.x, this.topLeft.y, this.topRight.x, this.topRight.y);
        stroke(34,139,34); // green bottom
        line(this.bottomLeft.x, this.bottomLeft.y, this.bottomRight.x, this.bottomRight.y);
        stroke(0,0,255); // blue left
        line(this.topLeft.x, this.topLeft.y, this.bottomLeft.x, this.bottomLeft.y);
        stroke(255,192,203); // pink right
        line(this.topRight.x, this.topRight.y, this.bottomRight.x, this.bottomRight.y);
    }
}





class Tile {
  constructor(texture, across, down, tileSize, tileID) {
    this.texture = texture;
    this.across = across;
    this.down = down;

    this.xPos = this.across * tileSize;
    this.yPos = this.down * tileSize;

    this.tileSize = tileSize;
    this.tileID = tileID;
  }

  display() {
    noStroke();
    image(this.texture, this.xPos, this.yPos, this.tileSize, this.tileSize);
  }

  debug() {
    //TILE
    stroke(255, 0, 0);
    noFill();
    rect(this.xPos, this.yPos, this.tileSize, this.tileSize);

    //LABEL
    noStroke();
    fill(255, 0, 0);
    textAlign(LEFT, TOP);

    let twoDigitID;
    if (this.tileID < 10) { //if only one digit...
        twoDigitID = "0" + this.tileID; // adds a "0" to the front of single digit tileIDs to make it 2 digits
    } else {
        twoDigitID = this.tileID; // or just use the original ID.
    }
    
    text(twoDigitID, this.xPos, this.yPos);
  }
}
