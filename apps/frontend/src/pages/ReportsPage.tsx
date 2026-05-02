import { useState, Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import { useOrderStore } from '@/store/Order.store';
import { BarChart3, Download, Printer, Search, Calendar, ChevronDown, ChevronRight, Settings2 } from 'lucide-react';

// Alias to avoid conflict with lucide ChevronDown used elsewhere
const ChevronDown2 = ChevronDown;

const REPORT_TITLES: Record<string, string> = {
  'category-summary': 'Category Summary',
  'item-summary': 'Item Summary',
  'sales-summary': 'Sales Summary',
  'order-summary': 'Order Summary',
  'executive-sales-summary': 'Executive Sales Summary',
  'employee-summary': 'Employee Summary',
  'group-summary': 'Group Summary',
  'variation-summary': 'Variation Summary',
  'cover-size-summary': 'Cover Size Summary',
  'tip-summary': 'Tip Summary',
  'counter-summary': 'Counter Summary',
  'locality-wise-summary': 'Locality Wise Summary',
  'captain-wise-summary': 'Captain Wise Summary',
  'nc-item-summary': 'NC Item Summary',
  'assignee-wise-summary': 'Assignee Wise Summary',
};

function formatDate(date: Date): string {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}

function todayStr(): string {
  return formatDate(new Date());
}

export default function ReportsPage() {
  const location = useLocation();
  const completedOrders = useOrderStore((s) => s.completedOrders);

  // Extract report type from URL
  const pathParts = location.pathname.split('/reports/');
  const reportSlug = pathParts[1] || '';
  const reportTitle = REPORT_TITLES[reportSlug] || '';

  // If no specific report selected, show the report index
  if (!reportTitle) {
    return <ReportIndex />;
  }

  // Generate report data based on type
  if (reportSlug === 'category-summary') {
    return <CategorySummaryReport orders={completedOrders} />;
  }
  if (reportSlug === 'item-summary') {
    return <ItemSummaryReport orders={completedOrders} />;
  }
  if (reportSlug === 'sales-summary') {
    return <SalesSummaryReport orders={completedOrders} />;
  }
  if (reportSlug === 'order-summary') {
    return <OrderSummaryReport orders={completedOrders} />;
  }

  // Placeholder for other reports
  return (
    <div className="h-full flex flex-col">
      <ReportHeader title={reportTitle} />
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <BarChart3 size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium text-lg">{reportTitle}</p>
          <p className="text-sm mt-1">This report will be available soon</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SHARED COMPONENTS
// ============================================
function ReportHeader({ title }: { title: string }) {
  return (
    <div className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          <p className="text-xs text-gray-400 mt-0.5">{title} : From {todayStr()}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 text-sm border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50">
            <Calendar size={14} /> Today
          </button>
          <button className="flex items-center gap-1 text-sm border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50">
            <Search size={14} /> Search
          </button>
          <button className="flex items-center gap-1 text-sm border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50">
            <Printer size={14} /> Print
          </button>
          <button className="flex items-center gap-1 text-sm bg-brand-green text-white rounded px-3 py-1.5 hover:opacity-90">
            <Download size={14} /> Export Excel
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportIndex() {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Select a report from the sidebar menu</p>
      </div>
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <BarChart3 size={64} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">Select a Report</p>
          <p className="text-sm mt-1">Open the sidebar and expand Reports to choose</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CATEGORY SUMMARY (matching Image 8)
// ============================================
function CategorySummaryReport({ orders }: { orders: any[] }) {
  // Aggregate by category (using item name prefix as mock category)
  const categoryMap: Record<string, { orders: number; items: number; netAmount: number; tax: number }> = {};

  orders.forEach((order) => {
    order.items.forEach((item: any) => {
      // Derive category from item name (simplified)
      const cat = item.name.includes('Coffee') || item.name.includes('Latte') || item.name.includes('Espresso')
        ? 'Coffee'
        : item.name.includes('Shake') ? 'Milk Shake'
        : item.name.includes('Pasta') ? 'Veg Pasta'
        : item.name.includes('Pizza') ? 'Veg Pizza'
        : item.name.includes('Sandwich') ? 'Sandwich'
        : item.name.includes('Mojito') || item.name.includes('Lagoon') ? 'Mocktail'
        : item.name.includes('Tikka') || item.name.includes('Wings') ? 'Appetizers'
        : 'Other';

      if (!categoryMap[cat]) {
        categoryMap[cat] = { orders: 0, items: 0, netAmount: 0, tax: 0 };
      }
      categoryMap[cat].orders += 1;
      categoryMap[cat].items += item.quantity;
      categoryMap[cat].netAmount += item.price * item.quantity;
    });
  });

  // Calculate tax for each
  const categories = Object.entries(categoryMap).map(([name, data]) => {
    const tax = Math.round(data.netAmount * 0.05 * 100) / 100;
    const totalSales = data.netAmount + tax;
    return { name, ...data, tax, totalSales };
  });

  const grandTotal = categories.reduce(
    (acc, c) => ({
      orders: acc.orders + c.orders,
      items: acc.items + c.items,
      netAmount: acc.netAmount + c.netAmount,
      tax: acc.tax + c.tax,
      totalSales: acc.totalSales + c.totalSales,
    }),
    { orders: 0, items: 0, netAmount: 0, tax: 0, totalSales: 0 }
  );

  return (
    <div className="h-full flex flex-col">
      <ReportHeader title="Category Report" />
      <div className="flex-1 overflow-auto p-6">
        <table className="w-full bg-white rounded-lg border overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-right px-4 py-3">Orders</th>
              <th className="text-right px-4 py-3">Items</th>
              <th className="text-right px-4 py-3">Net Amount (₹)</th>
              <th className="text-right px-4 py-3">Total Tax (₹)</th>
              <th className="text-right px-4 py-3">Total Sales (₹)</th>
              <th className="text-right px-4 py-3">Percentage (%)</th>
            </tr>
          </thead>
          <tbody>
            {/* Grand total row */}
            <tr className="bg-gray-50 font-bold text-sm border-b-2">
              <td className="px-4 py-3">Total</td>
              <td className="text-right px-4 py-3">{grandTotal.orders}</td>
              <td className="text-right px-4 py-3">{grandTotal.items}</td>
              <td className="text-right px-4 py-3">{grandTotal.netAmount.toFixed(2)}</td>
              <td className="text-right px-4 py-3">{grandTotal.tax.toFixed(2)}</td>
              <td className="text-right px-4 py-3">{grandTotal.totalSales.toFixed(2)}</td>
              <td className="text-right px-4 py-3">-</td>
            </tr>
            {categories.map((cat) => (
              <tr key={cat.name} className="text-sm border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800">{cat.name}</td>
                <td className="text-right px-4 py-3">{cat.orders}</td>
                <td className="text-right px-4 py-3">{cat.items}</td>
                <td className="text-right px-4 py-3">{cat.netAmount.toFixed(2)}</td>
                <td className="text-right px-4 py-3">{cat.tax.toFixed(2)}</td>
                <td className="text-right px-4 py-3">{cat.totalSales.toFixed(2)}</td>
                <td className="text-right px-4 py-3">
                  {grandTotal.totalSales > 0
                    ? ((cat.totalSales / grandTotal.totalSales) * 100).toFixed(2)
                    : '0.00'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No orders yet. Settle some tables to see category data.
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// ITEM SUMMARY
// ============================================
function ItemSummaryReport({ orders }: { orders: any[] }) {
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Map items to categories
  function getCategory(itemName: string): string {
    if (itemName.includes('Coffee') || itemName.includes('Latte') || itemName.includes('Espresso') || itemName.includes('Mocha') || itemName.includes('Macchiato') || itemName.includes('Cappuccino') || itemName.includes('Americano') || itemName.includes('Affogato')) return 'Hot Coffee';
    if (itemName.includes('Frappe') || itemName.includes('Cold Brew')) return 'Cold Coffee';
    if (itemName.includes('Shake')) return 'Milk Shake';
    if (itemName.includes('Pasta') || itemName.includes('Arrabiata') || itemName.includes('Alfredo')) return 'Veg Pasta';
    if (itemName.includes('Pizza') || itemName.includes('Margherita')) return 'Veg Pizza';
    if (itemName.includes('Sandwich')) return 'Non-Veg Sandwich';
    if (itemName.includes('Mojito') || itemName.includes('Lagoon')) return 'Mocktail';
    if (itemName.includes('Tikka')) return 'Veg Appetizers';
    if (itemName.includes('Wings')) return 'Non-Veg Appetizers';
    return 'Other';
  }

  // Build grouped data: category -> items[]
  const categoryMap: Record<string, { name: string; code: string; quantity: number; total: number }[]> = {};

  orders.forEach((order) => {
    order.items.forEach((item: any) => {
      const cat = getCategory(item.name);
      if (!categoryMap[cat]) categoryMap[cat] = [];

      const existing = categoryMap[cat].find((i) => i.name === item.name);
      if (existing) {
        existing.quantity += item.quantity;
        existing.total += item.price * item.quantity;
      } else {
        categoryMap[cat].push({
          name: item.name,
          code: '',
          quantity: item.quantity,
          total: item.price * item.quantity,
        });
      }
    });
  });

  // Grand totals
  let grandQty = 0;
  let grandTotal = 0;
  Object.values(categoryMap).forEach((items) => {
    items.forEach((item) => {
      grandQty += item.quantity;
      grandTotal += item.total;
    });
  });

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with controls matching screenshot */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 text-sm border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50">
              <Search size={14} /> Search
              <ChevronDown size={12} />
            </button>
            <button className="flex items-center gap-1 text-sm border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50">
              <Settings2 size={14} /> Configure Column
              <ChevronDown size={12} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-sm border border-gray-300 rounded px-4 py-1.5 hover:bg-gray-50">
              Time Wise
            </button>
            <button className="flex items-center gap-1 text-sm border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50">
              <Printer size={14} /> Print
            </button>
            <button className="flex items-center gap-1 text-sm border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50">
              <Download size={14} /> Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Report content */}
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-2 text-xs text-gray-400">
          Item Report : From {todayStr()}
        </div>

        <table className="w-full">
          {/* Column headers */}
          <thead>
            <tr className="text-xs font-semibold text-gray-500 border-b bg-white sticky top-0">
              <th className="text-left px-6 py-3 w-1/3">Category</th>
              <th className="text-left px-4 py-3 w-1/3">Item</th>
              <th className="text-left px-4 py-3">Code</th>
              <th className="text-right px-4 py-3">Qty.</th>
              <th className="text-right px-6 py-3">Total (₹)</th>
            </tr>
          </thead>

          <tbody>
            {/* Grand total row */}
            <tr className="bg-gray-100 font-bold text-sm border-b">
              <td className="px-6 py-3">Total</td>
              <td className="px-4 py-3 text-gray-400">-</td>
              <td className="px-4 py-3 text-gray-400">-</td>
              <td className="text-right px-4 py-3">{grandQty.toFixed(2)}</td>
              <td className="text-right px-6 py-3">{grandTotal.toFixed(2)}</td>
            </tr>

            {/* Category groups */}
            {Object.entries(categoryMap).map(([category, items]) => {
              const catQty = items.reduce((sum, i) => sum + i.quantity, 0);
              const catTotal = items.reduce((sum, i) => sum + i.total, 0);
              const isCollapsed = collapsedCategories[category];

              return (
                <Fragment key={category}>
                  {/* Category header row */}
                  <tr
                    className="bg-white border-b cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleCategory(category)}
                  >
                    <td className="px-6 py-3" colSpan={5}>
                      <div className="flex items-center gap-2">
                        {isCollapsed ? (
                          <ChevronRight size={16} className="text-gray-400" />
                        ) : (
                          <ChevronDown2 size={16} className="text-gray-400" />
                        )}
                        <span className="font-semibold text-sm text-gray-800">{category}</span>
                      </div>
                    </td>
                  </tr>

                  {/* Item rows */}
                  {!isCollapsed && items.map((item, idx) => (
                    <tr key={`${category}-${idx}`} className="text-sm border-b bg-white hover:bg-gray-50">
                      <td className="px-6 py-3"></td>
                      <td className="px-4 py-3 text-gray-700">{item.name}</td>
                      <td className="px-4 py-3 text-gray-400">{item.code || ''}</td>
                      <td className="text-right px-4 py-3">{item.quantity.toFixed(2)}</td>
                      <td className="text-right px-6 py-3">{item.total.toFixed(2)}</td>
                    </tr>
                  ))}

                  {/* Sub Total row */}
                  {!isCollapsed && (
                    <tr className="bg-red-50 text-sm font-semibold border-b">
                      <td className="px-6 py-2 text-gray-600">Sub Total</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2"></td>
                      <td className="text-right px-4 py-2">{catQty.toFixed(2)}</td>
                      <td className="text-right px-6 py-2">{catTotal.toFixed(2)}</td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>

        {Object.keys(categoryMap).length === 0 && (
          <div className="text-center py-16 text-gray-400">
            No orders yet. Settle some tables to see item data.
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// SALES SUMMARY (matching Image 7)
// ============================================
function SalesSummaryReport({ orders }: { orders: any[] }) {
  const grandTotal = orders.reduce(
    (acc, o) => ({
      subtotal: acc.subtotal + o.subtotal,
      sgst: acc.sgst + o.sgst,
      cgst: acc.cgst + o.cgst,
      total: acc.total + o.total,
    }),
    { subtotal: 0, sgst: 0, cgst: 0, total: 0 }
  );

  return (
    <div className="h-full flex flex-col">
      <ReportHeader title="Sales Report" />
      <div className="flex-1 overflow-auto p-6">
        <table className="w-full bg-white rounded-lg border overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
              <th className="text-left px-4 py-3">Order No.</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Payment</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Area</th>
              <th className="text-right px-4 py-3">My Amount (₹)</th>
              <th className="text-right px-4 py-3">SGST (₹)</th>
              <th className="text-right px-4 py-3">CGST (₹)</th>
              <th className="text-right px-4 py-3">Total (₹)</th>
              <th className="text-left px-4 py-3">Biller</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-50 font-bold text-sm border-b-2">
              <td className="px-4 py-3" colSpan={5}>Total</td>
              <td className="text-right px-4 py-3">{grandTotal.subtotal.toFixed(2)}</td>
              <td className="text-right px-4 py-3">{grandTotal.sgst.toFixed(2)}</td>
              <td className="text-right px-4 py-3">{grandTotal.cgst.toFixed(2)}</td>
              <td className="text-right px-4 py-3">{grandTotal.total.toFixed(2)}</td>
              <td className="px-4 py-3"></td>
            </tr>
            {orders.map((order) => (
              <tr key={order.id} className="text-sm border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(order.settledAt)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    order.paymentMethod === 'Cash' ? 'bg-green-100 text-green-700'
                    : order.paymentMethod === 'Card' ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                  }`}>{order.paymentMethod}</span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  Dine In ({order.tableNumber})
                </td>
                <td className="px-4 py-3 text-gray-600">{order.areaName}</td>
                <td className="text-right px-4 py-3">{order.subtotal.toFixed(2)}</td>
                <td className="text-right px-4 py-3">{order.sgst.toFixed(2)}</td>
                <td className="text-right px-4 py-3">{order.cgst.toFixed(2)}</td>
                <td className="text-right px-4 py-3 font-medium">{order.total.toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-500">{order.billerName}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="text-center py-12 text-gray-400">No orders yet.</div>
        )}
      </div>
    </div>
  );
}

// ============================================
// ORDER SUMMARY (matching Image 2)
// ============================================
function OrderSummaryReport({ orders }: { orders: any[] }) {
  const paymentBreakdown: Record<string, { count: number; total: number }> = {};

  orders.forEach((order) => {
    const method = order.paymentMethod;
    if (!paymentBreakdown[method]) {
      paymentBreakdown[method] = { count: 0, total: 0 };
    }
    paymentBreakdown[method].count += 1;
    paymentBreakdown[method].total += order.total;
  });

  const totalAmount = orders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalWithTax = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="h-full flex flex-col">
      <ReportHeader title="Order Summary Report" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Order Status */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <h3 className="text-sm font-semibold text-gray-700 px-4 py-3 bg-gray-50 border-b">Order Status</h3>
          <table className="w-full">
            <thead>
              <tr className="text-xs font-semibold text-gray-500 uppercase border-b">
                <th className="text-left px-4 py-2">Order Status</th>
                <th className="text-right px-4 py-2">My Amount (₹)</th>
                <th className="text-right px-4 py-2">Total (₹)</th>
                <th className="text-right px-4 py-2">Orders</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-sm border-b">
                <td className="px-4 py-3">Printed:</td>
                <td className="text-right px-4 py-3">{totalAmount.toFixed(2)}</td>
                <td className="text-right px-4 py-3">{totalWithTax.toFixed(2)}</td>
                <td className="text-right px-4 py-3">{orders.length}</td>
              </tr>
              <tr className="text-sm border-b bg-gray-50">
                <td className="px-4 py-3">Cancelled:</td>
                <td className="text-right px-4 py-3">0.00</td>
                <td className="text-right px-4 py-3">0.00</td>
                <td className="text-right px-4 py-3">0</td>
              </tr>
              <tr className="text-sm font-bold border-t-2">
                <td className="px-4 py-3">Total:</td>
                <td className="text-right px-4 py-3">{totalAmount.toFixed(2)}</td>
                <td className="text-right px-4 py-3">{totalWithTax.toFixed(2)}</td>
                <td className="text-right px-4 py-3">{orders.length}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Breakdown */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <h3 className="text-sm font-semibold text-gray-700 px-4 py-3 bg-gray-50 border-b">
            Success Orders ({orders.length})
          </h3>
          <table className="w-full">
            <thead>
              <tr className="text-xs font-semibold text-gray-500 uppercase border-b">
                <th className="text-left px-4 py-2">Payment Type</th>
                <th className="text-right px-4 py-2">Orders</th>
                <th className="text-right px-4 py-2">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(paymentBreakdown).map(([method, data]) => (
                <tr key={method} className="text-sm border-b">
                  <td className="px-4 py-3">{method}:</td>
                  <td className="text-right px-4 py-3">{data.count}</td>
                  <td className="text-right px-4 py-3">{data.total.toFixed(2)}</td>
                </tr>
              ))}
              {Object.keys(paymentBreakdown).length === 0 && (
                <tr className="text-sm">
                  <td className="px-4 py-3 text-gray-400" colSpan={3}>No payments yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}