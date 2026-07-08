/**
 * Echo Messenger - Decentralized Network Mesh Background
 * High-performance 2D HTML5 Canvas particle system.
 */

(function() {
    const canvas = document.createElement('canvas');
    canvas.id = 'network-canvas';
    
    // Inline canvas styling for absolute background layering
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-2';
    canvas.style.pointerEvents = 'none';
    canvas.style.backgroundColor = '#030303';
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = [];
    // Adjust density based on screen size
    const maxParticles = Math.min(Math.floor((width * height) / 15000), 80); 
    const connectionDist = 120;
    const mouse = { x: null, y: null, radius: 150 };

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Slow, organic drifting movement
            this.vx = (Math.random() - 0.5) * 0.4; 
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 1.5 + 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off canvas boundaries
            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(16, 185, 129, 0.4)'; // Subtle emerald particle
            ctx.fill();
        }
    }

    // Initialize particles
    function init() {
        particles.length = 0;
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }
    }

    // Core Animation loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Update & Draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.update();
            p.draw();
        }

        // Draw connections (P2P mesh grid)
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            
            // Draw connections between surrounding nodes
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist) {
                    const alpha = (1 - (dist / connectionDist)) * 0.12;
                    ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }

            // Draw connection to cursor (Desktop viewports only)
            if (width >= 768 && mouse.x !== null && mouse.y !== null) {
                const dx = p1.x - mouse.x;
                const dy = p1.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    const alpha = (1 - (dist / mouse.radius)) * 0.15;
                    ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    // Pointer event listeners (Desktop only)
    if (width >= 768) {
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });
    }

    // Resize event debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            init();
        }, 150);
    });

    // Run
    init();
    animate();
})();
