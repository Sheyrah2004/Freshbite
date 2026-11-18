'use strict';

function restaurantNow(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Kampala', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(now).map(part => [part.type, part.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

function getBookingOptions(dateValue, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return { slots: [], message: 'Choose a date first.' };
  const date = new Date(`${dateValue}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== dateValue) {
    return { slots: [], message: 'Please choose a valid date.' };
  }
  const today = restaurantNow(now);
  if (dateValue < today.date) return { slots: [], message: 'Please choose today or a future date.' };
  if ([0, 6].includes(date.getUTCDay())) return { slots: [], message: 'We’re open Monday–Friday. Please choose a weekday.' };
  const slots = [];
  for (let minutes = 8 * 60; minutes < 22 * 60; minutes += 30) {
    if (dateValue === today.date && minutes <= today.minutes) continue;
    slots.push(`${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`);
  }
  return { slots, message: slots.length ? 'Monday–Friday · All times are East Africa Time.' : 'Today’s service times have passed. Please choose another weekday.' };
}

function buildBookingEmail(booking) {
  const subject = `Table request · ${booking.date} at ${booking.time} · ${booking.people} guest${booking.people === '1' ? '' : 's'}`;
  const body = [
    'Hello FreshBite,', '', 'I would like to request a table at Bugema University Small Gate.', '',
    `Name: ${booking.name}`, `Reply email: ${booking.email}`, `Date: ${booking.date}`,
    `Preferred time: ${booking.time} (East Africa Time)`, `Party size: ${booking.people}`,
    booking.dish ? `Dish I’m interested in: ${booking.dish}` : '', '',
    'Please confirm availability by email. I understand this request does not reserve a table until you confirm.', '', 'Thank you!'
  ].filter(line => line !== null).join('\r\n');
  return `mailto:booking@freshbites.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bookingForm');
  if (!form) return;
  const date = document.getElementById('date');
  const name = document.getElementById('name');
  const grid = document.getElementById('time-grid');
  const timeSelect = document.getElementById('time');
  const popup = document.getElementById('myForm');
  document.querySelector('.btn.cancel').addEventListener('click', () => popup.close());
  popup.addEventListener('click', event => { if (event.target === popup) popup.close(); });
  const fieldset = document.getElementById('preferred-times');
  const hint = document.getElementById('date-hint');
  const slotHint = document.getElementById('slot-hint');
  const feedback = document.getElementById('booking-feedback');
  const selectedDish = document.getElementById('selected-dish');
  const dish = findMenuDish(new URLSearchParams(window.location.search).get('dish'));
  if (dish) {
    selectedDish.value = dish.name;
    const note = document.getElementById('selected-dish-note');
    note.textContent = `Selected dish: ${dish.name}`;
    note.hidden = false;
  }
  date.min = restaurantNow().date;
  function updateTimes() {
    const previous = form.querySelector('input[name="time"]:checked')?.value;
    const result = getBookingOptions(date.value);
    date.min = restaurantNow().date;
    date.setCustomValidity(date.value && !result.slots.length ? result.message : '');
    hint.textContent = result.message;
    grid.replaceChildren();
    timeSelect.replaceChildren(new Option(result.slots.length ? 'Select a time' : 'Choose a date first', ''));
    timeSelect.disabled = !result.slots.length;
    fieldset.disabled = !result.slots.length;
    slotHint.hidden = result.slots.length > 0;
    slotHint.textContent = date.value ? result.message : 'Choose a date to see service times.';
    for (const slot of result.slots) {
      timeSelect.add(new Option(slot, slot));
      const label = document.createElement('label');
      label.className = 'slot-option';
      const input = document.createElement('input');
      input.type = 'radio'; input.name = 'time'; input.value = slot; input.required = true;
      input.checked = slot === previous;
      const text = document.createElement('span');
      text.className = 'time-slot'; text.textContent = slot;
      label.append(input, text); grid.append(label);
    }
    if (result.slots.includes(previous)) timeSelect.value = previous;
    return result;
  }
  timeSelect.addEventListener('change', () => {
    grid.querySelectorAll('input[name="time"]').forEach(input => { input.checked = input.value === timeSelect.value; });
  });
  grid.addEventListener('change', event => {
    if (event.target.matches('input[name="time"]')) timeSelect.value = event.target.value;
  });
  date.addEventListener('change', () => { updateTimes(); feedback.hidden = true; });
  form.addEventListener('input', () => { feedback.hidden = true; });
  form.addEventListener('focusin', () => trackEvent('booking_start'), { once: true });
  form.addEventListener('submit', event => {
    event.preventDefault();
    name.value = name.value.trim();
    const chosenTime = form.querySelector('input[name="time"]:checked')?.value;
    const schedule = getBookingOptions(date.value);
    if (!schedule.slots.includes(chosenTime)) {
      updateTimes();
      if (!date.reportValidity()) return;
      if (!form.reportValidity()) return;
      feedback.textContent = 'Choose a preferred time before sending your request.';
      feedback.hidden = false;
      return;
    }
    if (!form.reportValidity()) return;
    const url = buildBookingEmail({ name: name.value, email: document.getElementById('email').value.trim(), date: date.value, time: chosenTime, people: document.getElementById('party-size').value, dish: selectedDish.value });
    const retry = document.createElement('a'); retry.href = url; retry.textContent = 'Open the draft again';
    feedback.replaceChildren('Send the draft in your email app to booking@freshbites.com. Your table is reserved once we confirm by email. ', retry);
    feedback.hidden = false;
    document.getElementById('request-email-link').href = url;
    popup.showModal();
    window.location.href = url;
    trackEvent('booking_email_draft');
  });
});
