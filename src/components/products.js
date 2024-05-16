import {VonzuuLogo} from'../assets/images/VonzuuLogo.png';
const products = [
    { 
      id:1,
      productName: 'Restaurants',
      productImage: require('../assets/images/Restaurants.png')
    },
    {
      id:2,
      productName: 'Groceries',
      productImage: require('../assets/images/Groceries.png')
    },
    { 
      id:3,   
      productName: 'Pharmacy',
      productImage: require('../assets/images/pharmacy.png')
    },
    {   id:4,
        productName: 'Pets',
        productImage: require('../assets/images/pet.png')
      },

    {   id:5,
        productName: 'Courier',
        productImage: require('../assets/images/courier.png')
    },

  ];

  const localBrandData = [
    {
        id:1,
        productName: 'Brown Butter Craft Bar & Kitchen',
        price:'$0.99 Delivery Free 10-25 min',
        ratting:4.2,
        productImage:"https://vonzuuliveimage.s3.amazonaws.com/0020631_captain-ds_450.jpeg"
    },
    {
        id:2,
        productName: 'Indian Fast food',
        price:'$0.99 Delivery Free 10-25 min',
        ratting:4.2,
        productImage:"https://img.freepik.com/premium-photo/assorted-indian-recipes-food-various_79295-7226.jpg?w=2000"
    },
  ];
  
  const favorites = [
    {
        id:1,
        productName: 'Brown Butter Craft Bar & Kitchen',
        price:'$0.99 Delivery Free 10-25 min',
        ratting:4.2,
        productImage:"https://img.freepik.com/free-photo/top-view-bowls-with-indian-food_23-2148723454.jpg?w=2000&t=st=1693814992~exp=1693815592~hmac=e486575f6783d507cc61e9dd1fb831c70a7a214149dae9fd73438b1d5c026e59"
    },
    {
        id:2,
        productName: 'Indian Fast food',
        price:'$0.99 Delivery Free 10-25 min',
        ratting:4.2,
        productImage:"https://img.freepik.com/premium-photo/assorted-indian-recipes-food-various_79295-7226.jpg?w=2000"
    },
    {
      id:3,
      productName: 'Brown Butter Craft Bar & Kitchen',
      price:'$0.99 Delivery Free 10-25 min',
      ratting:4.2,
      productImage:"https://img.freepik.com/free-photo/top-view-bowls-with-indian-food_23-2148723454.jpg?w=2000&t=st=1693814992~exp=1693815592~hmac=e486575f6783d507cc61e9dd1fb831c70a7a214149dae9fd73438b1d5c026e59"
  },
  {
      id:4,
      productName: 'Indian Fast food',
      price:'$0.99 Delivery Free 10-25 min',
      ratting:4.2,
      productImage:"https://img.freepik.com/premium-photo/assorted-indian-recipes-food-various_79295-7226.jpg?w=2000"
  },
  {
    id:5,
    productName: 'Brown Butter Craft Bar & Kitchen',
    price:'$0.99 Delivery Free 10-25 min',
    ratting:4.2,
    productImage:"https://img.freepik.com/free-photo/top-view-bowls-with-indian-food_23-2148723454.jpg?w=2000&t=st=1693814992~exp=1693815592~hmac=e486575f6783d507cc61e9dd1fb831c70a7a214149dae9fd73438b1d5c026e59"
},
{
    id:6,
    productName: 'Indian Fast food',
    price:'$0.99 Delivery Free 10-25 min',
    ratting:4.2,
    productImage:"https://img.freepik.com/premium-photo/assorted-indian-recipes-food-various_79295-7226.jpg?w=2000"
},
  ];


  const foodOutlet =[
    { 
        id:1,
        productName: 'Burger King',
        productImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Burger_King_logo_%281999%29.svg/2024px-Burger_King_logo_%281999%29.svg.png'
      },
      {
        id:2,
        productName: 'Pizza Hut',
        productImage: 'https://upload.wikimedia.org/wikipedia/sco/thumb/d/d2/Pizza_Hut_logo.svg/2177px-Pizza_Hut_logo.svg.png'
      },
      { 
        id:3,   
        productName: 'Baskin Robbin',
        productImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Baskin-Robbins_logo.svg/1024px-Baskin-Robbins_logo.svg.png'
      },
      {   id:4,
          productName: 'Dominos',
          productImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Domino%27s_pizza_logo.svg/2036px-Domino%27s_pizza_logo.svg.png'
        },

  ];

  const productDetailPosterImages=[
    {
      id:1,
      productImage:"https://img.freepik.com/free-photo/top-view-bowls-with-indian-food_23-2148723454.jpg?w=2000&t=st=1693814992~exp=1693815592~hmac=e486575f6783d507cc61e9dd1fb831c70a7a214149dae9fd73438b1d5c026e59"
  },
  {
      id:2,
      productImage:"https://img.freepik.com/premium-photo/assorted-indian-recipes-food-various_79295-7226.jpg?w=2000"
  },
  {
    id:3,
    productImage:"https://img.freepik.com/free-photo/top-view-bowls-with-indian-food_23-2148723454.jpg?w=2000&t=st=1693814992~exp=1693815592~hmac=e486575f6783d507cc61e9dd1fb831c70a7a214149dae9fd73438b1d5c026e59"
},
{
    id:4,
    productImage:"https://img.freepik.com/premium-photo/indian-lunch-dinner-main-course-food-group-includes-paneer-butter-masala-dal-makhani-palak-paneer-roti-rice-etc-selective-focus_466689-6844.jpg?w=996"
},
]

