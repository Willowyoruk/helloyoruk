// ============================================
// Plan builder — live summary + mailto request
// No payment, no backend: this only assembles a
// pre-filled email so Willow can follow up personally.
// ============================================

const groups = ['build', 'care', 'domain'];
const summaryList = document.getElementById('summary-list');
const summaryTotals = document.getElementById('summary-totals');

function getSelection(group) {
  const input = document.querySelector(`input[name="${group}"]:checked`);
  if (!input) return null;
  return {
    group,
    value: input.value,
    label: input.dataset.label,
    price: parseFloat(input.dataset.price || '0'),
    cadence: input.dataset.cadence || ''
  };
}

function renderSummary() {
  const selections = groups.map(getSelection).filter(Boolean);
  const meaningful = selections.filter(s => s.price > 0);

  summaryList.innerHTML = '';

  if (meaningful.length === 0) {
    const li = document.createElement('li');
    li.className = 'summary-empty';
    li.textContent = 'Make a selection to see your plan here.';
    summaryList.appendChild(li);
  } else {
    meaningful.forEach((s) => {
      const li = document.createElement('li');
      const priceLabel = s.cadence === '/mo'
        ? `$${s.price.toLocaleString()}/mo`
        : `$${s.price.toLocaleString()}`;
      li.innerHTML = `<span class="summary-item-name">${s.label}</span><span class="summary-item-price">${priceLabel}</span>`;
      summaryList.appendChild(li);
    });
  }

  const oneTime = selections
    .filter(s => s.cadence === 'one-time')
    .reduce((sum, s) => sum + s.price, 0);

  const monthly = selections
    .filter(s => s.cadence === '/mo')
    .reduce((sum, s) => sum + s.price, 0);

  summaryTotals.innerHTML = '';

  if (oneTime > 0) {
    const row = document.createElement('div');
    row.className = 'summary-total-row';
    row.innerHTML = `<span>One-time total</span><span class="summary-total-amount">$${oneTime.toLocaleString()}</span>`;
    summaryTotals.appendChild(row);
  }

  if (monthly > 0) {
    const row = document.createElement('div');
    row.className = 'summary-total-row';
    row.innerHTML = `<span>Monthly total</span><span class="summary-total-amount">$${monthly.toLocaleString()}/mo</span>`;
    summaryTotals.appendChild(row);
  }
}

document.querySelectorAll('.option-group input[type="radio"]').forEach((input) => {
  input.addEventListener('change', renderSummary);
});

renderSummary();

// ------------------------------------------------
// Build the request email on submit
// ------------------------------------------------
const planForm = document.getElementById('plan-form');

planForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameField = document.getElementById('p-name');
  const emailField = document.getElementById('p-email');

  if (!nameField.value.trim() || !emailField.value.trim()) {
    nameField.reportValidity();
    emailField.reportValidity();
    return;
  }

  const name = nameField.value.trim();
  const business = document.getElementById('p-business').value.trim();
  const email = emailField.value.trim();
  const notes = document.getElementById('p-notes').value.trim();

  const selections = groups.map(getSelection).filter(Boolean);
  const lines = selections.map((s) => {
    const priceLabel = s.price > 0
      ? (s.cadence === '/mo' ? ` — $${s.price.toLocaleString()}/mo` : ` — $${s.price.toLocaleString()}`)
      : '';
    return `- ${s.label}${priceLabel}`;
  });

  const oneTime = selections
    .filter(s => s.cadence === 'one-time')
    .reduce((sum, s) => sum + s.price, 0);
  const monthly = selections
    .filter(s => s.cadence === '/mo')
    .reduce((sum, s) => sum + s.price, 0);

  const totalLines = [];
  if (oneTime > 0) totalLines.push(`One-time total: $${oneTime.toLocaleString()}`);
  if (monthly > 0) totalLines.push(`Monthly total: $${monthly.toLocaleString()}/mo`);

  const subject = business
    ? `Plan request from ${name} — ${business}`
    : `Plan request from ${name}`;

  const bodyLines = [
    `Name: ${name}`,
    business ? `Business: ${business}` : null,
    `Email: ${email}`,
    '',
    'Selected plan:',
    ...lines,
    '',
    ...totalLines,
    '',
    notes ? `Notes: ${notes}` : null
  ].filter(Boolean);

  const mailto = `mailto:yorukllc@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

  window.location.href = mailto;
});
