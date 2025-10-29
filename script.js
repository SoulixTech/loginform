// Three.js 3D Background Animation
let scene, camera, renderer, particles;

function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;
    
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create particle system
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const color1 = new THREE.Color(0x00ff88);
    const color2 = new THREE.Color(0x00d4ff);
    const color3 = new THREE.Color(0xff00ff);
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        
        const colorChoice = Math.random();
        const mixedColor = colorChoice < 0.33 ? color1 : 
                          colorChoice < 0.66 ? color2 : color3;
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
        
        sizes[i] = Math.random() * 3 + 1;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    // Add ambient light effect
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Create floating geometric shapes
    createFloatingShapes();
    
    animate();
}

function createFloatingShapes() {
    // Create torus (coding ring)
    const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(-30, 20, -20);
    scene.add(torus);
    torus.userData = { rotationSpeed: 0.01, floatSpeed: 0.02, originalY: 20 };
    
    // Create icosahedron (data structure)
    const icoGeometry = new THREE.IcosahedronGeometry(8, 0);
    const icoMaterial = new THREE.MeshStandardMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    icosahedron.position.set(30, -20, -20);
    scene.add(icosahedron);
    icosahedron.userData = { rotationSpeed: 0.015, floatSpeed: 0.025, originalY: -20 };
    
    // Create octahedron (algorithm)
    const octaGeometry = new THREE.OctahedronGeometry(8);
    const octaMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    const octahedron = new THREE.Mesh(octaGeometry, octaMaterial);
    octahedron.position.set(0, 30, -30);
    scene.add(octahedron);
    octahedron.userData = { rotationSpeed: 0.012, floatSpeed: 0.018, originalY: 30 };
    
    // Add a cube (framework)
    const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
    const cubeMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        transparent: true,
        opacity: 0.2,
        wireframe: true
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-25, -25, -25);
    scene.add(cube);
    cube.userData = { rotationSpeed: 0.008, floatSpeed: 0.015, originalY: -25 };
}

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particle system
    if (particles) {
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.001;
        
        // Update particle positions for wave effect
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin((positions[i] + Date.now() * 0.001)) * 0.01;
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }
    
    // Animate floating shapes
    scene.children.forEach((child) => {
        if (child.userData.rotationSpeed) {
            child.rotation.x += child.userData.rotationSpeed;
            child.rotation.y += child.userData.rotationSpeed * 0.5;
            child.position.y = child.userData.originalY + Math.sin(Date.now() * 0.001 * child.userData.floatSpeed) * 5;
        }
    });
    
    // Camera follows mouse
    camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 10 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Form interactions
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    
    const form = document.getElementById('contactForm');
    const formContainer = document.querySelector('.form-container');
    const successMessage = document.getElementById('successMessage');
    
    // Add interactive tilt effect
    formContainer.addEventListener('mousemove', (e) => {
        const rect = formContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        formContainer.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    formContainer.addEventListener('mouseleave', () => {
        formContainer.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
    
    // Input animations
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            const label = this.closest('.form-group').querySelector('.code-comment');
            if (label) {
                label.style.color = '#00ff88';
            }
            createParticleEffect(this);
        });
        
        input.addEventListener('blur', function() {
            const label = this.closest('.form-group').querySelector('.code-comment');
            if (label) {
                label.style.color = '#8892b0';
            }
        });
        
        // Add input validation feedback
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.style.borderColor = '#00ff88';
            } else {
                this.style.borderColor = 'rgba(0, 255, 136, 0.2)';
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.classList.add('loading');
        submitBtn.querySelector('.btn-text').textContent = '// Processing...';
        
        // Create typing effect for console.log
        createTypingEffect();
        
        // Create confetti effect
        createConfetti();
        
        // Simulate form submission
        setTimeout(() => {
            form.style.opacity = '0';
            form.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                form.style.display = 'none';
                successMessage.classList.add('show');
                
                // Reset form after showing success message
                setTimeout(() => {
                    successMessage.classList.remove('show');
                    setTimeout(() => {
                        form.reset();
                        form.style.display = 'block';
                        form.style.opacity = '1';
                        form.style.transform = 'scale(1)';
                        submitBtn.classList.remove('loading');
                        submitBtn.querySelector('.btn-text').textContent = 'function submitApplication()';
                    }, 500);
                }, 4000);
            }, 500);
        }, 2000);
    });
});

// Create typing effect animation
function createTypingEffect() {
    const consoleDiv = document.createElement('div');
    consoleDiv.style.position = 'fixed';
    consoleDiv.style.bottom = '20px';
    consoleDiv.style.right = '20px';
    consoleDiv.style.background = 'rgba(18, 18, 30, 0.95)';
    consoleDiv.style.padding = '15px 20px';
    consoleDiv.style.borderRadius = '10px';
    consoleDiv.style.fontFamily = "'Fira Code', monospace";
    consoleDiv.style.color = '#00ff88';
    consoleDiv.style.fontSize = '14px';
    consoleDiv.style.zIndex = '10000';
    consoleDiv.style.border = '1px solid rgba(0, 255, 136, 0.3)';
    consoleDiv.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
    
    document.body.appendChild(consoleDiv);
    
    const text = '> Submitting application... ✓';
    let index = 0;
    
    const typeInterval = setInterval(() => {
        if (index < text.length) {
            consoleDiv.textContent += text[index];
            index++;
        } else {
            clearInterval(typeInterval);
            setTimeout(() => {
                consoleDiv.style.opacity = '0';
                consoleDiv.style.transform = 'translateY(20px)';
                setTimeout(() => consoleDiv.remove(), 300);
            }, 2000);
        }
    }, 50);
}

// Create particle effect on input focus
function createParticleEffect(element) {
    const rect = element.getBoundingClientRect();
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = rect.left + rect.width / 2 + 'px';
        particle.style.top = rect.top + rect.height / 2 + 'px';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.borderRadius = '50%';
        particle.style.background = `linear-gradient(135deg, #00ff88, #00d4ff)`;
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.opacity = '1';
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 2 + Math.random() * 2;
        const distance = 50 + Math.random() * 30;
        
        const targetX = rect.left + rect.width / 2 + Math.cos(angle) * distance;
        const targetY = rect.top + rect.height / 2 + Math.sin(angle) * distance;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${targetX - (rect.left + rect.width / 2)}px, ${targetY - (rect.top + rect.height / 2)}px) scale(0)`, opacity: 0 }
        ], {
            duration: 600 + Math.random() * 400,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        }).onfinish = () => particle.remove();
    }
}

// Create confetti effect
function createConfetti() {
    const colors = ['#00ff88', '#00d4ff', '#ff00ff', '#00ffff'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = '50%';
        confetti.style.top = '50%';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        
        document.body.appendChild(confetti);
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 200 + Math.random() * 300;
        const targetX = Math.cos(angle) * velocity;
        const targetY = Math.sin(angle) * velocity - 200;
        
        confetti.animate([
            { 
                transform: 'translate(0, 0) rotate(0deg)', 
                opacity: 1 
            },
            { 
                transform: `translate(${targetX}px, ${targetY}px) rotate(${Math.random() * 720}deg)`, 
                opacity: 0 
            }
        ], {
            duration: 1000 + Math.random() * 1000,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        }).onfinish = () => confetti.remove();
    }
}
