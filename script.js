// ============================================
// Pricing cards — click / tap to flip, keyboard accessible
// ============================================
document.querySelectorAll('.tier-card').forEach((card) => {
  card.addEventListener('click', () => {
    const isFlipped = card.getAttribute('aria-pressed') === 'true';
    card.setAttribute('aria-pressed', String(!isFlipped));
  });
});

// ============================================
// Contact form — builds a mailto: link so the message
// goes straight to Yoruk's inbox with no backend needed
// ============================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = contactForm.name.value.trim();
    const business = contactForm.business.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    const subject = business
      ? `New inquiry from ${name} — ${business}`
      : `New inquiry from ${name}`;

    const bodyLines = [
      `Name: ${name}`,
      business ? `Business: ${business}` : null,
      `Email: ${email}`,
      '',
      message
    ].filter(Boolean);

    const mailto = `mailto:yorukllc@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

    window.location.href = mailto;
  });
}
