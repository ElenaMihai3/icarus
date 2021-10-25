class Platform {
    constructor(i, x, y, ctx, image, game) {
        this.bottom = y;
        this.left = x;
        this.i = i;
        this.velocity = 2;
        this.color = `#ff0000`;
        this.x = x;
        this.y = y;
        this.image = image;
        
        if (game == "game3") {
            this.width = 100;
            this.height = 100;
        } if (game == "game1") {
            this.width = 50;
            this.height = 100;
        }
    
        this.ctx = ctx;

    }
    draw(speedPlatforms) {
        this.y += speedPlatforms;
        
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

export default Platform;
