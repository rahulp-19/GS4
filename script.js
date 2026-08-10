/**
 * APEX Performance Club - Interactive Features & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. HERO SLIDER LOGIC & ZOOM/SLIDE EFFECTS
    // ==========================================
    const slides = [
        {
            eyebrow: 'ELITE ATHLETICS',
            title: 'THE ART<br />OF POWER',
            category: 'STRENGTH & CONDITIONING',
            desc: 'Uncompromising training environments designed for peak physiological performance, pure biomechanical excellence, and unyielding discipline.'
        },
        {
            eyebrow: 'METABOLIC PRECISION',
            title: 'FORGED<br />IN IRON',
            category: 'POWERLIFTING & DENSITY',
            desc: 'Calibrated Eleiko plates, custom platforms, and progressive load periodization for lifters chasing structural strength and athletic durability.'
        },
        {
            eyebrow: 'FUNCTIONAL CAPACITY',
            title: 'ENDURANCE<br />ENGINE',
            category: 'HYROX & CONDITIONING',
            desc: 'High-intensity conditioning, sprint sleds, and aerobic threshold intervals to maximize VO2 max output and anaerobic grit.'
        },
        {
            eyebrow: 'OPTIMIZED RECOVERY',
            title: 'REDEFINE<br />LIMITS',
            category: 'CRYO & CONTRAST SPA',
            desc: 'Medical-grade cold plunge suites at 38°F, full-spectrum infrared saunas, and compression boots to accelerate tissue repair and recovery.'
        }
    ];

    const cards = [...document.querySelectorAll('.image-card')];
    const headline = document.querySelector('#headline');
    const eyebrow = document.querySelector('#eyebrow');
    const heroDesc = document.querySelector('#heroDesc');
    const category = document.querySelector('#category');
    const counter = document.querySelector('#counter');
    const prevButton = document.querySelector('#prevSlide');
    const nextButton = document.querySelector('#nextSlide');
    const slider = document.querySelector('#slider');

    let active = 0;
    let locked = false;
    let autoPlayInterval = null;

    function goToSlide(target) {
        if (locked || !cards.length) return;
        locked = true;
        
        const next = (target + slides.length) % slides.length;
        const currentCard = cards[active];
        const nextCard = cards[next];

        // Animate out current
        if (headline) headline.classList.add('is-swapping-out');
        if (currentCard) {
            currentCard.classList.add('is-exiting-left');
            currentCard.classList.remove('is-active');
        }

        setTimeout(() => {
            const slideData = slides[next];
            if (headline) headline.innerHTML = slideData.title;
            if (eyebrow) eyebrow.textContent = slideData.eyebrow;
            if (heroDesc) heroDesc.textContent = slideData.desc;
            if (category) category.textContent = slideData.category;
            if (counter) {
                counter.textContent = `${String(next + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
            }

            if (headline) {
                headline.classList.remove('is-swapping-out');
                headline.classList.add('is-swapping-in');
            }
            if (nextCard) {
                nextCard.classList.remove('is-exiting-left');
                nextCard.classList.add('is-active');
            }

            requestAnimationFrame(() => {
                if (headline) headline.classList.remove('is-swapping-in');
            });
        }, 400);

        setTimeout(() => {
            if (currentCard) currentCard.classList.remove('is-exiting-left');
            active = next;
            locked = false;
        }, 950);
    }

    function startAutoplay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            goToSlide(active + 1);
        }, 5500);
    }

    function restartAutoplay() {
        startAutoplay();
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            goToSlide(active + 1);
            restartAutoplay();
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            goToSlide(active - 1);
            restartAutoplay();
        });
    }

    // Touch swipe support on hero slider
    if (slider) {
        let touchStartX = 0;
        let touchStartY = 0;
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
            touchStartY = e.changedTouches[0].clientY;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            const deltaX = e.changedTouches[0].clientX - touchStartX;
            const deltaY = e.changedTouches[0].clientY - touchStartY;
            if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
                goToSlide(active + (deltaX < 0 ? 1 : -1));
                restartAutoplay();
            }
        }, { passive: true });
    }

    startAutoplay();

    // ==========================================
    // 2. SCROLL REVEAL (ZOOM IN & SIDE IN)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-zoom');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const delay = target.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    target.classList.add('is-active');
                }, parseInt(delay, 10));

                observer.unobserve(target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 3. NUMBER COUNTER ANIMATION FOR STATS
    // ==========================================
    const statCards = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                statCards.forEach(card => {
                    const target = parseInt(card.getAttribute('data-target'), 10);
                    const duration = 1800;
                    const startTime = performance.now();

                    function updateNumber(now) {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(easeOut * target);

                        card.textContent = current.toLocaleString();

                        if (progress < 1) {
                            requestAnimationFrame(updateNumber);
                        } else {
                            card.textContent = target.toLocaleString();
                        }
                    }

                    requestAnimationFrame(updateNumber);
                });
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('#stats');
    if (statsSection) statsObserver.observe(statsSection);

    // ==========================================
    // 4. STICKY NAVBAR & ACTIVE SECTION HIGHLIGHT
    // ==========================================
    const navbar = document.querySelector('#navbar');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section[id]');
    const backToTopBtn = document.querySelector('#backToTop');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar blur on scroll
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 600) {
            backToTopBtn.classList.add('is-visible');
        } else {
            backToTopBtn.classList.remove('is-visible');
        }

        // Active nav tracking
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navItems.forEach(item => {
                item.classList.remove('is-active');
                if (item.getAttribute('href') === `#${currentSectionId}`) {
                    item.classList.add('is-active');
                }
            });
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // 5. MOBILE MENU TOGGLE & TOUCH ENHANCEMENTS
    // ==========================================
    const mobileMenuBtn = document.querySelector('#mobileMenuBtn');
    const navMenu = document.querySelector('#navMenu');

    function toggleMobileMenu(forceClose = false) {
        if (!mobileMenuBtn || !navMenu) return;
        const isOpen = forceClose ? false : !navMenu.classList.contains('is-open');
        
        navMenu.classList.toggle('is-open', isOpen);
        mobileMenuBtn.classList.toggle('is-active', isOpen);
        mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        
        if (window.innerWidth <= 768) {
            document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        }
    }

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });

        // Close when clicking nav link or mobile cta
        navMenu.querySelectorAll('.nav-item, .nav-mobile-cta').forEach(link => {
            link.addEventListener('click', () => {
                toggleMobileMenu(true);
            });
        });

        // Close when clicking outside navbar
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('is-open') && !navbar.contains(e.target)) {
                toggleMobileMenu(true);
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
                toggleMobileMenu(true);
            }
        });

        // Reset on resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navMenu.classList.contains('is-open')) {
                toggleMobileMenu(true);
            }
        });
    }

    // ==========================================
    // 6. FITNESS & BIOMETRIC CALCULATOR
    // ==========================================
    const computeBtn = document.querySelector('#computeStatsBtn');
    if (computeBtn) {
        computeBtn.addEventListener('click', () => {
            const age = parseFloat(document.querySelector('#calcAge').value) || 28;
            const gender = document.querySelector('#calcGender').value;
            const weight = parseFloat(document.querySelector('#calcWeight').value) || 78;
            const height = parseFloat(document.querySelector('#calcHeight').value) || 180;
            const goal = document.querySelector('#calcGoal').value;
            const activity = parseFloat(document.querySelector('#calcActivity').value) || 1.55;

            // Mifflin-St Jeor Formula
            let bmr = (10 * weight) + (6.25 * height) - (5 * age);
            bmr = (gender === 'male') ? bmr + 5 : bmr - 161;

            let tdee = bmr * activity;
            let targetCalories = tdee;
            let proteinGrams = Math.round(weight * 2.2); // ~2.2g per kg for athletes
            let titleText = 'Balanced Conditioning';
            let splitText = '4-Day Split with alternating Hypertrophy and Zone-2 conditioning.';

            if (goal === 'cut') {
                targetCalories = Math.round(tdee - 450);
                proteinGrams = Math.round(weight * 2.4);
                titleText = 'Deficit & High-Protein Shred';
                splitText = '<strong>3-Day Heavy Resistance + 2-Day HYROX Conditioning</strong> with contrast sauna recovery.';
            } else if (goal === 'bulk') {
                targetCalories = Math.round(tdee + 350);
                proteinGrams = Math.round(weight * 2.2);
                titleText = 'Lean Hypertrophy & Power';
                splitText = '<strong>4-Day Mechanical Tension Hypertrophy + 1-Day Olympic Platform</strong> with hyperbaric recovery.';
            } else {
                targetCalories = Math.round(tdee);
                proteinGrams = Math.round(weight * 2.0);
                titleText = 'Athletic Recomposition & Stamina';
                splitText = '<strong>4-Day Functional Athlete Protocol</strong> balancing heavy compounds and sprint sled intervals.';
            }

            const bmi = (weight / ((height / 100) * (height / 100))).toFixed(1);

            // Animate values
            document.querySelector('#calResult').textContent = targetCalories.toLocaleString();
            document.querySelector('#proteinResult').textContent = `${proteinGrams}g`;
            document.querySelector('#bmiResult').textContent = bmi;
            document.querySelector('#planTitle').textContent = titleText;
            document.querySelector('#splitRecommendation').innerHTML = splitText;

            showToast('Biometrics updated successfully!');
        });
    }

    // ==========================================
    // 7. FAQ ACCORDION
    // ==========================================
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isOpen = item.classList.contains('is-open');

            // Close all
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                otherItem.classList.remove('is-open');
            });

            // Toggle selected
            if (!isOpen) {
                item.classList.add('is-open');
            }
        });
    });

    // ==========================================
    // 8. MODAL & VIP PASS FORM ACTIONS
    // ==========================================
    const vipModal = document.querySelector('#vipModal');
    const openPassBtns = document.querySelectorAll('.open-pass-trigger, #openPassModalBtn');
    const closeModalBtn = document.querySelector('#closeModalBtn');
    const modalForm = document.querySelector('#modalVipForm');
    const contactForm = document.querySelector('#vipPassForm');
    const toast = document.querySelector('#toast');
    const toastMsg = document.querySelector('#toastMsg');

    function openModal() {
        if (vipModal) {
            vipModal.classList.add('is-active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (vipModal) {
            vipModal.classList.remove('is-active');
            document.body.style.overflow = 'auto';
        }
    }

    openPassBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (vipModal) {
        vipModal.addEventListener('click', (e) => {
            if (e.target === vipModal) closeModal();
        });
    }

    function showToast(message) {
        if (toast && toastMsg) {
            toastMsg.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 4000);
        }
    }

    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            closeModal();
            modalForm.reset();
            showToast('VIP Pass generated! Concierge confirmation has been sent to your email.');
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            contactForm.reset();
            showToast('VIP Pass Request received! Our concierge team will contact you shortly.');
        });
    }
});
