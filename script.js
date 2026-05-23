document.addEventListener('DOMContentLoaded', () => {
    // 1. Menu Burger Logic (iOS Slide Over style)
    const burgerBtn = document.getElementById('burger-btn');
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    function toggleMenu() {
        const isActive = sideMenu.classList.contains('active');
        if (isActive) {
            sideMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
        } else {
            sideMenu.classList.add('active');
            menuOverlay.classList.add('active');
        }
    }

    if(burgerBtn) burgerBtn.addEventListener('click', toggleMenu);
    if(menuOverlay) menuOverlay.addEventListener('click', toggleMenu);

    // 2. Intersection Observer for Advanced Fade-Up Animations inside Mobile Frame
    const mainScroll = document.getElementById('main-scroll');
    const observerOptions = {
        root: mainScroll, // Watch intersection inside the scrollable wrapper
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let delay = 0;
                const siblings = Array.from(document.querySelectorAll('.fade-up:not(.visible)'));
                const index = siblings.indexOf(entry.target);
                
                if (index > 0 && index < 4) {
                    delay = index * 0.1;
                }
                
                entry.target.style.transitionDelay = `${delay}s`;
                entry.target.classList.add('visible');
                
                setTimeout(() => {
                    entry.target.style.transitionDelay = '0s';
                }, 800 + (delay * 1000));
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-up');
    animatedElements.forEach(el => observer.observe(el));

    // 3. Touch / Hover Active State Simulation (Apple bouncy feel)
    // To mimic an iPhone exactly, we use touchstart/touchend, fallback to mousedown/mouseup on desktop
    const touchables = document.querySelectorAll('.ios-touchable');
    
    touchables.forEach(el => {
        const activate = () => el.classList.add('is-active');
        const deactivate = () => {
            setTimeout(() => {
                el.classList.remove('is-active');
            }, 50); // slight delay to ensure visual feedback
        };
        
        el.addEventListener('touchstart', activate, {passive: true});
        el.addEventListener('touchend', deactivate);
        el.addEventListener('touchcancel', deactivate);
        
        // Mouse fallbacks for desktop simulator
        el.addEventListener('mousedown', activate);
        el.addEventListener('mouseup', deactivate);
        el.addEventListener('mouseleave', deactivate);
    });

    // Bottom Navigation Logic
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            if (item.classList.contains('active')) return; 

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            const icon = item.querySelector('svg, img');
            if(icon) {
                icon.style.transform = 'scale(0.8)';
                icon.style.transition = 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)';
                
                setTimeout(() => {
                    icon.style.transform = 'scale(1.15)';
                    icon.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'; 
                    
                    setTimeout(() => {
                        icon.style.transform = 'scale(1)';
                    }, 300);
                }, 150);
            }
        });
    });

    // 4. Horizontal scroll logic (Momentum simulation for desktop/mouse)
    const carousel = document.querySelector('.carousel-container');
    let isDown = false;
    let startX;
    let scrollLeft;

    if (carousel) {
        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            carousel.style.cursor = 'grabbing';
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });
        carousel.addEventListener('mouseleave', () => {
            isDown = false;
            carousel.style.cursor = 'pointer';
        });
        carousel.addEventListener('mouseup', () => {
            isDown = false;
            carousel.style.cursor = 'pointer';
        });
        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2; 
            carousel.scrollLeft = scrollLeft - walk;
        });
    }

    // 5. Scroll Header Shadow Effect inside Mobile Frame
    const header = document.querySelector('.main-header');
    if(mainScroll) {
        mainScroll.addEventListener('scroll', () => {
            if (mainScroll.scrollTop > 10) {
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                header.style.background = 'rgba(255, 255, 255, 0.85)';
            } else {
                header.style.boxShadow = 'none';
                header.style.background = 'rgba(255, 255, 255, 0.7)';
            }
        });
    }
});
