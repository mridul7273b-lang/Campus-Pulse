/**
 * AIT PUNE — ON CAMPUS
 * High-Performance Interactive Experience & Scroll Engine
 */

document.addEventListener('DOMContentLoaded', () => {

  // Custom cursor completely removed
  const customCursorEl = document.getElementById('custom-cursor');
  if (customCursorEl) customCursorEl.remove();

  // ==========================================================================
  // 2. Scroll Progress Bar & Dynamic Percentage Rail Readout (RAF-Throttled)
  // ==========================================================================
  const progressLine = document.getElementById('scroll-progress-line');
  const scrollPercentageText = document.getElementById('scroll-percentage-text');
  const heroLensImg = document.getElementById('hero-optic-img');
  const specimenImg = document.getElementById('specimen-img');
  const archCoverImg = document.getElementById('arch-cover-img');
  const campusTitle = document.getElementById('hero-campus-title');
  const pulseTitle = document.getElementById('hero-pulse-title');
  const scrollToTopHud = document.getElementById('scroll-to-top-hud');
  const leftRailTicks = document.querySelectorAll('.margin-left .rail-ticks span');
  const rightRailTicks = document.querySelectorAll('.margin-right .rail-ticks span');

  let isScrollTicking = false;

  const onScrollUpdate = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;
    const percentInt = Math.floor(progress * 100);

    // Update Progress line
    if (progressLine) {
      progressLine.style.width = `${progress * 100}%`;
    }

    // Update Right Rail Percentage Readout
    if (scrollPercentageText) {
      scrollPercentageText.textContent = `${percentInt < 10 ? '0' + percentInt : percentInt}%`;
    }

    // Dynamic Lateral Margin Rail Tick Illumination
    const activeTickIdx = Math.min(Math.floor(progress * 5), 4);
    leftRailTicks.forEach((t, i) => t.classList.toggle('active', i <= activeTickIdx));
    rightRailTicks.forEach((t, i) => t.classList.toggle('active', i <= activeTickIdx));

    // Floating Clean Scroll-to-Top HUD Button Toggle
    if (scrollToTopHud) {
      if (scrollY > 420) {
        scrollToTopHud.classList.add('visible');
      } else {
        scrollToTopHud.classList.remove('visible');
      }
    }

    // Heading Word Drift & Dynamic Slant Parallax
    if (scrollY < window.innerHeight * 1.3) {
      if (campusTitle) {
        const campusShift = scrollY * -0.045;
        campusTitle.style.transform = `translate3d(${campusShift}px, 0, 0)`;
      }
      if (pulseTitle) {
        const pulseShift = scrollY * 0.065;
        const pulseTilt = -3.5 - (scrollY * 0.005);
        const pulseSkew = -7 - (scrollY * 0.004);
        pulseTitle.style.transform = `translate3d(${pulseShift}px, ${scrollY * -0.015}px, 0) rotate(${pulseTilt}deg) skewX(${pulseSkew}deg)`;
      }
    }

    // Hero optic image subtle GPU parallax
    if (heroLensImg && scrollY < window.innerHeight) {
      heroLensImg.style.transform = `translate3d(0, ${scrollY * 0.08}px, 0) scale(${1 + scrollY * 0.0001})`;
    }
    if (specimenImg) {
      const rect = specimenImg.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (rect.top - window.innerHeight / 2) * 0.04;
        specimenImg.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    }
    if (archCoverImg) {
      const rect = archCoverImg.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (rect.top - window.innerHeight / 2) * 0.05;
        archCoverImg.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    }

    isScrollTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (!isScrollTicking) {
      window.requestAnimationFrame(onScrollUpdate);
      isScrollTicking = true;
    }
  }, { passive: true });

  onScrollUpdate();

  // ==========================================================================
  // 4. Header Scrolled State
  // ==========================================================================
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // ==========================================================================
  // 5. Modern Scroll Reveal Transitions (IntersectionObserver)
  // ==========================================================================
  const revealSelectors = [
    '.reveal-on-scroll',
    '.service-item',
    '.editorial-statement-column',
    '.optical-specimen-card',
    '.branch-gateway-card',
    '.pulse-tab-trigger',
    '.pulse-card',
    '.facility-card-hotspot',
    '.pulse-product-card',
    '.pulse-club-card',
    '.pulse-senior-card',
    '.stat-cell-widget',
    '.section-header-block',
    '.faq-consensus-box',
    '.about-left-text',
    '.about-right-specs'
  ];

  const revealElements = document.querySelectorAll(revealSelectors.join(', '));
  revealElements.forEach(el => {
    el.classList.add('reveal-on-scroll');
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================================================
  // 6. Interactive Card Dynamic Spotlight Coordinates
  // ==========================================================================
  const spotlightCards = document.querySelectorAll('.dept-card, .research-focus-card, .club-block, .arch-feature-cell');
  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ==========================================================================
  // 7. Parallax Depth on Hero Stage & 3D Tilt on Specimen Card
  // ==========================================================================
  const heroStage = document.querySelector('.hero-stage');
  const specimenCard = document.getElementById('specimen-card');

  if (heroStage && heroLensImg) {
    heroStage.addEventListener('mousemove', (e) => {
      const rect = heroStage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroLensImg.style.transform = `scale(1.02) translate(${x * 12}px, ${y * 12}px)`;
    });
    heroStage.addEventListener('mouseleave', () => {
      heroLensImg.style.transform = 'scale(1) translate(0px, 0px)';
    });
  }

  if (specimenCard) {
    specimenCard.addEventListener('mousemove', (e) => {
      const rect = specimenCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      specimenCard.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });
    specimenCard.addEventListener('mouseleave', () => {
      specimenCard.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0px)';
    });
  }

  // ==========================================================================
  // 8. Live Indian Standard Time (IST) Clock
  // ==========================================================================
  const liveClockEl = document.getElementById('f-live-clock');
  const updateISTClock = () => {
    if (!liveClockEl) return;
    const now = new Date();
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const timeStr = now.toLocaleTimeString('en-US', options);
    liveClockEl.textContent = `PUNE, INDIA: ${timeStr} IST`;
  };
  updateISTClock();
  setInterval(updateISTClock, 1000);

  // ==========================================================================
  // 9. CampusPulse Smooth Scroll & Quick Tab Switch Bindings
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Spotlight card mouse tracking for CampusPulse cards
  const interactiveCards = document.querySelectorAll('.pulse-card, .facility-card-hotspot, .branch-gateway-card, .pulse-widget');
  interactiveCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ==========================================================================
  // 10. Contact & Admissions Side-Drawer Panel
  // ==========================================================================
  const contactDrawerBackdrop = document.getElementById('contact-drawer-backdrop');
  const openContactBtn = document.getElementById('open-contact-btn');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const inquiryForm = document.getElementById('campus-inquiry-form');
  const formStatusAlert = document.getElementById('form-status-alert');

  const openDrawer = () => {
    if (!contactDrawerBackdrop) return;
    contactDrawerBackdrop.classList.add('open');
    contactDrawerBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (!contactDrawerBackdrop) return;
    contactDrawerBackdrop.classList.remove('open');
    contactDrawerBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (openContactBtn) openContactBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);

  if (contactDrawerBackdrop) {
    contactDrawerBackdrop.addEventListener('click', (e) => {
      if (e.target === contactDrawerBackdrop) closeDrawer();
    });
  }

  // Escape key closes side drawer
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
    }
  });

  // Handle Form Submission
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();

      if (!name || !email) return;

      const submitBtn = document.getElementById('submit-inquiry-btn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Transmitting Dispatch...</span>';

      setTimeout(() => {
        formStatusAlert.className = 'form-status-alert success';
        formStatusAlert.innerHTML = `<strong>Inquiry Dispatched Successfully!</strong><br>Reference ID #AIT-2026-${Math.floor(1000 + Math.random() * 9000)}. The Admissions Cell at Dighi Hills will reach out to <em>${email}</em>.`;
        submitBtn.innerHTML = '<span>Dispatched ✓</span>';
        inquiryForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Dispatch Inquiry</span><span>→</span>';
        }, 4000);
      }, 700);
    });
  }

  // ==========================================================================
  // 11. Interactive Number Animation for Stats (CampusPulse Metrics)
  // ==========================================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const animateStats = () => {
    if (animated) return;
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    const rect = heroSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      animated = true;
      statNumbers.forEach(numEl => {
        const target = parseInt(numEl.getAttribute('data-count'), 10);
        if (isNaN(target)) return;
        const duration = 1600;
        const startTime = performance.now();

        const step = (currentTime) => {
          const progress = Math.min((currentTime - startTime) / duration, 1);
          // Ease out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(easeProgress * target);

          if (target === 2400) {
            numEl.textContent = `${(current / 1000).toFixed(1)}k+`;
          } else if (target === 100) {
            numEl.textContent = `${current}%`;
          } else if (target === 0) {
            numEl.textContent = `0%`;
          } else {
            numEl.textContent = `${current}+`;
          }

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            if (target === 2400) numEl.textContent = '2.4k+';
            if (target === 100) numEl.textContent = '100%';
            if (target === 0) numEl.textContent = '0%';
          }
        };
        requestAnimationFrame(step);
      });
    }
  };

  window.addEventListener('scroll', animateStats, { passive: true });
  animateStats(); // Initial check

});

// Global instant triggers for project upload and review modals
window.openProjectModalDirect = function() {
  const modal = document.getElementById('project-create-modal');
  if (modal) modal.classList.add('open');
};

window.closeProjectModalDirect = function() {
  const modal = document.getElementById('project-create-modal');
  if (modal) modal.classList.remove('open');
};

window.openProjectReviewModalDirect = function(projectId, projectTitle) {
  const modal = document.getElementById('project-review-modal');
  if (modal) {
    if (projectId) {
      const idInput = document.getElementById('review-form-project-id');
      if (idInput) idInput.value = projectId;
    }
    if (projectTitle) {
      const titleEl = document.getElementById('review-modal-project-title');
      if (titleEl) titleEl.textContent = projectTitle;
    }
    modal.classList.add('open');
  }
};

window.closeProjectReviewModalDirect = function() {
  const modal = document.getElementById('project-review-modal');
  if (modal) modal.classList.remove('open');
};
