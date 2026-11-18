'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const dish = findMenuDish(new URLSearchParams(window.location.search).get('dish'));
  if (!dish) {
    document.getElementById('dish-description').textContent = 'This dish could not be found. Choose a dish from the menu.';
    return;
  }
  document.title = `${dish.name} — FreshBite`;
  document.getElementById('dish-title').textContent = dish.name;
  document.getElementById('dish-description').textContent = dish.description;
  document.getElementById('dish-price').textContent = `UGX ${dish.price.toLocaleString('en-UG')}`;
  const labels = { vegan: 'Vegan', 'gluten-free': 'Gluten-free', spicy: 'Spicy' };
  document.getElementById('dish-tags').textContent = dish.tags.map(tag => labels[tag]).join(' · ');
  const book = document.getElementById('dish-book');
  book.href = `book-a-table.html?dish=${encodeURIComponent(dish.id)}`;
  book.hidden = false;
  if (dish.image) {
    const image = document.getElementById('dish-image');
    image.src = `images/freshbite-${dish.image}.webp`;
    image.alt = `${dish.name} · illustrative food image`;
    document.getElementById('dish-photo').hidden = false;
  }
  trackEvent('dish_view', { dish: dish.id });
});
