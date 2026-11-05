/**
 * AIT PUNE — CAMPUS VISION
 * Editorial Interactive Experience Engine
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Minimalist Custom Cursor
  // ==========================================================================
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  let mouseX = -100, mouseY = -100;
  let cursorX = -100, cursorY = -100;

  if (cursor && cursorDot && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const renderCursor = () => {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    // Expand cursor over interactive elements
    const interactiveTargets = document.querySelectorAll('a, button, .service-item, .dept-card, .specimen-btn, .magenta-explore-badge, .filter-tab');
    interactiveTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
  }

  // ==========================================================================
  // 2. Ambient Canvas Lattice Pattern
  // ==========================================================================
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const resizeCanvas = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      drawGrid();
    };
    window.addEventListener('resize', resizeCanvas);

    const drawGrid = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(10, 11, 13, 0.04)';
      const spacing = 48;
      for (let x = 24; x < width; x += spacing) {
        for (let y = 24; y < height; y += spacing) {
          ctx.beginPath();
          ctx.arc(x, y, 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    drawGrid();
  }

  // ==========================================================================
  // 3. Header Scrolled State & Active Spy
  // ==========================================================================
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==========================================================================
  // 4. Parallax Depth on Hero Lens & 3D Tilt on Specimen Card
  // ==========================================================================
  const heroStage = document.querySelector('.hero-stage');
  const heroLensImg = document.getElementById('hero-optic-img');
  const specimenCard = document.getElementById('specimen-card');

  if (heroStage && heroLensImg) {
    heroStage.addEventListener('mousemove', (e) => {
      const rect = heroStage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroLensImg.style.transform = `scale(1.02) translate(${x * 14}px, ${y * 14}px)`;
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
  // 5. Live Indian Standard Time (IST) Clock
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
  // 6. Academic Division Filtering
  // ==========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const deptCards = document.querySelectorAll('.dept-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-filter');
      deptCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filterVal === 'all' || filterVal === cat) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================================================
  // 7. Department Curriculum Detail Modal
  // ==========================================================================
  const deptDataMap = {
    comp: {
      tag: "DEPARTMENT // CE-01 (ESTD. 1994)",
      title: "Computer Engineering (B.Tech & PhD)",
      desc: "Accredited by NBA for 6 consecutive cycles. Offers industry-collaborative curricula in Cloud Computing, Generative AI, Cyber-Physical Systems, and Distributed Ledgers.",
      intake: "120 Seats / Academic Year",
      facultyRatio: "1:15 Specialized Faculty",
      labs: "8 Specialized Computing Labs (NVIDIA AI & Cisco Academy)",
      topRecruiters: "Microsoft, Amazon, Google, Cred, Zomato, Deutsche Bank",
      avgCtc: "₹16.80 LPA Average CTC"
    },
    robotics: {
      tag: "DEPARTMENT // ARE-02 (AUTONOMOUS 2025)",
      title: "Automation & Robotics Engineering",
      desc: "Interdisciplinary division integrating mechanical kinodynamics, PLC & SCADA industrial networks, edge computer vision, and ROS-powered autonomous rovers.",
      intake: "60 Seats / Academic Year",
      facultyRatio: "1:14 Research Mentor Ratio",
      labs: "5 Advanced Automation & Smart Mechatronics Labs",
      topRecruiters: "Fanuc, Siemens, ABB, Tata Motors, L&T Technology",
      avgCtc: "₹14.20 LPA Average CTC"
    },
    etc: {
      tag: "DEPARTMENT // ETC-03 (NBA ACCREDITED)",
      title: "Electronics & Telecommunication",
      desc: "Core semiconductor, VLSI design, and 5G communications powerhouse. Houses dedicated RF and microwave simulation studios and Cadence VLSI tool suites.",
      intake: "120 Seats / Academic Year",
      facultyRatio: "1:15 Faculty-to-Student Ratio",
      labs: "12 Domain Labs (Cadence VLSI, Embedded C & DSP)",
      topRecruiters: "Qualcomm, Texas Instruments, Nvidia, Honeywell, Intel",
      avgCtc: "₹13.60 LPA Average CTC"
    },
    it: {
      tag: "DEPARTMENT // IT-04 (NBA ACCREDITED)",
      title: "Information Technology",
      desc: "Focuses on large-scale distributed databases, zero-trust cloud network security, fullstack devops architectures, and enterprise data analytics pipelines.",
      intake: "60 Seats / Academic Year",
      facultyRatio: "1:15 Dedicated Professors",
      labs: "6 High-Speed Linux and Enterprise Cloud Labs",
      topRecruiters: "Amazon, Mastercard, Barclays, Credit Suisse, Deloitte",
      avgCtc: "₹15.40 LPA Average CTC"
    },
    mech: {
      tag: "DEPARTMENT // ME-05 (NBA ACCREDITED)",
      title: "Mechanical Engineering",
      desc: "Pioneering fluid mechanics, FEA computational simulations, additive manufacturing, and host of AIT’s championship Formula Student and BAJA racing teams.",
      intake: "60 Seats / Academic Year",
      facultyRatio: "1:15 Faculty Cadre",
      labs: "10 Industrial Testing & Prototyping Facilities",
      topRecruiters: "Tata Technologies, Mercedes-Benz, Bharat Forge, L&T",
      avgCtc: "₹9.80 LPA Average CTC"
    },
    pg: {
      tag: "DIVISION // PG-06 (POSTGRADUATE & DOCTORAL)",
      title: "M.Tech Data Science & PhD Research",
      desc: "Autonomous postgraduate specialization affiliated with Savitribai Phule Pune University. Dedicated to high-throughput research, patents, and defense tech.",
      intake: "36 PG Seats + Doctoral Scholars",
      facultyRatio: "1:5 Master's Mentorship",
      labs: "Centre of Excellence in Data Engineering & HPC",
      topRecruiters: "R&D Labs, DRDO, Fintech Research, MNC Innovation Hubs",
      avgCtc: "₹16.50 LPA Postgraduate Benchmark"
    }
  };

  const deptModal = document.getElementById('dept-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTag = document.getElementById('modal-dept-tag');
  const modalTitle = document.getElementById('modal-dept-title');
  const modalDesc = document.getElementById('modal-dept-desc');
  const modalDetails = document.getElementById('modal-dept-details');
  const modalInquireBtn = document.getElementById('modal-inquire-btn');

  const openDeptModal = (deptKey) => {
    const data = deptDataMap[deptKey] || deptDataMap.comp;
    modalTag.textContent = data.tag;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;

    modalDetails.innerHTML = `
      <div class="modal-detail-item">
        <span class="detail-label">Annual Intake</span>
        <span class="detail-value">${data.intake}</span>
      </div>
      <div class="modal-detail-item">
        <span class="detail-label">Faculty Ratio</span>
        <span class="detail-value">${data.facultyRatio}</span>
      </div>
      <div class="modal-detail-item">
        <span class="detail-label">Research Facilities</span>
        <span class="detail-value">${data.labs}</span>
      </div>
      <div class="modal-detail-item">
        <span class="detail-label">Placement Quotient</span>
        <span class="detail-value">${data.avgCtc}</span>
      </div>
      <div class="modal-detail-item" style="grid-column: span 2;">
        <span class="detail-label">Key Visiting Corporate Brands</span>
        <span class="detail-value">${data.topRecruiters}</span>
      </div>
    `;

    deptModal.classList.add('open');
    deptModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeDeptModal = () => {
    deptModal.classList.remove('open');
    deptModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.dept-action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const deptKey = btn.getAttribute('data-dept');
      openDeptModal(deptKey);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeDeptModal);
  if (deptModal) {
    deptModal.addEventListener('click', (e) => {
      if (e.target === deptModal) closeDeptModal();
    });
  }

  // ==========================================================================
  // 8. Contact & Admissions Side-Drawer Panel
  // ==========================================================================
  const contactDrawerBackdrop = document.getElementById('contact-drawer-backdrop');
  const openContactBtn = document.getElementById('open-contact-btn');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const inquiryForm = document.getElementById('campus-inquiry-form');
  const formStatusAlert = document.getElementById('form-status-alert');

  const openDrawer = () => {
    contactDrawerBackdrop.classList.add('open');
    contactDrawerBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
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

  if (modalInquireBtn) {
    modalInquireBtn.addEventListener('click', () => {
      closeDeptModal();
      openDrawer();
    });
  }

  // Quick navigation clicks for service index items
  document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Specimen inspect button opens drawer with R&D enquiry
  const inspectSpecimenBtn = document.getElementById('inspect-specimen-btn');
  if (inspectSpecimenBtn) {
    inspectSpecimenBtn.addEventListener('click', () => {
      openDrawer();
      const select = document.getElementById('form-category');
      if (select) select.value = 'phd';
    });
  }

  // Escape key closes modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDeptModal();
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
  // 9. Interactive Number Animation for Stats
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
        let start = 0;
        const duration = 1500;
        const startTime = performance.now();

        const step = (currentTime) => {
          const progress = Math.min((currentTime - startTime) / duration, 1);
          const current = Math.floor(progress * target);
          if (target === 52) {
            numEl.textContent = `₹${current}L`;
          } else if (target === 96) {
            numEl.textContent = `${current}%`;
          } else {
            numEl.textContent = `${current}+`;
          }
          if (progress < 1) {
            requestAnimationFrame(step);
          }
        };
        requestAnimationFrame(step);
      });
    }
  };

  window.addEventListener('scroll', animateStats);
  animateStats(); // Initial check

});
