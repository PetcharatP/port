// Advanced Matrix Portfolio JavaScript Effects
class MatrixEffects {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.chars = "01";
        this.charArray = this.chars.split("");
        this.fontSize = 10;
        this.columns = 0;
        this.drops = [];
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        this.createCanvas();
        this.setupMatrix();
        this.startAnimation();
        this.addEventListeners();
    }

    createCanvas() {
        // Create matrix canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'matrix-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.opacity = '0.3';
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = [];
        
        // Reset drops
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.floor(Math.random() * this.canvas.height / this.fontSize);
        }
    }

    setupMatrix() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawMatrix() {
        // Semi-transparent black background for trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Matrix green text
        this.ctx.fillStyle = '#00ff41';
        this.ctx.font = `${this.fontSize}px 'Share Tech Mono', monospace`;
        
        for (let i = 0; i < this.drops.length; i++) {
            // Get random character
            const char = this.charArray[Math.floor(Math.random() * this.charArray.length)];
            
            // Draw character
            this.ctx.fillText(char, i * this.fontSize, this.drops[i] * this.fontSize);
            
            // Reset drop randomly or when it reaches bottom
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            
            // Move drop down
            this.drops[i]++;
        }
    }

    startAnimation() {
        const animate = () => {
            this.drawMatrix();
            requestAnimationFrame(animate);
        };
        animate();
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }
}

// Terminal Text Effects
class TerminalEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupTypedEffect();
        this.setupTerminalCommands();
        this.setupGlitchEffects();
    }

    setupTypedEffect() {
        if (typeof Typed !== 'undefined' && document.getElementById('typed-text')) {
            new Typed('#typed-text', {
                strings: [
                    'CYBERSECURITY_SPECIALIST.exe',
                    'DIGITAL_FORENSICS_EXPERT.py', 
                    'PENETRATION_TESTER.sh',
                    'SOC_ANALYST.exe',
                    'THREAT_HUNTER.py',
                    'SECURITY_RESEARCHER.js',
                    'MALWARE_ANALYST.exe',
                    'INCIDENT_RESPONDER.py'
                ],
                typeSpeed: 80,
                backSpeed: 40,
                backDelay: 1500,
                loop: true,
                showCursor: true,
                cursorChar: '_'
            });
        }
    }

    setupTerminalCommands() {
        // Add blinking cursor to terminal titles
        document.querySelectorAll('.terminal-title').forEach(title => {
            if (!title.textContent.includes('$')) {
                title.textContent += ' $';
            }
        });

        // Simulate typing in terminal headers
        this.typeTerminalCommands();
    }

    typeTerminalCommands() {
        const commands = [
            'ls -la /home/reventhan/skills/',
            'cat /etc/passwd | grep cyber',
            'netstat -tulpn | grep :443',
            'ps aux | grep security',
            'tail -f /var/log/auth.log'
        ];

        document.querySelectorAll('.terminal-title').forEach((title, index) => {
            if (commands[index]) {
                setTimeout(() => {
                    this.typeText(title, commands[index] + ' $', 100);
                }, index * 2000);
            }
        });
    }

    typeText(element, text, speed = 100) {
        element.textContent = '';
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    setupGlitchEffects() {
        // Add glitch effect to terminal windows on hover
        document.querySelectorAll('.terminal-window').forEach(terminal => {
            terminal.addEventListener('mouseenter', () => {
                this.glitchEffect(terminal);
            });
        });
    }

    glitchEffect(element) {
        const originalTransform = element.style.transform;
        const glitchFrames = [
            'translateX(2px)',
            'translateX(-2px)', 
            'translateX(3px)',
            'translateX(-1px)',
            'translateX(1px)',
            'translateX(0px)'
        ];

        let frame = 0;
        const glitchInterval = setInterval(() => {
            if (frame < glitchFrames.length) {
                element.style.transform = glitchFrames[frame];
                frame++;
            } else {
                element.style.transform = originalTransform;
                clearInterval(glitchInterval);
            }
        }, 50);
    }
}

