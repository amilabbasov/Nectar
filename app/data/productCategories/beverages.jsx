export const beverages = [
    // Water & Sparkling
    {
      id: 'bev1',
      name: "Mineral Water",
      volume: "1.5L",
      price: 1.25,
      img: require('../../assets/images/beverages/mineralWater.webp'),
      category: "water",
      type: "still",
      inStock: true
    },
    {
      id: 'bev2',
      name: "Sparkling Water",
      volume: "750ml",
      price: 1.75,
      img: require('../../assets/images/beverages/sparklingWater.webp'),
      category: "water",
      type: "sparkling",
      inStock: true
    },
  
    // Soft Drinks
    {
      id: 'bev3',
      name: "Cola",
      volume: "2L",
      price: 2.49,
      img: require('../../assets/images/beverages/cola.webp'),
      category: "soda",
      inStock: true
    },
    {
      id: 'bev4',
      name: "Lemon Soda",
      volume: "330ml",
      price: 1.50,
      img: require('../../assets/images/beverages/lemonSoda.webp'),
      category: "soda",
      inStock: true
    },
  
    // Juices
    {
      id: 'bev5',
      name: "Orange Juice",
      volume: "1L",
      price: 3.99,
      img: require('../../assets/images/beverages/orangeJuice.webp'),
      category: "juice",
      inStock: true
    },
    {
      id: 'bev6',
      name: "Apple Juice",
      volume: "500ml",
      price: 2.75,
      img: require('../../assets/images/beverages/appleJuice.webp'),
      category: "juice",
      inStock: true
    },
  
    // Tea & Coffee
    {
      id: 'bev7',
      name: "Green Tea",
      quantity: "20 bags",
      price: 4.25,
      img: require('../../assets/images/beverages/greenTea.webp'),
      category: "tea",
      inStock: true
    },
    {
      id: 'bev8',
      name: "Ground Coffee",
      weight: "250g",
      price: 6.50,
      img: require('../../assets/images/beverages/groundCoffee.webp'),
      category: "coffee",
      inStock: true
    },
  
    // Energy & Sports
    {
      id: 'bev9',
      name: "Energy Drink",
      volume: "500ml",
      price: 2.99,
      img: require('../../assets/images/beverages/energyDrink.webp'),
      category: "energy",
      inStock: true
    },
    {
      id: 'bev10',
      name: "Sports Drink",
      volume: "1L",
      price: 3.25,
      img: require('../../assets/images/beverages/sportsDrink.webp'),
      category: "sports",
      inStock: true
    },
  
    // Alcohol (non-alcoholic options)
    {
      id: 'bev11',
      name: "Non-Alcoholic Beer",
      volume: "330ml",
      price: 1.99,
      img: require('../../assets/images/beverages/nonAlcoholicBeer.webp'),
      category: "alcohol-free",
      inStock: true
    },
    {
      id: 'bev12',
      name: "Sparkling Cider",
      volume: "750ml",
      price: 5.50,
      img: require('../../assets/images/beverages/sparklingCider.webp'),
      category: "alcohol-free",
      inStock: true
    }
  ];

  export default beverages; 