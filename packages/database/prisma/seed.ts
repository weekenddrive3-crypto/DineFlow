import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ---- Create Outlet ----
  const outlet = await prisma.outlet.create({
    data: {
      name: 'LAVISH TOWN',
      refId: 'R330747',
      address: '123 Main Street, Kolkata, West Bengal',
      phone: '07969223344',
      gstNumber: '19AABCU9603R1ZM',
      currency: 'INR',
    },
  });
  console.log('✅ Outlet created:', outlet.name);

  // ---- Create Admin User ----
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@lavishtown.com',
      phone: '9876543210',
      passwordHash,
      role: 'ADMIN',
      outletId: outlet.id,
    },
  });

  const biller = await prisma.user.create({
    data: {
      name: 'biller',
      email: 'biller@lavishtown.com',
      phone: '9876543211',
      passwordHash: await bcrypt.hash('biller123', 10),
      role: 'BILLER',
      outletId: outlet.id,
    },
  });
  console.log('✅ Users created');

  // ---- Create Tax Groups ----
  const gst5 = await prisma.taxGroup.create({
    data: {
      name: 'GST 5%',
      outletId: outlet.id,
      taxes: {
        create: [
          { name: 'SGST', rate: 2.5, type: 'SGST' },
          { name: 'CGST', rate: 2.5, type: 'CGST' },
        ],
      },
    },
  });
  console.log('✅ Tax groups created');

  // ---- Create Areas & Tables (from screenshot) ----
  const nightindoor = await prisma.area.create({
    data: {
      name: 'Nightindoor',
      outletId: outlet.id,
      sortOrder: 1,
      tables: {
        create: Array.from({ length: 6 }, (_, i) => ({
          number: i + 1,
          capacity: 4,
          status: 'BLANK',
        })),
      },
    },
  });

  const outdoor = await prisma.area.create({
    data: {
      name: 'Outdoor',
      outletId: outlet.id,
      sortOrder: 2,
      tables: {
        create: Array.from({ length: 5 }, (_, i) => ({
          number: i + 7,
          capacity: 4,
          status: 'BLANK',
        })),
      },
    },
  });
  console.log('✅ Areas & Tables created');

  // ---- Create Menu Categories (from screenshot) ----
  const categories = [
    'Hot Coffee', 'Cold Coffee', 'Iced Coffee', 'Tea', 'Organic Tea',
    'Ice Tea', 'Milk Shake', 'Mocktail', 'Slush',
    'Veg Appetizers', 'Non-Veg Appetizers',
    'Veg Sandwich', 'Non-Veg Sandwich',
    'Veg Pasta', 'Non-Veg Pasta',
    'Veg Pizza', 'Desserts', 'Ice-Cream',
  ];

  const categoryRecords: Record<string, string> = {};
  for (let i = 0; i < categories.length; i++) {
    const cat = await prisma.menuCategory.create({
      data: {
        name: categories[i],
        outletId: outlet.id,
        sortOrder: i + 1,
      },
    });
    categoryRecords[categories[i]] = cat.id;
  }
  console.log('✅ Menu categories created');

  // ---- Create Menu Items (from screenshot - Hot Coffee items) ----
  const hotCoffeeItems = [
    { name: 'Affogato Coffee', price: 149 },
    { name: 'Americano Coffee', price: 99 },
    { name: 'Cafe Latte', price: 129 },
    { name: 'Cafe Mocha', price: 149 },
    { name: 'Cappuccino Coffee', price: 119 },
    { name: 'Caramel Coffee', price: 139 },
    { name: 'Caramel Latte', price: 149 },
    { name: 'Espresso Coffee', price: 89 },
    { name: 'Hazelnut Coffee', price: 159 },
    { name: 'Hazelnut Latte', price: 159 },
    { name: 'Hot Chocolate Coffee', price: 129 },
    { name: 'Irish Coffee', price: 169 },
    { name: 'Irish Latte', price: 169 },
    { name: 'Macchiato Coffee', price: 109 },
    { name: 'Piccolo Coffee', price: 99 },
    { name: 'Vanila Coffee', price: 129 },
    { name: 'Vanila Lattee', price: 139 },
  ];

  for (let i = 0; i < hotCoffeeItems.length; i++) {
    await prisma.menuItem.create({
      data: {
        name: hotCoffeeItems[i].name,
        categoryId: categoryRecords['Hot Coffee'],
        outletId: outlet.id,
        price: hotCoffeeItems[i].price,
        taxGroupId: gst5.id,
        foodType: 'VEG',
        sortOrder: i + 1,
      },
    });
  }

  // Add some items to other categories
  const otherItems = [
    { cat: 'Cold Coffee', name: 'Chocolate Frappe', price: 159 },
    { cat: 'Cold Coffee', name: 'Frappe', price: 139 },
    { cat: 'Cold Coffee', name: 'Cold Brew', price: 149 },
    { cat: 'Non-Veg Sandwich', name: 'Mexican Chicken Sandwich', price: 179 },
    { cat: 'Veg Pasta', name: 'Penne Arrabiata', price: 199 },
    { cat: 'Veg Pasta', name: 'Alfredo Pasta', price: 219 },
    { cat: 'Veg Pizza', name: 'Margherita Pizza', price: 249 },
    { cat: 'Veg Appetizers', name: 'Paneer Tikka', price: 189 },
    { cat: 'Non-Veg Appetizers', name: 'Chicken Wings', price: 249 },
    { cat: 'Milk Shake', name: 'Chocolate Shake', price: 149 },
    { cat: 'Milk Shake', name: 'Oreo Shake', price: 169 },
    { cat: 'Mocktail', name: 'Blue Lagoon', price: 139 },
    { cat: 'Mocktail', name: 'Virgin Mojito', price: 129 },
    { cat: 'Desserts', name: 'Brownie', price: 99 },
    { cat: 'Desserts', name: 'Cheesecake', price: 149 },
    { cat: 'Ice-Cream', name: 'Vanilla Scoop', price: 79 },
  ];

  for (const item of otherItems) {
    await prisma.menuItem.create({
      data: {
        name: item.name,
        categoryId: categoryRecords[item.cat],
        outletId: outlet.id,
        price: item.price,
        taxGroupId: gst5.id,
        foodType: item.cat.startsWith('Non-Veg') ? 'NON_VEG' : 'VEG',
        sortOrder: 1,
      },
    });
  }
  console.log('✅ Menu items created');

  // ---- Create sample discount ----
  await prisma.discount.create({
    data: {
      name: '10% Off',
      outletId: outlet.id,
      type: 'PERCENTAGE',
      value: 10,
    },
  });
  console.log('✅ Discounts created');

  console.log('\n🎉 Seed completed successfully!');
  console.log('---');
  console.log('Admin login: admin@lavishtown.com / admin123');
  console.log('Biller login: biller@lavishtown.com / biller123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
