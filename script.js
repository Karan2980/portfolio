document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     CUSTOM CURSOR
     ========================================================================== */
  const cursorDot = document.getElementById('cursorDot');
  const cursorOutline = document.getElementById('cursorOutline');
  
  if (cursorDot && cursorOutline) {
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Instantly position the small dot
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });
    
    // Smooth lerp (linear interpolation) animation loop for the outer circle
    const animateOutline = () => {
      // Lerp coefficient: 0.15 for smooth drag delay
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      
      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;
      
      requestAnimationFrame(animateOutline);
    };
    animateOutline();
    
    // Expand outer cursor and fade inner cursor on hover of interactive elements
    const hoverables = document.querySelectorAll('a, button, input, textarea, select, .cert-card, [data-image], .btn-view-work');
    hoverables.forEach(item => {
      item.addEventListener('mouseenter', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorOutline.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
        cursorDot.style.opacity = '0';
      });
      item.addEventListener('mouseleave', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.backgroundColor = 'transparent';
        cursorDot.style.opacity = '1';
      });
    });
  }

  /* ==========================================================================
     HEADER SCROLL EFFECT & SCROLL SPY ACTIVE NAV LINK
     ========================================================================== */
  const mainHeader = document.getElementById('mainHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  const handleScroll = () => {
    const scrollPos = window.scrollY;
    
    // Header shadow & background color change
    if (scrollPos > 50) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
    
    // Scroll Spy active navigation state
    let activeSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120; // offset for sticky header height
      const sectionHeight = section.offsetHeight;
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        activeSectionId = section.getAttribute('id');
      }
    });

    if (activeSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Initial check
  handleScroll();

  /* ==========================================================================
     MOBILE HAMBURGER MENU NAVIGATION
     ========================================================================== */
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      mobileNavToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      // Prevent body scrolling when menu is active on mobile
      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    });

    // Close menu when navigation link is clicked
    const navMenuLinks = navMenu.querySelectorAll('a');
    navMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
      });
    });
  }

  /* ==========================================================================
     SCROLL REVEAL (FADE IN UP) ANIMATIONS
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve once revealed to keep page performance high
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  /* ==========================================================================
     SKILLS PROGRESS BAR FILL ANIMATIONS
     ========================================================================== */
  const skillsSection = document.getElementById('skills');
  const progressBars = document.querySelectorAll('.skill-progress-bar');
  
  if (skillsSection && progressBars.length > 0) {
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Fill each bar to its custom progress attribute
          progressBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-progress');
            bar.style.width = targetWidth;
          });
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });
    
    skillsObserver.observe(skillsSection);
  }

  /* ==========================================================================
     STATS COUNTER INCREMENTS
     ========================================================================== */
  const achievementsSection = document.getElementById('achievements');
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (achievementsSection && statNumbers.length > 0) {
    let hasCounted = false;
    
    const countUpStats = () => {
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'), 10);
        let current = 0;
        const duration = 2000; // 2 seconds total count animation
        const stepTime = Math.max(Math.floor(duration / target), 30);
        
        const timer = setInterval(() => {
          current += 1;
          
          if (stat.getAttribute('data-target') === '1') {
            stat.innerText = `${current}+`;
          } else {
            stat.innerText = current;
          }
          
          if (current >= target) {
            if (stat.getAttribute('data-target') === '1') {
              stat.innerText = `${target}+`;
            } else {
              stat.innerText = target;
            }
            clearInterval(timer);
          }
        }, stepTime);
      });
    };
    
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasCounted) {
          countUpStats();
          hasCounted = true;
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });
    
    statsObserver.observe(achievementsSection);
  }

  /* ==========================================================================
     CERTIFICATIONS LIGHTBOX MODAL
     ========================================================================== */
  const certCards = document.querySelectorAll('.cert-card, [data-image]');
  const lightbox = document.getElementById('certLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxIssuer = document.getElementById('lightboxIssuer');
  const lightboxClose = document.getElementById('lightboxClose');

  if (certCards.length > 0 && lightbox && lightboxImg) {
    certCards.forEach(card => {
      card.addEventListener('click', () => {
        const imageSrc = card.getAttribute('data-image');
        const titleText = card.getAttribute('data-title');
        const issuerText = card.getAttribute('data-issuer');
        
        lightboxImg.setAttribute('src', imageSrc);
        lightboxTitle.innerText = titleText || 'Certificate Preview';
        lightboxIssuer.innerText = issuerText || '';
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scrolling
      });
    });

    const closeLightboxModal = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto'; // Restore scroll
      setTimeout(() => {
        lightboxImg.setAttribute('src', '');
        lightboxTitle.innerText = '';
        lightboxIssuer.innerText = '';
      }, 300); // Wait for transition fade to finish
    };

    lightboxClose.addEventListener('click', closeLightboxModal);
    
    // Close modal by clicking the backdrop mask
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightboxModal();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightboxModal();
      }
    });
  }

  /* ==========================================================================
     CONTACT FORM HANDLING & MAILTO REDIRECT
     ========================================================================== */
  const contactForm = document.getElementById('portfolioContactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameVal = document.getElementById('contactName').value.trim();
      const emailVal = document.getElementById('contactEmail').value.trim();
      const subjectVal = document.getElementById('contactSubject').value.trim();
      const messageVal = document.getElementById('contactMessage').value.trim();
      
      if (!nameVal || !emailVal || !subjectVal || !messageVal) {
        return;
      }
      
      // Display visual status indicator
      formStatus.style.display = 'flex';
      formStatus.style.opacity = '1';
      
      // Construct mailto link
      const emailRecipient = 'karanmailaram29@gmail.com';
      const mailtoSubject = encodeURIComponent(subjectVal);
      const mailtoBody = encodeURIComponent(
        `Hi Karankumar,\n\n${messageVal}\n\nBest Regards,\n${nameVal}\nEmail: ${emailVal}`
      );
      
      const mailtoUrl = `mailto:${emailRecipient}?subject=${mailtoSubject}&body=${mailtoBody}`;
      
      // Delay redirection slightly so the user sees the success banner feedback
      setTimeout(() => {
        window.location.href = mailtoUrl;
        
        // Reset status banner and contact form
        setTimeout(() => {
          formStatus.style.opacity = '0';
          setTimeout(() => {
            formStatus.style.display = 'none';
          }, 300);
          contactForm.reset();
        }, 3000);
      }, 1000);
    });
  }
});
