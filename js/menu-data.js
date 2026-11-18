'use strict';

const freshbiteMenu = [
  {
    "id": "rolex",
    "name": "Rolex Roll",
    "description": "Chapati rolled with eggs, tomatoes and onions.",
    "price": 5000,
    "category": "starter",
    "tags": [],
    "image": "rolex"
  },
  {
    "id": "groundnut-soup",
    "name": "Groundnut Soup",
    "description": "Peanut soup with vegetables and potatoes.",
    "price": 3500,
    "category": "starter",
    "tags": []
  },
  {
    "id": "akaro",
    "name": "Akaro Kae",
    "description": "Steamed banana mash with spicy groundnut sauce.",
    "price": 4000,
    "category": "starter",
    "tags": [
      "spicy"
    ]
  },
  {
    "id": "tilapia",
    "name": "Grilled Tilapia",
    "description": "Lake fish grilled with lemon and herbs.",
    "price": 15000,
    "category": "main",
    "tags": [
      "gluten-free"
    ],
    "image": "tilapia"
  },
  {
    "id": "matooke",
    "name": "Matooke & Groundnut Sauce",
    "description": "Steamed green bananas with peanut sauce.",
    "price": 8000,
    "category": "main",
    "tags": [
      "vegan"
    ],
    "image": "matooke"
  },
  {
    "id": "jackfruit",
    "name": "Jackfruit Stew",
    "description": "Young jackfruit in a tomato and vegetable stew.",
    "price": 7000,
    "category": "main",
    "tags": [
      "vegan"
    ]
  },
  {
    "id": "rolex-deluxe",
    "name": "Rolex Deluxe",
    "description": "Chapati with eggs, tomatoes, onions and meat.",
    "price": 5500,
    "category": "main",
    "tags": []
  },
  {
    "id": "banana-bread",
    "name": "Banana Bread",
    "description": "Banana bread with a golden crust.",
    "price": 3000,
    "category": "dessert",
    "tags": [],
    "image": "banana-bread"
  },
  {
    "id": "sweet-potato",
    "name": "Sweet Potato Cake",
    "description": "Cake made with local sweet potatoes.",
    "price": 4500,
    "category": "dessert",
    "tags": [
      "vegan"
    ]
  },
  {
    "id": "avocado",
    "name": "Avocado & Sugar",
    "description": "Fresh avocado with sugar syrup.",
    "price": 2500,
    "category": "dessert",
    "tags": []
  }
];

function matchesDish(dish, filters) {
  const query = filters.query.trim().toLocaleLowerCase();
  return (filters.category === 'all' || dish.category === filters.category)
    && (!filters.diet || dish.tags.includes(filters.diet))
    && `${dish.name} ${dish.description}`.toLocaleLowerCase().includes(query);
}

function findMenuDish(id) {
  return freshbiteMenu.find(dish => dish.id === id);
}
