class Icarus {
    constructor($canvas, x, y, ctx, image) {
        this.$canvas = $canvas;
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.image = image;
    }
    draw(xPositionNose, speed, gameNumber) {
        this.x = xPositionNose;

        if(gameNumber == 2) {
             this.y -= (speed*2);
        } else if(gameNumber == 3) {
            this.y = 550;
        }
    
        this.ctx.drawImage(this.image, this.x, this.y, 100, 50);
    }
}

export default Icarus;