// Console ASCII Art and Messages
class ConsoleEffects {
    constructor() {
        this.displayASCII();
        this.displayMessages();
    }

    displayASCII() {
        const asciiArt = `
    ██████╗ ███████╗██╗   ██╗███████╗███╗   ██╗████████╗██╗  ██╗ █████╗ ███╗   ██╗
    ██╔══██╗██╔════╝██║   ██║██╔════╝████╗  ██║╚══██╔══╝██║  ██║██╔══██╗████╗  ██║
    ██████╔╝█████╗  ██║   ██║█████╗  ██╔██╗ ██║   ██║   ███████║███████║██╔██╗ ██║
    ██╔══██╗██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║╚██╗██║   ██║   ██╔══██║██╔══██║██║╚██╗██║
    ██║  ██║███████╗ ╚████╔╝ ███████╗██║ ╚████║   ██║   ██║  ██║██║  ██║██║ ╚████║
    ╚═╝  ╚═╝╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝
    `;

        console.log('%c' + asciiArt, 'color: #00ff41; font-family: monospace; font-size: 10px;');
    }

    displayMessages() {
        const messages = [
            { text: '> SYSTEM INITIALIZED', color: '#00ff41' },
            { text: '> LOADING REVENTHAN.EXE...', color: '#00d4ff' },
            { text: '> CYBERSECURITY PROTOCOLS ACTIVE', color: '#65ff00' },
            { text: '> MATRIX CONNECTION ESTABLISHED', color: '#ff0080' },
            { text: '> THE MATRIX HAS YOU...', color: '#ffaa00' },
            { text: '> WELCOME TO THE REAL WORLD', color: '#00ff41' }
        ];

        messages.forEach((msg, index) => {
            setTimeout(() => {
                console.log(`%c${msg.text}`, `color: ${msg.color}; font-family: monospace; font-size: 14px; font-weight: bold;`);
            }, index * 1000);
        });
    }
}

// Interactive Elements
class InteractiveEffects {
    constructor() {
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupButtonEffects();
        this.setupImageEffects();
        this.setupParallaxEffect();
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupMobileMenu() {
        const toggleBtn = document.querySelector('.togglebtn');
        const nav = document.querySelector('nav ul');

        if (toggleBtn && nav) {
            toggleBtn.addEventListener('click', () => {
                nav.classList.toggle('active');
                this.animateToggleButton(toggleBtn);
            });
        }
    }

    animateToggleButton(btn) {
        btn.classList.toggle('active');
        // Add rotation animation to toggle button spans
        const spans = btn.querySelectorAll('span');
        spans.forEach((span, index) => {
            span.style.transition = 'all 0.3s ease';
            if (btn.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
    }

    setupButtonEffects() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                this.createButtonRipple(btn);
            });
        });
    }

    createButtonRipple(button) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.marginLeft = '-10px';
        ripple.style.marginTop = '-10px';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    setupImageEffects() {
        const profileImg = document.querySelector('.hero-img img');
        if (profileImg) {
            profileImg.addEventListener('mouseenter', () => {
                profileImg.style.filter = 'brightness(1.2) contrast(1.1)';
            });
            
            profileImg.addEventListener('mouseleave', () => {
                profileImg.style.filter = 'none';
            });
        }
    }

    setupParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.matrix-bg');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
}

// Particles System
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.init();
    }

    init() {
        this.createParticleCanvas();
        this.createParticles();
        this.animate();
    }

    createParticleCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-3';
        this.canvas.style.pointerEvents = 'none';
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 255, 65, ${particle.opacity})`;
            this.ctx.fill();
            
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all effects
    new MatrixEffects();
    new TerminalEffects();
    new ConsoleEffects();
    new InteractiveEffects();
    new ParticleSystem();
    
    // Add ripple animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MatrixEffects,
        TerminalEffects,
        ConsoleEffects,
        InteractiveEffects,
        ParticleSystem
    };
}
