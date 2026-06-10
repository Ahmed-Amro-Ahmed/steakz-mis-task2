import bcrypt from 'bcryptjs';
import prisma from './prisma.js';

export async function seedDatabase(): Promise<void> {
  // 1. Seed 5 Branches
  const branchesData = [
    { name: 'London Central', location: '123 Leicester Square, London', phone: '020 7123 4567' },
    { name: 'Manchester North', location: '45 Deansgate, Manchester', phone: '0161 234 5678' },
    { name: 'Birmingham Bullring', location: 'Bullring Shopping Centre, Birmingham', phone: '0121 345 6789' },
    { name: 'Edinburgh Royal Mile', location: '18 Royal Mile, Edinburgh', phone: '0131 456 7890' },
    { name: 'Cardiff Bay', location: 'Mermaid Quay, Cardiff', phone: '029 5678 9012' },
  ];

  const branches = [];
  for (const b of branchesData) {
    const branch = await prisma.branch.upsert({
      where: { id: branchesData.indexOf(b) + 1 },
      update: b,
      create: { id: branchesData.indexOf(b) + 1, ...b },
    });
    branches.push(branch);
  }
  console.log(`[Seeder] 5 Branches ensured.`);

  // 2. Define Users for each role
  const users = [
    { email: 'admin@steakz.com', name: 'Steakz Admin', password: 'Admin@123', role: 'ADMIN' as const, branchId: null },
    { email: 'hq@steakz.com', name: 'HQ Manager Sarah', password: 'Hq@123', role: 'HEADQUARTER_MANAGER' as const, branchId: null },
    
    // London Central (Branch 1) - Original Demo Users
    { email: 'manager@steakz.com', name: 'London Manager Joe', password: 'Manager@123', role: 'BRANCH_MANAGER' as const, branchId: branches[0]!.id },
    { email: 'chef@steakz.com', name: 'Head Chef Marco', password: 'Chef@123', role: 'CHEF' as const, branchId: branches[0]!.id },
    { email: 'cashier@steakz.com', name: 'Cashier Linda', password: 'Cashier@123', role: 'CASHIER' as const, branchId: branches[0]!.id },
    { email: 'waiter@steakz.com', name: 'Waiter Tom', password: 'Waiter@123', role: 'WAITER' as const, branchId: branches[0]!.id },
    
    // New Managers for other branches
    { email: 'manchester.manager@steakz.com', name: 'Manchester Manager Mike', password: 'Manager@123', role: 'BRANCH_MANAGER' as const, branchId: branches[1]!.id },
    { email: 'birmingham.manager@steakz.com', name: 'Birmingham Manager Bill', password: 'Manager@123', role: 'BRANCH_MANAGER' as const, branchId: branches[2]!.id },
    { email: 'edinburgh.manager@steakz.com', name: 'Edinburgh Manager Ewan', password: 'Manager@123', role: 'BRANCH_MANAGER' as const, branchId: branches[3]!.id },
    { email: 'cardiff.manager@steakz.com', name: 'Cardiff Manager Ceri', password: 'Manager@123', role: 'BRANCH_MANAGER' as const, branchId: branches[4]!.id },

    // Manchester Staff
    { email: 'manchester.chef@steakz.com', name: 'Manchester Chef Tony', password: 'Chef@123', role: 'CHEF' as const, branchId: branches[1]!.id },
    { email: 'manchester.cashier@steakz.com', name: 'Manchester Cashier Sue', password: 'Cashier@123', role: 'CASHIER' as const, branchId: branches[1]!.id },
    { email: 'manchester.waiter@steakz.com', name: 'Manchester Waiter Dan', password: 'Waiter@123', role: 'WAITER' as const, branchId: branches[1]!.id },

    // Birmingham Staff
    { email: 'birmingham.chef@steakz.com', name: 'Birmingham Chef Sarah', password: 'Chef@123', role: 'CHEF' as const, branchId: branches[2]!.id },
    { email: 'birmingham.cashier@steakz.com', name: 'Birmingham Cashier Mo', password: 'Cashier@123', role: 'CASHIER' as const, branchId: branches[2]!.id },
    { email: 'birmingham.waiter@steakz.com', name: 'Birmingham Waiter Amy', password: 'Waiter@123', role: 'WAITER' as const, branchId: branches[2]!.id },

    // Edinburgh Staff
    { email: 'edinburgh.chef@steakz.com', name: 'Edinburgh Chef Ian', password: 'Chef@123', role: 'CHEF' as const, branchId: branches[3]!.id },
    { email: 'edinburgh.cashier@steakz.com', name: 'Edinburgh Cashier Jen', password: 'Cashier@123', role: 'CASHIER' as const, branchId: branches[3]!.id },
    { email: 'edinburgh.waiter@steakz.com', name: 'Edinburgh Waiter Ken', password: 'Waiter@123', role: 'WAITER' as const, branchId: branches[3]!.id },

    // Cardiff Staff
    { email: 'cardiff.chef@steakz.com', name: 'Cardiff Chef Huw', password: 'Chef@123', role: 'CHEF' as const, branchId: branches[4]!.id },
    { email: 'cardiff.cashier@steakz.com', name: 'Cardiff Cashier Nia', password: 'Cashier@123', role: 'CASHIER' as const, branchId: branches[4]!.id },
    { email: 'cardiff.waiter@steakz.com', name: 'Cardiff Waiter Rhys', password: 'Waiter@123', role: 'WAITER' as const, branchId: branches[4]!.id },

    { email: 'customer@gmail.com', name: 'John Customer', password: 'Customer@123', role: 'CUSTOMER' as const, branchId: null },
  ];

  for (const u of users) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        password: hashedPassword,
        role: u.role,
        branchId: u.branchId,
        isActive: true,
      },
      create: {
        email: u.email,
        name: u.name,
        password: hashedPassword,
        role: u.role,
        branchId: u.branchId,
        isActive: true,
      },
    });
    console.log(`[Seeder] User ensured: ${u.email} (${u.role})`);
  }

  // 4. Seed Suppliers
  const supplier = await prisma.supplier.upsert({
    where: { id: 1 },
    update: { name: 'Prime Meats Ltd', contact: 'John Butcher', email: 'sales@primemeats.co.uk' },
    create: { id: 1, name: 'Prime Meats Ltd', contact: 'John Butcher', email: 'sales@primemeats.co.uk' },
  });

  // 5. Seed Inventory Items for ALL branches
  const baseItems = [
    { name: 'Ribeye Steak', category: 'Meat', unit: 'kg', reorderLevel: 10, costPerUnit: 15.50 },
    { name: 'Sirloin Steak', category: 'Meat', unit: 'kg', reorderLevel: 10, costPerUnit: 14.00 },
    { name: 'Potato Sacks', category: 'Veg', unit: 'bag', reorderLevel: 20, costPerUnit: 5.00 },
  ];

  let itemGlobalIndex = 1;
  for (const branch of branches) {
    for (const baseItem of baseItems) {
      // London Central (branch 1) gets lower stock for "Ribeye" to show the alert
      let quantity = 50; 
      if (branch.id === 1 && baseItem.name === 'Ribeye Steak') {
        quantity = 5; // Low stock!
      } else if (branch.id !== 1) {
        quantity = 25 + (branch.id * 2); // Vary slightly
      }

      await prisma.inventoryItem.upsert({
        where: { id: itemGlobalIndex },
        update: { ...baseItem, quantity, branchId: branch.id, supplierId: supplier.id },
        create: { id: itemGlobalIndex, ...baseItem, quantity, branchId: branch.id, supplierId: supplier.id },
      });
      itemGlobalIndex++;
    }
  }
  console.log(`[Seeder] Inventory seeded for all ${branches.length} branches.`);

  // 6. Seed sample feedback
  const feedbackExists = await prisma.customerFeedback.count();
  if (feedbackExists === 0) {
    await prisma.customerFeedback.createMany({
      data: [
        { customerName: 'Alice', rating: 5, comment: 'Amazing steak!', branchId: branches[0]!.id },
        { customerName: 'Bob', rating: 4, comment: 'Good service.', branchId: branches[1]!.id },
      ],
    });
  }

  // 7. Seed sample sales for ALL branches
  const totalSalesCount = await prisma.sale.count();
  if (totalSalesCount === 0) {
    console.log('[Seeder] Seeding initial sales activity for all branches...');
    
    // London Central (Branch 1) - Detailed Demo Data
    const ldnItems = await prisma.inventoryItem.findMany({ where: { branchId: branches[0]!.id } });
    const ldnManager = await prisma.user.findFirst({ where: { email: 'manager@steakz.com' } });
    
    if (ldnItems.length > 0 && ldnManager) {
      await prisma.sale.create({
        data: {
          orderNumber: `STK-DEMO-1`,
          branchId: branches[0]!.id,
          createdById: ldnManager.id,
          status: 'PENDING',
          totalAmount: 42.50,
          items: {
            create: [
              { menuItem: 'Ribeye Steak', quantity: 1, unitPrice: 28.50, lineTotal: 28.50, itemId: ldnItems[0]!.id },
              { menuItem: 'Classic Sirloin', quantity: 1, unitPrice: 14.00, lineTotal: 14.00, itemId: ldnItems[1]!.id }
            ]
          }
        }
      });
      await prisma.sale.create({
        data: {
          orderNumber: `STK-DEMO-2`,
          branchId: branches[0]!.id,
          createdById: ldnManager.id,
          status: 'PREPARING',
          totalAmount: 18.99,
          items: {
            create: [{ menuItem: 'Steak Meal', quantity: 1, unitPrice: 18.99, lineTotal: 18.99 }]
          }
        }
      });
    }

    // Other Branches (2-5) - Basic Operational Activity
    const staffEmails = [
      'manchester.waiter@steakz.com',
      'birmingham.waiter@steakz.com',
      'edinburgh.waiter@steakz.com',
      'cardiff.waiter@steakz.com'
    ];

    for (let i = 0; i < staffEmails.length; i++) {
      const branchId = i + 2; // Branches 2, 3, 4, 5
      const waiter = await prisma.user.findUnique({ where: { email: staffEmails[i] } });
      const items = await prisma.inventoryItem.findMany({ where: { branchId } });

      if (waiter && items.length > 0) {
        await prisma.sale.create({
          data: {
            orderNumber: `STK-EXT-${branchId}`,
            branchId,
            createdById: waiter.id,
            status: 'COMPLETED',
            totalAmount: 24.50 + (i * 3.25),
            items: {
              create: [{ menuItem: 'Standard Ribeye', quantity: 1, unitPrice: 24.50 + (i * 3.25), lineTotal: 24.50 + (i * 3.25), itemId: items[0]!.id }]
            }
          }
        });
      }
    }
    console.log('[Seeder] Global sales activity established.');
  }
}
