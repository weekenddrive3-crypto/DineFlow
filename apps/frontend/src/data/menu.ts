export interface MenuItemData {
  name: string;
  price: number;
  halfPrice?: number;
  code?: string;
  foodType: 'VEG' | 'NON_VEG' | 'EGG';
}

export interface CategoryData {
  name: string;
  items: MenuItemData[];
}

export const MENU_DATA: CategoryData[] = [
  {
    name: 'Chinese Veg',
    items: [
      { name: 'Veg Manchurian', price: 99, code: 'V1', foodType: 'VEG' },
      { name: 'Paneer Chilly', price: 149, code: 'V2', foodType: 'VEG' },
      { name: 'Paneer 65', price: 149, code: 'V3', foodType: 'VEG' },
      { name: 'Paneer Manchurian', price: 149, code: 'V4', foodType: 'VEG' },
      { name: 'Paneer Majestic', price: 199, code: 'V5', foodType: 'VEG' },
      { name: 'Hong Kong Paneer', price: 220, code: 'V6', foodType: 'VEG' },
      { name: 'Hot Garlic Paneer', price: 149, code: 'V7', foodType: 'VEG' },
      { name: 'Ginger Paneer', price: 149, code: 'V8', foodType: 'VEG' },
      { name: 'Mushroom Chilly', price: 169, code: 'V9', foodType: 'VEG' },
      { name: 'Mushroom 65', price: 169, code: 'V10', foodType: 'VEG' },
      { name: 'Mushroom Manchurian', price: 169, code: 'V11', foodType: 'VEG' },
      { name: 'Mushroom Salt & Pepper', price: 169, code: 'V12', foodType: 'VEG' },
      { name: 'Hot Garlic Mushroom', price: 169, code: 'V13', foodType: 'VEG' },
      { name: 'Baby Corn Manchurian', price: 149, code: 'V14', foodType: 'VEG' },
      { name: 'Baby Corn 65', price: 149, code: 'V15', foodType: 'VEG' },
      { name: 'Baby Corn Chilly', price: 149, code: 'V16', foodType: 'VEG' },
      { name: 'Gobi 65', price: 129, code: 'V17', foodType: 'VEG' },
      { name: 'Gobi Manchurian', price: 129, code: 'V18', foodType: 'VEG' },
      { name: 'Gobi Chilly', price: 119, code: 'V19', foodType: 'VEG' },
    ],
  },
  {
    name: 'Chinese Non-Veg',
    items: [
      { name: 'Chilly Chicken - Bone', price: 170, code: 'N1', foodType: 'NON_VEG' },
      { name: 'Chilly Chicken - Boneless', price: 180, code: 'N2', foodType: 'NON_VEG' },
      { name: 'Chicken 65 - Bone', price: 174, code: 'N3', foodType: 'NON_VEG' },
      { name: 'Chicken 65 - Boneless', price: 194, code: 'N4', foodType: 'NON_VEG' },
      { name: 'Chicken Manchurian - Bone', price: 174, code: 'N5', foodType: 'NON_VEG' },
      { name: 'Chicken Manchurian - Boneless', price: 194, code: 'N6', foodType: 'NON_VEG' },
      { name: 'Hot Garlic Chicken', price: 180, code: 'N7', foodType: 'NON_VEG' },
      { name: 'Chicken Majestic', price: 199, code: 'N8', foodType: 'NON_VEG' },
      { name: 'Chicken Lollipop', price: 279, code: 'N9', foodType: 'NON_VEG' },
      { name: 'Chicken 555', price: 199, code: 'N10', foodType: 'NON_VEG' },
      { name: 'Crispy Chicken', price: 180, code: 'N11', foodType: 'NON_VEG' },
      { name: 'Lemon Chicken', price: 180, code: 'N12', foodType: 'NON_VEG' },
      { name: 'Chicken Salt & Pepper', price: 180, code: 'N13', foodType: 'NON_VEG' },
      { name: 'Dragon Chicken', price: 199, code: 'N14', foodType: 'NON_VEG' },
      { name: 'Hong Kong Chicken', price: 199, code: 'N15', foodType: 'NON_VEG' },
      { name: 'Prawns Chilli', price: 220, code: 'N16', foodType: 'NON_VEG' },
      { name: 'Prawns 65', price: 220, code: 'N17', foodType: 'NON_VEG' },
      { name: 'Prawns Manchurian', price: 220, code: 'N18', foodType: 'NON_VEG' },
    ],
  },
  {
    name: 'Indian Veg',
    items: [
      { name: 'Paneer Curry', price: 109, code: 'IV1', foodType: 'VEG' },
      { name: 'Paneer Hydrabadi', price: 140, code: 'IV2', foodType: 'VEG' },
      { name: 'Kadai Paneer', price: 150, code: 'IV3', foodType: 'VEG' },
      { name: 'Paneer Dopiaza', price: 140, code: 'IV4', foodType: 'VEG' },
      { name: 'Paneer Butter Masala', price: 169, code: 'IV5', foodType: 'VEG' },
      { name: 'Paneer Masala', price: 149, code: 'IV6', foodType: 'VEG' },
      { name: 'Paneer Punjabi', price: 149, code: 'IV7', foodType: 'VEG' },
      { name: 'Paneer Lababdar', price: 180, code: 'IV8', foodType: 'VEG' },
      { name: 'Mix Veg Curry', price: 109, code: 'IV9', foodType: 'VEG' },
      { name: 'Mushroom Curry', price: 99, code: 'IV10', foodType: 'VEG' },
      { name: 'Mushroom Masala', price: 139, code: 'IV11', foodType: 'VEG' },
      { name: 'Kadai Mushroom', price: 149, code: 'IV12', foodType: 'VEG' },
      { name: 'Mushroom Dopiaza', price: 149, code: 'IV13', foodType: 'VEG' },
      { name: 'Baby Corn Masala', price: 119, code: 'IV14', foodType: 'VEG' },
      { name: 'Baby Corn Curry', price: 109, code: 'IV15', foodType: 'VEG' },
      { name: 'Corn Masala', price: 99, code: 'IV16', foodType: 'VEG' },
    ],
  },
  {
    name: 'Indian Non-Veg',
    items: [
      { name: 'Chicken Curry', price: 149, code: 'IN1', foodType: 'NON_VEG' },
      { name: 'Chicken Masala', price: 160, code: 'IN2', foodType: 'NON_VEG' },
      { name: 'Chicken Butter Masala', price: 170, code: 'IN3', foodType: 'NON_VEG' },
      { name: 'Kadai Chicken', price: 170, code: 'IN4', foodType: 'NON_VEG' },
      { name: 'Chicken Punjabi', price: 160, code: 'IN5', foodType: 'NON_VEG' },
      { name: 'Mughlai Chicken', price: 180, code: 'IN6', foodType: 'NON_VEG' },
      { name: 'Chicken Dopiaza', price: 160, code: 'IN7', foodType: 'NON_VEG' },
      { name: 'Chicken Kasa', price: 140, code: 'IN8', foodType: 'NON_VEG' },
      { name: 'Prawns Masala', price: 220, code: 'IN9', foodType: 'NON_VEG' },
      { name: 'Prawns Curry', price: 220, code: 'IN10', foodType: 'NON_VEG' },
    ],
  },
  {
    name: 'Biriyani',
    items: [
      { name: 'Hyderabad Dum Biriyani', price: 120, code: 'B1', foodType: 'NON_VEG' },
      { name: 'Chicken Fry Biriyani', price: 130, code: 'B2', foodType: 'NON_VEG' },
      { name: 'Chicken Lollipop Biriyani', price: 150, code: 'B3', foodType: 'NON_VEG' },
      { name: 'Chicken 65 Biriyani', price: 140, code: 'B4', foodType: 'NON_VEG' },
      { name: 'Chicken Special Biriyani', price: 150, code: 'B5', foodType: 'NON_VEG' },
      { name: 'Boneless Biriyani', price: 140, code: 'B6', foodType: 'NON_VEG' },
      { name: 'Prawns Biriyani', price: 160, code: 'B7', foodType: 'NON_VEG' },
    ],
  },
  {
    name: 'Roti & Paratha',
    items: [
      { name: 'Phulka', price: 10, code: 'R1', foodType: 'VEG' },
      { name: 'Chapati', price: 15, code: 'R2', foodType: 'VEG' },
      { name: 'Plain Paratha', price: 20, code: 'R3', foodType: 'VEG' },
      { name: 'Laccha Paratha', price: 25, code: 'R4', foodType: 'VEG' },
    ],
  },
  {
    name: 'Combo Meals',
    items: [
      { name: 'Chicken Jeera Rice + Chilly Chicken', price: 200, code: 'C1', foodType: 'NON_VEG' },
      { name: 'Chicken Curry + Phulka', price: 170, code: 'C2', foodType: 'NON_VEG' },
      { name: 'Jeera Rice + Dal', price: 110, code: 'C3', foodType: 'VEG' },
      { name: 'Aloo Paratha + Curd', price: 90, code: 'C4', foodType: 'VEG' },
      { name: 'Paneer Butter Masala + Laccha Paratha', price: 190, code: 'C5', foodType: 'VEG' },
      { name: 'Chicken Butter Masala + Laccha Paratha', price: 190, code: 'C6', foodType: 'NON_VEG' },
      { name: 'Chicken Kasa + Roti', price: 160, code: 'C7', foodType: 'NON_VEG' },
      { name: 'Chicken Manchurian + Fried Rice', price: 200, code: 'C8', foodType: 'NON_VEG' },
      { name: 'Chilly Paneer + Veg Noodles', price: 180, code: 'C9', foodType: 'VEG' },
      { name: 'Paneer Manchurian + Gravy Veg Fried Rice', price: 180, code: 'C10', foodType: 'VEG' },
      { name: 'Chicken 65 + Chicken Noodles', price: 210, code: 'C11', foodType: 'NON_VEG' },
    ],
  },
];

export const CATEGORIES = MENU_DATA.map((c) => c.name);

export function getItemsByCategory(category: string): MenuItemData[] {
  return MENU_DATA.find((c) => c.name === category)?.items || [];
}