const pickedForYou=[
  {
    id:1,
    dishName:'Biscuit with Bacon and Eggs  ',
    price:'$20.5',
    info:'Our Signature homemode brown butter and fresh foods avilable',
    productImage:"https://img.freepik.com/free-photo/top-view-bowls-with-indian-food_23-2148723454.jpg?w=2000&t=st=1693814992~exp=1693815592~hmac=e486575f6783d507cc61e9dd1fb831c70a7a214149dae9fd73438b1d5c026e59"
},
{
    id:2,
    dishName:'Buttor Panner Masala',
    price:'$20.5',
    info:'Our Signature homemode brown butter and fresh foods avilable',
    customize:'Cutomisable',
    productImage:"https://img.freepik.com/premium-photo/assorted-indian-recipes-food-various_79295-7226.jpg?w=2000"
},
{
  id:3,
  dishName:'Buttor Panner Masala',
  price:'$20.5',
  info:'Our Signature homemode brown butter and fresh foods avilable',
  productImage:"https://img.freepik.com/free-photo/top-view-bowls-with-indian-food_23-2148723454.jpg?w=2000&t=st=1693814992~exp=1693815592~hmac=e486575f6783d507cc61e9dd1fb831c70a7a214149dae9fd73438b1d5c026e59"
},
{
  id:4,
  dishName:'Buttor Panner Masala',
  price:'$20.5',
  info:'Our Signature homemode brown butter and fresh foods avilable',
  productImage:"https://img.freepik.com/premium-photo/indian-lunch-dinner-main-course-food-group-includes-paneer-butter-masala-dal-makhani-palak-paneer-roti-rice-etc-selective-focus_466689-6844.jpg?w=996"
},
]

const myOrder =[
  { 
      id:1,
      productName: 'Burger King',
      productAdd:'85000 Pena Blvd, Denver,Go',
      procuctPrice:"$130",
      productdate:"Oct 12,9.21 PM",
      productStatus:"In process",
      productInfo:"2x Nutella waffle,1x veg.Burger with Noodles"
    },
    {
      id:2,
      productName: 'Burger King',
      productAdd:'85000 Pena Blvd, Denver,Go',
      procuctPrice:"$130",
      productdate:"Oct 12,9.21 PM",
      productStatus:"Cancelled",
      productInfo:"2x Nutella waffle,1x veg.Burger with Noodles"
    },
    { 
      id:3,
      productName: 'Burger King',
      productAdd:'85000 Pena Blvd, Denver,Go',
      procuctPrice:"$130",
      productdate:"Oct 12,9.21 PM",
      productStatus:"Delivered",
      productInfo:"2x Nutella waffle,1x veg.Burger with Noodles"
    },
    { 
      id:4,
      productName: 'Burger King',
      productAdd:'85000 Pena Blvd, Denver,Go',
      procuctPrice:"$130",
      productdate:"Oct 12,9.21 PM",
      productStatus:"In process",
      productInfo:"2x Nutella waffle,1x veg.Burger with Noodles"
      },
   
];
 
const userData = [
  {
      id:1,
      name: 'Umesh Bhagwat',
      email:'umeshbhagwat@gmail.com',
      userImage:"https://i.pinimg.com/564x/f9/17/6b/f9176b60888f3a0572afb842e6724de4.jpg"
  },
];

const breads=[
  {
  id:1,
  name: 'Multigrain bread',
  price:'$581',
},
{
  id:2,
  name: 'Multigrain honey oats bread',
  price:'$100',
},
{
  id:3,
  name: 'Multigrain italian bread',
  price:'$250',
},
{
  id:4,
  name: 'Multigrain gralic bread',
  price:'$590',
},
{
  id:5,
  name: 'Multigrain Indian bread',
  price:'$890',
},
];


const vegies=[
  {
  id:1,
  name: 'Lettuce,Spinach and Silverbeet',
  price:'$581',
},
{
  id:2,
  name: 'cabbage,cauliflower,Brussels,Sprouts and broccoli.',
  price:'$100',
},
{
  id:3,
  name: 'pumpkin,cucumber,Brussels sprouts and broccoil.',
  price:'$250',
},
{
  id:4,
  name: 'pumpkin,cucumber,Brussels sprouts and broccoil.',
  price:'$590',
},
{
  id:5,
  name: 'onion,garlic and shallot',
  price:'$890',
},
]

export { localBrandData, products, foodOutlet,productDetailPosterImages,pickedForYou,favorites,myOrder,userData,breads,vegies};