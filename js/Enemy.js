export class Enemy {
    constructor(canvasWidth) {
        this.width = 30;
        this.height = 30;
        this.x = Math.random() * (canvasWidth - this.width);
        this.y = -this.height;
        this.speed = Math.random() * 2 + 1;
        this.markedForDeletion = false;
    }

    update(canvasHeight) {
        this.y += this.speed;
        if (this.y > canvasHeight) {
            this.markedForDeletion = true;
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
