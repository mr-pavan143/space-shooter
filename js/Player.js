import { Laser } from './Laser.js';

export class Player {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.width = 40;
        this.height = 40;
        this.x = canvasWidth / 2 - this.width / 2;
        this.y = canvasHeight - 70;
        this.speed = 5;
        this.lasers = [];
        this.shootCooldown = 0;
    }

    update(inputHandler) {
        // Move Left / Right
        if (inputHandler.isPressed('ArrowLeft') && this.x > 0) this.x -= this.speed;
        if (inputHandler.isPressed('ArrowRight') && this.x < this.canvasWidth - this.width) this.x += this.speed;
        
        // Move Up / Down
        if (inputHandler.isPressed('ArrowUp') && this.y > 0) this.y -= this.speed;
        if (inputHandler.isPressed('ArrowDown') && this.y < this.canvasHeight - this.height) this.y += this.speed;

        // Manage Shooting
        if (this.shootCooldown > 0) this.shootCooldown--;
        if (inputHandler.isPressed(' ') && this.shootCooldown === 0) {
            this.lasers.push(new Laser(this.x + this.width / 2 - 2, this.y));
            this.shootCooldown = 15; // Frames between shots
        }

        // Clean up out-of-bounds lasers
        this.lasers.forEach(laser => laser.update());
        this.lasers = this.lasers.filter(laser => !laser.markedForDeletion);
    }

    draw(ctx) {
        // Draw Lasers first
        this.lasers.forEach(laser => laser.draw(ctx));

        // Draw Player Ship (Neon Cyan Triangle)
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();
    }
}
