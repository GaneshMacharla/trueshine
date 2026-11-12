/**
 * True Shine - Professional Water Tank Cleaning Services
 * Modern Client-Side JavaScript (WhatsApp-First UX & Interactive Estimator)
 */

(function () {
  'use strict';

  // Constants
  const WA_PHONE = '919500168488'; // 9500168488 for WhatsApp
  const CALL_PRIMARY = '+919059410926';

  /**
   * Helper: Open WhatsApp link with pre-filled text
   */
  function openWhatsApp(message) {
    const encoded = encodeURIComponent(message.trim());
    const url = `https://wa.me/${WA_PHONE}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Toast notification utility
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
   * 1. Interactive Instant Booking & Price Estimator (Hero Card)
   */
  function initBookingEstimator() {
    const propertySelect = document.getElementById('qq-property');
    const tankTypeSelect = document.getElementById('qq-tank-type');
    const capacitySelect = document.getElementById('qq-capacity');
    const localityInput = document.getElementById('qq-locality');
    const dateSelect = document.getElementById('qq-date');
    const previewMessageEl = document.getElementById('qq-preview-message');
    const bookBtn = document.getElementById('qq-book-btn');
    const priceEstimateEl = document.getElementById('qq-price-estimate');
    const timeEstimateEl = document.getElementById('qq-time-estimate');

    if (!propertySelect || !bookBtn) return;

    // Pricing estimation lookup
    function calculateEstimates(property, tankType, capacity) {
      let price = '₹699 - ₹899';
      let duration = '45 - 60 Mins';

      if (capacity.includes('500L')) {
        price = '₹599 - ₹799';
        duration = '45 Mins';
      } else if (capacity.includes('1,000L') || capacity.includes('2,000L')) {
        price = '₹899 - ₹1,199';
        duration = '60 Mins';
      } else if (capacity.includes('2,000L') || capacity.includes('5,000L')) {
        price = '₹1,499 - ₹2,199';
        duration = '75 - 90 Mins';
      } else if (capacity.includes('5,000L') || capacity.includes('10,000L')) {
        price = '₹2,499+';
        duration = '90 - 120 Mins';
      } else if (capacity.includes('10,000L') || property.includes('Apartment') || property.includes('Commercial')) {
        price = 'Custom Bulk Quote';
        duration = '2 - 3 Hours';
      }

      if (tankType.includes('Combo')) {
        price = '₹1,499 - ₹2,499';
        duration = '90 Mins';
      }

      return { price, duration };
    }

    function getFormValues() {
      const property = propertySelect.value || 'Individual House / Villa';
      const tankType = tankTypeSelect ? tankTypeSelect.value : 'Overhead Sintex Tank';
      const capacity = capacitySelect ? capacitySelect.value : '1,000L – 2,000L';
      const locality = localityInput && localityInput.value.trim() ? localityInput.value.trim() : 'My Location';
      const date = dateSelect ? dateSelect.value : 'Tomorrow';

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
             `• *Preferred Day:* ${date}\n\n` +
             `Please confirm availability and share the best price quote!`;
    }

    function updatePreview() {
      const { property, tankType, capacity } = getFormValues();
      const msg = generateMessage();
      
      if (previewMessageEl) {
        previewMessageEl.textContent = msg;
      }

      const { price, duration } = calculateEstimates(property, tankType, capacity);
      if (priceEstimateEl) priceEstimateEl.textContent = price;
      if (timeEstimateEl) timeEstimateEl.textContent = duration;
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
      openWhatsApp(generateMessage());
    });

    updatePreview();
  }

  /**
   * 2. General and Segment-Specific WhatsApp Buttons
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
        const msg = `Hi True Shine! I need a quote for water tank cleaning for our ${segment}. Please share pricing, process, and available time slots.`;
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

    function updateActivePreset(activeBtn) {
      [presetBeforeBtn, presetSplitBtn, presetAfterBtn].forEach(btn => {
        if (!btn) return;
        btn.classList.remove('ring-2', 'ring-cyan-400', 'ring-offset-2', 'ring-offset-slate-900', 'font-black');
      });
      if (activeBtn) {
        activeBtn.classList.add('ring-2', 'ring-cyan-400', 'ring-offset-2', 'ring-offset-slate-900', 'font-black');
      }
    }

    if (presetBeforeBtn) {
      presetBeforeBtn.addEventListener('click', () => {
        setSliderPosition(100); // 100% Before (Dirty Sludge)
        updateActivePreset(presetBeforeBtn);
      });
    }
    if (presetSplitBtn) {
      presetSplitBtn.addEventListener('click', () => {
        setSliderPosition(50); // 50/50 Half & Half
        updateActivePreset(presetSplitBtn);
      });
    }
    if (presetAfterBtn) {
      presetAfterBtn.addEventListener('click', () => {
        setSliderPosition(0); // 100% After (Clean Sanitized)
        updateActivePreset(presetAfterBtn);
      });
    }

    // Default: Split 50/50
    setSliderPosition(50);
    updateActivePreset(presetSplitBtn);
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

    links.forEach(link => link.addEventListener('click', closeMenu));
  }

  /**
   * 6. Sticky Navbar Shadow
   */
  function initNavbarScroll() {
    const nav = document.getElementById('main-navbar');
    if (!nav) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 15) {
        nav.classList.add('shadow-md', 'bg-white/95', 'backdrop-blur-md');
        nav.classList.remove('bg-white/80');
      } else {
        nav.classList.remove('shadow-md');
        nav.classList.add('bg-white/80');
      }
    }, { passive: true });
  }

  /**
   * 7. Phone Copy & Toast triggers
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

  // Initialize all
  document.addEventListener('DOMContentLoaded', () => {
    initBookingEstimator();
    initWhatsAppCTAs();
    initComparisonSlider();
    initFAQ();
    initMobileMenu();
    initNavbarScroll();
    initPhoneActions();
  });

})();
