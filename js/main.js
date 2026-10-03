import { InputHandler } from './InputHandler.js';
import { Player } from './Player.js';
import { Enemy } from './Enemy.js';

window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    
    let enemies = [];
    let enemyTimer = 0;
    let enemyInterval = 60; // Spawn an enemy every 60 frames
    let score = 0;
    let gameOver = false;

    // Helper for collision calculation
    function checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    function gameLoop() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update Game Objects
        player.update(input);
        
        // Spawn Enemy Logic
        enemyTimer++;
        if (enemyTimer > enemyInterval) {
            enemies.push(new Enemy(canvas.width));
            enemyTimer = 0;
        }

        enemies.forEach(enemy => enemy.update(canvas.height));

        // Physics: Check Laser vs Enemy Collisions
        player.lasers.forEach(laser => {
            enemies.forEach(enemy => {
                if (checkCollision(laser, enemy)) {
                    laser.markedForDeletion = true;
                    enemy.markedForDeletion = true;
                    score += 10;
                }
            });
        });

        // Physics: Check Enemy vs Player Collision (Game Over criteria)
        enemies.forEach(enemy => {
            if (checkCollision(player, enemy)) {
                gameOver = true;
            }
        });

        // Filter out dead objects
        enemies = enemies.filter(enemy => !enemy.markedForDeletion);

        // Render Objects
        player.draw(ctx);
        enemies.forEach(enemy => enemy.draw(ctx));

        // Render HUD Info
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 20, 30);

        if (!gameOver) {
            requestAnimationFrame(gameLoop);
        } else {
            // Draw Game Over Screen
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#ff0055';
            ctx.font = '50px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '20px Arial';
            ctx.fillText('Refresh page to play again', canvas.width / 2, canvas.height / 2 + 50);
        }
    }

    // Fire up the loop
    gameLoop();
});
