/* =============================================
   SUNHILL LAND COMPANY — SCRIPTS
   ============================================= */

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const icon = navToggle.querySelector('i');
  icon.className = navLinks.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.querySelector('i').className = 'fas fa-bars';
  });
});

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // Close all
    document.querySelectorAll('.faq-question').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.closest('.faq-item').querySelector('.faq-answer').classList.remove('open');
    });

    // Open clicked (if it was closed)
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});

// ===== LEAD FORM VALIDATION & SUBMISSION =====
const form       = document.getElementById('leadForm');
const submitBtn  = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + 'Error');
  if (field)  field.classList.add('error');
  if (error)  error.textContent = message;
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + 'Error');
  if (field)  field.classList.remove('error');
  if (error)  error.textContent = '';
}

function validateForm() {
  let valid = true;

  // First Name
  const firstName = document.getElementById('firstName').value.trim();
  if (!firstName) {
    showError('firstName', 'First name is required.');
    valid = false;
  } else {
    clearError('firstName');
  }

  // Last Name
  const lastName = document.getElementById('lastName').value.trim();
  if (!lastName) {
    showError('lastName', 'Last name is required.');
    valid = false;
  } else {
    clearError('lastName');
  }

  // Phone
  const phone = document.getElementById('phone').value.trim();
  const phoneClean = phone.replace(/\D/g, '');
  if (!phone) {
    showError('phone', 'Phone number is required.');
    valid = false;
  } else if (phoneClean.length < 10) {
    showError('phone', 'Please enter a valid phone number.');
    valid = false;
  } else {
    clearError('phone');
  }

  // Email (optional but validate if provided)
  const email = document.getElementById('email').value.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('email', 'Please enter a valid email address.');
    valid = false;
  } else {
    clearError('email');
  }

  // Service Type
  const serviceType = document.getElementById('serviceType').value;
  if (!serviceType) {
    showError('serviceType', 'Please select a service.');
    valid = false;
  } else {
    clearError('serviceType');
  }

  return valid;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  // Show loading state
  const btnText    = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  btnText.style.display    = 'none';
  btnLoading.style.display = 'inline-flex';
  submitBtn.disabled = true;

  // Collect form data
  const formData = {
    firstName:   document.getElementById('firstName').value.trim(),
    lastName:    document.getElementById('lastName').value.trim(),
    phone:       document.getElementById('phone').value.trim(),
    email:       document.getElementById('email').value.trim(),
    serviceType: document.getElementById('serviceType').value,
    acreage:     document.getElementById('acreage').value,
    message:     document.getElementById('message').value.trim(),
    submittedAt: new Date().toISOString(),
    source:      window.location.href,
  };

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: '9d23613f-b1fe-4fdc-9e9b-1c050aaa353d',
        subject: `New Quote Request from ${formData.firstName} ${formData.lastName} — ${formData.serviceType}`,
        from_name: 'Sunhill Land Company Website',
        cc: 'silas@sunhillland.co',
        ...formData,
      }),
    });
    const result = await response.json();
    if (!result.success) throw new Error('Submission failed');

    // Show success state
    form.style.display = 'none';
    formSuccess.style.display = 'block';

    // Scroll to success message
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

  } catch (err) {
    // Reset button on error
    btnText.style.display    = 'inline';
    btnLoading.style.display = 'none';
    submitBtn.disabled = false;
    alert('Something went wrong. Please try again or call us directly.');
  }
});

// Live validation on blur
['firstName', 'lastName', 'phone', 'email', 'serviceType'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('blur', () => {
      validateForm();
    });
    el.addEventListener('input', () => {
      clearError(id);
    });
  }
});

// ===== SMOOTH SCROLL (fallback for older browsers) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== ANIMATE ON SCROLL (simple intersection observer) =====
const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.service-card, .why-card, .testimonial-card, .faq-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Add visible class styles via JS
const styleEl = document.createElement('style');
styleEl.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(styleEl);
