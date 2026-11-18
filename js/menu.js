'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const rows = document.querySelectorAll('.menu-row[data-dish]');
  const search = document.getElementById('menu-search');
  const buttons = document.querySelectorAll('[data-diet]');
  const filters = { category: 'all', diet: '', query: '' };
  function update() {
    const matching = freshbiteMenu.filter(dish => matchesDish(dish, filters));
    const ids = new Set(matching.map(dish => dish.id));
    rows.forEach(row => { row.hidden = !ids.has(row.dataset.dish); });
    document.querySelectorAll('[data-menu-category]').forEach(category => {
      category.hidden = !Array.from(category.querySelectorAll('.menu-row[data-dish]')).some(row => !row.hidden);
    });
    buttons.forEach(button => {
      const selected = button.dataset.diet === (filters.diet || 'all');
      button.setAttribute('aria-pressed', String(selected));
    });
    document.getElementById('menu-status').textContent = `${matching.length} dish${matching.length === 1 ? '' : 'es'} · Prices in UGX`;
    document.querySelector('.empty-menu').hidden = matching.length > 0;
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    filters.diet = button.dataset.diet === 'all' ? '' : button.dataset.diet;
    update();
    trackEvent('menu_filter', { diet: filters.diet || 'all' });
  }));
  search.addEventListener('input', () => { filters.query = search.value; update(); });
  document.getElementById('clear-filters').addEventListener('click', () => {
    filters.diet = ''; filters.query = ''; search.value = ''; update(); search.focus();
  });
});
