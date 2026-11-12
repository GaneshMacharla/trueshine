/**
 * True Shine - Professional Water Tank Cleaning Services
 * Client-Side JavaScript (Zero backend, WhatsApp-First UX)
 */

(function () {
  'use strict';

  // Constants
  const WA_PHONE = '919500168488'; // As instructed: 9500168488 for WhatsApp
  const CALL_PRIMARY = '+919059410926';
  const CALL_SECONDARY = '+919500168488';

  /**
   * Helper: Generate a direct WhatsApp URL with pre-filled message
   */
  function buildWhatsAppUrl(message) {
    const encoded = encodeURIComponent(message.trim());
    return `https://wa.me/${WA_PHONE}?text=${encoded}`;
  }

  /**
   * Helper: Open WhatsApp link in new tab/app
   */
  function openWhatsApp(message) {
    const url = buildWhatsAppUrl(message);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Show Toast Notification
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
   * 1. Quick Quote Mini-Selector (Hero & Interactive Section)
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

      // Update estimated time badge
      if (timeEstimateEl && capacitySelect) {
        const val = capacitySelect.value;
        if (val.includes('500L') || val.includes('1,000L')) {
          timeEstimateEl.textContent = '⏱️ Approx. 45 - 60 Mins';
        } else if (val.includes('2,000L') || val.includes('5,000L')) {
          timeEstimateEl.textContent = '⏱️ Approx. 60 - 90 Mins';
        } else if (val.includes('10,000L') || val.includes('Commercial')) {
          timeEstimateEl.textContent = '⏱️ Approx. 2 - 3 Hours (Heavy Duty)';
        } else {
          timeEstimateEl.textContent = '⏱️ Approx. 60 - 90 Mins';
        }
      }
    }

    // Event listeners for real-time live preview
    const inputs = [propertySelect, tankTypeSelect, capacitySelect, localityInput, dateSelect];
    inputs.forEach(input => {
      if (input) {
        input.addEventListener('change', updatePreview);
        input.addEventListener('input', updatePreview);
      }
    });

    // Submit / Book Button Click
    bookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const msg = generateMessage();
      openWhatsApp(msg);
    });

    // Initial preview update
    updatePreview();
  }

  /**
   * 2. General and Segment-Specific WhatsApp Buttons
   */
  function initWhatsAppCTAs() {
    // General Book Now buttons (class or data-action)
    document.querySelectorAll('[data-wa-action="general"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const msg = `Hi True Shine! I would like to book a Water Tank Cleaning service. Please share details and availability.`;
        openWhatsApp(msg);
      });
    });

    // Segment Specific CTAs ("Who We Serve" cards)
    document.querySelectorAll('[data-wa-segment]').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const segment = card.getAttribute('data-wa-segment');
        let msg = `Hi True Shine! I need a quote for water tank cleaning for our ${segment}. Please share pricing, process, and available time slots.`;
        openWhatsApp(msg);
      });
    });

    // Direct Pre-filled action buttons
    document.querySelectorAll('[data-wa-message]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const msg = btn.getAttribute('data-wa-message');
        openWhatsApp(msg);
      });
    });
  }

  /**
   * 3. Interactive Before / After Comparison Slider
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

    // Input range listener (smooth hardware accelerated)
    rangeInput.addEventListener('input', (e) => {
      setSliderPosition(e.target.value);
    });

    // Pointer / Touch support for direct dragging on container
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

    // Preset buttons
    if (presetBeforeBtn) {
      presetBeforeBtn.addEventListener('click', () => setSliderPosition(15));
    }
    if (presetSplitBtn) {
      presetSplitBtn.addEventListener('click', () => setSliderPosition(50));
    }
    if (presetAfterBtn) {
      presetAfterBtn.addEventListener('click', () => setSliderPosition(85));
    }

    // Set initial position to 50%
    setSliderPosition(50);
  }

  /**
   * 4. FAQ Accordion
   */
  function initFAQ() {
    const items = document.querySelectorAll('.accordion-item');

    items.forEach((item, index) => {
      const header = item.querySelector('.accordion-header');
      if (!header) return;

      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items
        items.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const icon = otherItem.querySelector('.accordion-icon');
            if (icon) icon.style.transform = 'rotate(0deg)';
          }
        });

        // Toggle current item
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

      // Open first FAQ by default
      if (index === 0) {
        item.classList.add('active');
        const icon = item.querySelector('.accordion-icon');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  }

  /**
   * 5. Mobile Navigation Menu Toggle
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

    links.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  /**
   * 6. Sticky Navbar Shadow & Blur on Scroll
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
   * 7. Interactive Water Hygiene Self-Assessment Quiz
   */
  function initHygieneQuiz() {
    const quizForm = document.getElementById('hygiene-quiz-form');
    const resultBox = document.getElementById('quiz-result');
    const riskTitle = document.getElementById('quiz-risk-title');
    const riskBadge = document.getElementById('quiz-risk-badge');
    const riskDesc = document.getElementById('quiz-risk-desc');
    const riskWaBtn = document.getElementById('quiz-wa-btn');

    if (!quizForm || !resultBox) return;

    quizForm.addEventListener('change', () => {
      const q1 = quizForm.elements['q_time'] ? quizForm.elements['q_time'].value : '';
      const q2 = quizForm.elements['q_odor'] ? quizForm.elements['q_odor'].value : '';
      const q3 = quizForm.elements['q_color'] ? quizForm.elements['q_color'].value : '';

      if (!q1 || !q2 || !q3) return; // Wait for full selection

      let score = 0;
      if (q1 === 'over_6m') score += 3;
      else if (q1 === 'over_1yr') score += 5;
      else if (q1 === 'never') score += 5;

      if (q2 === 'yes') score += 4;
      if (q3 === 'yes') score += 4;

      resultBox.classList.remove('hidden');

      let riskLevel = '';
      let badgeClass = '';
      let messageDesc = '';

      if (score >= 6) {
        riskLevel = '🚨 CRITICAL RISK: Immediate Cleaning Recommended!';
        badgeClass = 'bg-red-100 text-red-800 border-red-300';
        messageDesc = 'Your water tank is likely harboring microbial biofilm, algae sludge, and dangerous bacteria (E. coli, coliform). Cleaning and UV sanitization is urgently advised to protect your family from skin rashes and waterborne sickness.';
      } else if (score >= 3) {
        riskLevel = '⚠️ MODERATE RISK: Due for Hygiene Service';
        badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
        messageDesc = 'Sediment and biofilm have started settling at the base of your tank. A preventive 6-stage mechanised deep clean will restore pristine water hygiene.';
      } else {
        riskLevel = '✅ LOW RISK: Maintain Periodic 6-Month Schedule';
        badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
        messageDesc = 'Great job maintaining your tank! Book your next scheduled maintenance to ensure continuous safe, crystal-clean water supply.';
      }

      if (riskTitle) riskTitle.textContent = riskLevel;
      if (riskBadge) {
        riskBadge.className = `px-3 py-1 rounded-full text-xs font-bold border ${badgeClass}`;
        riskBadge.textContent = score >= 6 ? 'High Hazard' : score >= 3 ? 'Attention Needed' : 'Good Condition';
      }
      if (riskDesc) riskDesc.textContent = messageDesc;

      if (riskWaBtn) {
        riskWaBtn.onclick = () => {
          const text = `Hi True Shine! I just completed your Water Tank Hygiene Assessment.\nResult: ${riskLevel}\nI would like to schedule an inspection and cleaning service.`;
          openWhatsApp(text);
        };
      }
    });
  }

  /**
   * 8. Phone Copy & Toast triggers
   */
  function initPhoneActions() {
    document.querySelectorAll('[data-copy-phone]').forEach(el => {
      el.addEventListener('click', (e) => {
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

  // Initialize all components once DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    initQuickQuote();
    initWhatsAppCTAs();
    initComparisonSlider();
    initFAQ();
    initMobileMenu();
    initNavbarScroll();
    initHygieneQuiz();
    initPhoneActions();
  });

})();
