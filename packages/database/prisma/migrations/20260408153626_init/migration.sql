-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'BILLER', 'CAPTAIN', 'KITCHEN');

-- CreateEnum
CREATE TYPE "FoodType" AS ENUM ('VEG', 'NON_VEG', 'EGG');

-- CreateEnum
CREATE TYPE "TableStatus" AS ENUM ('BLANK', 'RUNNING', 'PRINTED', 'PAID', 'RUNNING_KOT');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('DINE_IN', 'DELIVERY', 'PICK_UP', 'ONLINE', 'OTHER');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('SAVED', 'PRINTED', 'CANCELLED', 'COMPLIMENTARY', 'SALES_RETURN');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CASH', 'CARD', 'UPI', 'DUE', 'OTHER', 'NOT_PAID', 'SPLIT');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'PARTIAL', 'REFUNDED');

-- CreateEnum
CREATE TYPE "KOTStatus" AS ENUM ('PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TaxType" AS ENUM ('SGST', 'CGST', 'IGST', 'VAT', 'SERVICE_TAX');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED');

-- CreateEnum
CREATE TYPE "CashFlowType" AS ENUM ('TOP_UP', 'WITHDRAWAL', 'SALE', 'EXPENSE', 'REFUND');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'BILLER',
    "outletId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outlet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gstNumber" TEXT,
    "fssaiNumber" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displaySettings" JSONB NOT NULL DEFAULT '{}',
    "calculationSettings" JSONB NOT NULL DEFAULT '{}',
    "printSettings" JSONB NOT NULL DEFAULT '{}',
    "customerSettings" JSONB NOT NULL DEFAULT '{}',
    "onlineOrderSettings" JSONB NOT NULL DEFAULT '{}',
    "billingSystemSettings" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Outlet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "shortCode" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "taxGroupId" TEXT,
    "foodType" "FoodType" NOT NULL DEFAULT 'VEG',
    "description" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItemVariant" (
    "id" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MenuItemVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItemAddon" (
    "id" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "groupName" TEXT NOT NULL DEFAULT 'Add-ons',
    "isRequired" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MenuItemAddon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantTable" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "areaId" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 4,
    "status" "TableStatus" NOT NULL DEFAULT 'BLANK',
    "occupiedAt" TIMESTAMP(3),
    "currentOrderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" INTEGER NOT NULL,
    "outletId" TEXT NOT NULL,
    "billNumber" INTEGER NOT NULL,
    "orderType" "OrderType" NOT NULL,
    "orderStatus" "OrderStatus" NOT NULL DEFAULT 'SAVED',
    "tableId" TEXT,
    "areaType" TEXT,
    "customerId" TEXT,
    "billerId" TEXT NOT NULL,
    "billerName" TEXT NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deliveryCharge" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "containerCharge" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sgst" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cgst" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalTax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "roundOff" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tip" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalWithTip" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymentType" "PaymentType" NOT NULL DEFAULT 'NOT_PAID',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "printedAt" TIMESTAMP(3),
    "settledAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,
    "menuItemName" TEXT NOT NULL,
    "variantName" TEXT,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT NOT NULL DEFAULT '',
    "kotId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItemAddon" (
    "id" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "OrderItemAddon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KOT" (
    "id" TEXT NOT NULL,
    "kotNumber" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "KOTStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "printedAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "readyAt" TIMESTAMP(3),

    CONSTRAINT "KOT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TaxGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxRate" (
    "id" TEXT NOT NULL,
    "taxGroupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "type" "TaxType" NOT NULL,

    CONSTRAINT "TaxRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "method" "PaymentType" NOT NULL,
    "transactionId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "outletId" TEXT NOT NULL,
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "totalSpent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dueAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "type" "DiscountType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "minOrder" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "currentStock" DOUBLE PRECISION NOT NULL,
    "minStock" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "costPerUnit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastRestockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "date" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashFlow" (
    "id" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "type" "CashFlowType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "balanceAfter" DOUBLE PRECISION NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CashFlow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_outletId_idx" ON "User"("outletId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Outlet_refId_key" ON "Outlet"("refId");

-- CreateIndex
CREATE INDEX "MenuCategory_outletId_idx" ON "MenuCategory"("outletId");

-- CreateIndex
CREATE UNIQUE INDEX "MenuCategory_outletId_name_key" ON "MenuCategory"("outletId", "name");

-- CreateIndex
CREATE INDEX "MenuItem_categoryId_idx" ON "MenuItem"("categoryId");

-- CreateIndex
CREATE INDEX "MenuItem_outletId_idx" ON "MenuItem"("outletId");

-- CreateIndex
CREATE INDEX "MenuItemVariant_menuItemId_idx" ON "MenuItemVariant"("menuItemId");

-- CreateIndex
CREATE INDEX "MenuItemAddon_menuItemId_idx" ON "MenuItemAddon"("menuItemId");

-- CreateIndex
CREATE INDEX "Area_outletId_idx" ON "Area"("outletId");

-- CreateIndex
CREATE UNIQUE INDEX "Area_outletId_name_key" ON "Area"("outletId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantTable_currentOrderId_key" ON "RestaurantTable"("currentOrderId");

-- CreateIndex
CREATE INDEX "RestaurantTable_areaId_idx" ON "RestaurantTable"("areaId");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantTable_areaId_number_key" ON "RestaurantTable"("areaId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Order_tableId_key" ON "Order"("tableId");

-- CreateIndex
CREATE INDEX "Order_outletId_idx" ON "Order"("outletId");

-- CreateIndex
CREATE INDEX "Order_orderNumber_idx" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "Order_orderStatus_idx" ON "Order"("orderStatus");

-- CreateIndex
CREATE INDEX "Order_paymentType_idx" ON "Order"("paymentType");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_menuItemId_idx" ON "OrderItem"("menuItemId");

-- CreateIndex
CREATE INDEX "KOT_orderId_idx" ON "KOT"("orderId");

-- CreateIndex
CREATE INDEX "KOT_status_idx" ON "KOT"("status");

-- CreateIndex
CREATE INDEX "TaxGroup_outletId_idx" ON "TaxGroup"("outletId");

-- CreateIndex
CREATE UNIQUE INDEX "TaxGroup_outletId_name_key" ON "TaxGroup"("outletId", "name");

-- CreateIndex
CREATE INDEX "TaxRate_taxGroupId_idx" ON "TaxRate"("taxGroupId");

-- CreateIndex
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");

-- CreateIndex
CREATE INDEX "Customer_outletId_idx" ON "Customer"("outletId");

-- CreateIndex
CREATE INDEX "Customer_phone_idx" ON "Customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_outletId_phone_key" ON "Customer"("outletId", "phone");

-- CreateIndex
CREATE INDEX "Discount_outletId_idx" ON "Discount"("outletId");

-- CreateIndex
CREATE INDEX "InventoryItem_outletId_idx" ON "InventoryItem"("outletId");

-- CreateIndex
CREATE INDEX "Expense_outletId_idx" ON "Expense"("outletId");

-- CreateIndex
CREATE INDEX "Expense_date_idx" ON "Expense"("date");

-- CreateIndex
CREATE INDEX "CashFlow_outletId_idx" ON "CashFlow"("outletId");

-- CreateIndex
CREATE INDEX "CashFlow_createdAt_idx" ON "CashFlow"("createdAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_outletId_fkey" FOREIGN KEY ("outletId") REFERENCES "Outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuCategory" ADD CONSTRAINT "MenuCategory_outletId_fkey" FOREIGN KEY ("outletId") REFERENCES "Outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MenuCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_outletId_fkey" FOREIGN KEY ("outletId") REFERENCES "Outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_taxGroupId_fkey" FOREIGN KEY ("taxGroupId") REFERENCES "TaxGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItemVariant" ADD CONSTRAINT "MenuItemVariant_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItemAddon" ADD CONSTRAINT "MenuItemAddon_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Area" ADD CONSTRAINT "Area_outletId_fkey" FOREIGN KEY ("outletId") REFERENCES "Outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantTable" ADD CONSTRAINT "RestaurantTable_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_outletId_fkey" FOREIGN KEY ("outletId") REFERENCES "Outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "RestaurantTable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_billerId_fkey" FOREIGN KEY ("billerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_kotId_fkey" FOREIGN KEY ("kotId") REFERENCES "KOT"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItemAddon" ADD CONSTRAINT "OrderItemAddon_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KOT" ADD CONSTRAINT "KOT_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxGroup" ADD CONSTRAINT "TaxGroup_outletId_fkey" FOREIGN KEY ("outletId") REFERENCES "Outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxRate" ADD CONSTRAINT "TaxRate_taxGroupId_fkey" FOREIGN KEY ("taxGroupId") REFERENCES "TaxGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_outletId_fkey" FOREIGN KEY ("outletId") REFERENCES "Outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_outletId_fkey" FOREIGN KEY ("outletId") REFERENCES "Outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_outletId_fkey" FOREIGN KEY ("outletId") REFERENCES "Outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_outletId_fkey" FOREIGN KEY ("outletId") REFERENCES "Outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashFlow" ADD CONSTRAINT "CashFlow_outletId_fkey" FOREIGN KEY ("outletId") REFERENCES "Outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashFlow" ADD CONSTRAINT "CashFlow_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
