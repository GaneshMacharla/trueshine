/**
 * True Shine - Professional Water Tank Cleaning Services
 * Client-Side JavaScript (WhatsApp-First UX + Scroll Fade Animations + Visual UI)
 */

(function () {
  'use strict';

  // Constants
  const WA_PHONE = '919500168488'; // 9500168488 for WhatsApp
  const CALL_PRIMARY = '+919059410926';
  const CALL_SECONDARY = '+919500168488';

  /**
   * Helper: Generate direct WhatsApp URL
   */
  function buildWhatsAppUrl(message) {
    const encoded = encodeURIComponent(message.trim());
    return `https://wa.me/${WA_PHONE}?text=${encoded}`;
  }

  /**
   * Helper: Open WhatsApp link
   */
  function openWhatsApp(message) {
    const url = buildWhatsAppUrl(message);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Toast Notification Utility
   */
  function showToast(text) {
    const toast = document.getElementById('toast-notification');
    const toastText = document.getElementById('toast-text');
    if (!toast || !toastText) return;

    toastText.textContent = text;
    toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3200);
  }

  /**
   * 1. Scroll-Driven Fade In & Fade Out Animations (IntersectionObserver)
   */
  function initScrollAnimations() {
    const targets = document.querySelectorAll('.fade-reveal, .fade-reveal-left, .fade-reveal-right, .fade-reveal-scale');
    if (!targets.length) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // FADE IN when entering viewport
          entry.target.classList.add('is-visible');
        } else {
          // FADE OUT when leaving viewport (Smooth fade out on scroll)
          // If element is completely scrolled out of view, remove is-visible
          if (entry.boundingClientRect.top > 0 || entry.boundingClientRect.bottom < 0) {
            entry.target.classList.remove('is-visible');
          }
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach(el => observer.observe(el));
  }

  /**
   * 2. Quick Quote Mini-Selector
   */
  function initQuickQuote() {
    const propertySelect = document.getElementById('qq-property');
    const tankTypeSelect = document.getElementById('qq-tank-type');
    const capacitySelect = document.getElementById('qq-capacity');
    const localityInput = document.getElementById('qq-locality');
    const dateSelect = document.getElementById('qq-date');
    const previewMessageEl = document.getElementById('qq-preview-message');
    const bookBtn = document.getElementById('qq-book-btn');
    const timeEstimateEl = document.getElementById('qq-time-estimate');

    if (!propertySelect || !bookBtn) return;

    function getFormValues() {
      const property = propertySelect.value || 'Individual House';
      const tankType = tankTypeSelect ? tankTypeSelect.value : 'Overhead Sintex Tank';
      const capacity = capacitySelect ? capacitySelect.value : '1,000L - 2,000L';
      const locality = localityInput && localityInput.value.trim() ? localityInput.value.trim() : 'My Location';
      const date = dateSelect ? dateSelect.value : 'Earliest Available';

      return { property, tankType, capacity, locality, date };
    }

    function generateMessage() {
      const { property, tankType, capacity, locality, date } = getFormValues();

      return `Hi True Shine! 👋\n` +
             `I would like to book a professional Water Tank Cleaning service.\n\n` +
             `📋 *Booking Details:*\n` +
             `• *Property:* ${property}\n` +
             `• *Tank Type:* ${tankType}\n` +
             `• *Capacity:* ${capacity}\n` +
             `• *Location:* ${locality}\n` +
             `• *Preferred Time:* ${date}\n\n` +
             `Please confirm availability and share the best price quote!`;
    }

    function updatePreview() {
      const msg = generateMessage();
      if (previewMessageEl) {
        previewMessageEl.textContent = msg;
      }

      if (timeEstimateEl && capacitySelect) {
        const val = capacitySelect.value;
        if (val.includes('500L') || val.includes('1,000L')) {
          timeEstimateEl.textContent = '⏱️ 45 - 60 Mins';
        } else if (val.includes('2,000L') || val.includes('5,000L')) {
          timeEstimateEl.textContent = '⏱️ 60 - 90 Mins';
        } else if (val.includes('10,000L') || val.includes('Commercial')) {
          timeEstimateEl.textContent = '⏱️ 2 - 3 Hours';
        } else {
          timeEstimateEl.textContent = '⏱️ 60 - 90 Mins';
        }
      }
    }

    const inputs = [propertySelect, tankTypeSelect, capacitySelect, localityInput, dateSelect];
    inputs.forEach(input => {
      if (input) {
        input.addEventListener('change', updatePreview);
        input.addEventListener('input', updatePreview);
      }
    });

    bookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const msg = generateMessage();
      openWhatsApp(msg);
    });

    updatePreview();
  }

  /**
   * 3. WhatsApp CTA Bindings
   */
  function initWhatsAppCTAs() {
    document.querySelectorAll('[data-wa-action="general"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const msg = `Hi True Shine! I would like to book a Water Tank Cleaning service. Please share details and availability.`;
        openWhatsApp(msg);
      });
    });

    document.querySelectorAll('[data-wa-segment]').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const segment = card.getAttribute('data-wa-segment');
        const msg = `Hi True Shine! I need a quote for water tank cleaning for our ${segment}. Please share pricing and time slots.`;
        openWhatsApp(msg);
      });
    });

    document.querySelectorAll('[data-wa-message]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const msg = btn.getAttribute('data-wa-message');
        openWhatsApp(msg);
      });
    });
  }

  /**
   * 4. Interactive Before / After Comparison Slider
   */
  function initComparisonSlider() {
    const container = document.getElementById('comparison-slider-container');
    const rangeInput = document.getElementById('comparison-range');
    const presetBeforeBtn = document.getElementById('slider-btn-before');
    const presetSplitBtn = document.getElementById('slider-btn-split');
    const presetAfterBtn = document.getElementById('slider-btn-after');

    if (!container || !rangeInput) return;

    function setSliderPosition(pos) {
      const clamped = Math.max(0, Math.min(100, pos));
      container.style.setProperty('--slider-pos', `${clamped}%`);
      rangeInput.value = clamped;
    }

    rangeInput.addEventListener('input', (e) => {
      setSliderPosition(e.target.value);
    });

    let isDragging = false;

    function updateFromPointer(e) {
      const rect = container.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const x = clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    }

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateFromPointer(e);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateFromPointer(e);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    container.addEventListener('touchstart', (e) => {
      isDragging = true;
      updateFromPointer(e);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      updateFromPointer(e);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    if (presetBeforeBtn) {
      presetBeforeBtn.addEventListener('click', () => setSliderPosition(15));
    }
    if (presetSplitBtn) {
      presetSplitBtn.addEventListener('click', () => setSliderPosition(50));
    }
    if (presetAfterBtn) {
      presetAfterBtn.addEventListener('click', () => setSliderPosition(85));
    }

    setSliderPosition(50);
  }

  /**
   * 5. Visual Water Hygiene Gauge / Quiz
   */
  function initHygieneQuiz() {
    const quizForm = document.getElementById('hygiene-quiz-form');
    const resultBox = document.getElementById('quiz-result');
    const riskTitle = document.getElementById('quiz-risk-title');
    const riskBadge = document.getElementById('quiz-risk-badge');
    const riskDesc = document.getElementById('quiz-risk-desc');
    const riskWaBtn = document.getElementById('quiz-wa-btn');
    const gaugeBar = document.getElementById('quiz-gauge-bar');
    const gaugeScoreText = document.getElementById('quiz-gauge-score');

    if (!quizForm || !resultBox) return;

    quizForm.addEventListener('change', () => {
      const q1 = quizForm.elements['q_time'] ? quizForm.elements['q_time'].value : '';
      const q2 = quizForm.elements['q_odor'] ? quizForm.elements['q_odor'].value : '';
      const q3 = quizForm.elements['q_color'] ? quizForm.elements['q_color'].value : '';

      if (!q1 || !q2 || !q3) return;

      let score = 0;
      if (q1 === 'over_6m') score += 35;
      else if (q1 === 'over_1yr' || q1 === 'never') score += 50;
      else if (q1 === 'within_3m') score += 10;

      if (q2 === 'yes') score += 30;
      if (q3 === 'yes') score += 20;

      resultBox.classList.remove('hidden');

      let riskLevel = '';
      let badgeClass = '';
      let messageDesc = '';
      let barColor = '';

      if (score >= 65) {
        riskLevel = '🚨 CRITICAL CONTAMINATION RISK';
        badgeClass = 'bg-red-500 text-white';
        messageDesc = 'High probability of algae biofilm, E. coli & heavy sediment. Immediate 6-stage UV sanitization advised.';
        barColor = 'bg-red-500';
      } else if (score >= 35) {
        riskLevel = '⚠️ MODERATE SEDIMENT ACCUMULATION';
        badgeClass = 'bg-amber-500 text-white';
        messageDesc = 'Biofilm and settled silt detected. Preventive mechanised deep cleaning recommended.';
        barColor = 'bg-amber-500';
      } else {
        riskLevel = '✅ NORMAL HYGIENE STATUS';
        badgeClass = 'bg-emerald-500 text-white';
        messageDesc = 'Keep scheduled 6-month maintenance active to ensure continuous safe drinking water.';
        barColor = 'bg-emerald-500';
      }

      if (riskTitle) riskTitle.textContent = riskLevel;
      if (riskBadge) {
        riskBadge.className = `px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase ${badgeClass}`;
        riskBadge.textContent = score >= 65 ? 'High Hazard' : score >= 35 ? 'Attention Due' : 'Healthy Tank';
      }
      if (riskDesc) riskDesc.textContent = messageDesc;

      if (gaugeBar) {
        gaugeBar.style.width = `${Math.min(100, Math.max(15, score))}%`;
        gaugeBar.className = `h-2.5 rounded-full transition-all duration-500 ${barColor}`;
      }
      if (gaugeScoreText) {
        gaugeScoreText.textContent = `${score}% Risk`;
      }

      if (riskWaBtn) {
        riskWaBtn.onclick = () => {
          const text = `Hi True Shine! I just completed your Tank Health Assessment (${riskLevel} - ${score}% Risk). Please schedule a mechanised inspection & cleaning.`;
          openWhatsApp(text);
        };
      }
    });
  }

  /**
   * 6. FAQ Accordion
   */
  function initFAQ() {
    const items = document.querySelectorAll('.accordion-item');

    items.forEach((item, index) => {
      const header = item.querySelector('.accordion-header');
      if (!header) return;

      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        items.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const icon = otherItem.querySelector('.accordion-icon');
            if (icon) icon.style.transform = 'rotate(0deg)';
          }
        });

        if (isActive) {
          item.classList.remove('active');
          const icon = item.querySelector('.accordion-icon');
          if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
          item.classList.add('active');
          const icon = item.querySelector('.accordion-icon');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });

      if (index === 0) {
        item.classList.add('active');
        const icon = item.querySelector('.accordion-icon');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  }

  /**
   * 7. Mobile Navigation Menu Toggle
   */
  function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('mobile-menu-close');
    const links = document.querySelectorAll('.mobile-nav-link');

    if (!toggleBtn || !menu) return;

    function openMenu() {
      menu.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menu.classList.add('hidden');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    links.forEach(link => link.addEventListener('click', closeMenu));
  }

  /**
   * 8. Sticky Navbar Scroll Effect
   */
  function initNavbarScroll() {
    const nav = document.getElementById('main-navbar');
    if (!nav) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        nav.classList.add('shadow-md', 'bg-white/95', 'backdrop-blur-md');
        nav.classList.remove('bg-white/80');
      } else {
        nav.classList.remove('shadow-md');
        nav.classList.add('bg-white/80');
      }
    }, { passive: true });
  }

  /**
   * 9. Clipboard & Toast
   */
  function initPhoneActions() {
    document.querySelectorAll('[data-copy-phone]').forEach(el => {
      el.addEventListener('click', () => {
        const phone = el.getAttribute('data-copy-phone');
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(phone).then(() => {
            showToast(`Copied ${phone} to clipboard!`);
          });
        } else {
          showToast(`Phone: ${phone}`);
        }
      });
    });
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initQuickQuote();
    initWhatsAppCTAs();
    initComparisonSlider();
    initHygieneQuiz();
    initFAQ();
    initMobileMenu();
    initNavbarScroll();
    initPhoneActions();
  });

})();
