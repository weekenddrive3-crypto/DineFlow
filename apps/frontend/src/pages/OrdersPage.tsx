import { useState, useMemo } from 'react';
import { useOrderStore, CompletedOrder } from '@/store/Order.store'
import {
  Search, Filter, ChevronDown, ChevronUp, Utensils, Truck,
  ShoppingBag, Wifi, ChevronLeft, ChevronRight,
} from 'lucide-react';

type OrderFilter = 'All' | 'Dine In' | 'Delivery' | 'Pick Up' | 'Online';

const ORDER_TYPE_MAP: Record<string, OrderFilter> = {
  dineIn: 'Dine In',
  delivery: 'Delivery',
  pickUp: 'Pick Up',
};

function formatDateShort(date: Date): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

function formatDateInput(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function isSameDay(d1: Date, d2: Date): boolean {
  const a = new Date(d1);
  const b = new Date(d2);
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function getDayLabel(date: Date): string {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';

  return new Date(date).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Get all unique dates from orders
function getUniqueDates(orders: CompletedOrder[]): string[] {
  const dateSet = new Set<string>();
  orders.forEach((o) => {
    dateSet.add(formatDateInput(new Date(o.settledAt)));
  });
  return Array.from(dateSet).sort().reverse();
}

export default function OrdersPage() {
  const completedOrders = useOrderStore((s) => s.completedOrders);
  const [activeFilter, setActiveFilter] = useState<OrderFilter>('All');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(formatDateInput(new Date()));
  

  const uniqueDates = useMemo(() => getUniqueDates(completedOrders), [completedOrders]);

  // Count orders per date for the date list
  const orderCountByDate = useMemo(() => {
    const map: Record<string, number> = {};
    completedOrders.forEach((o) => {
      const key = formatDateInput(new Date(o.settledAt));
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [completedOrders]);

  const filters: { key: OrderFilter; icon: React.ElementType }[] = [
    { key: 'All', icon: Filter },
    { key: 'Dine In', icon: Utensils },
    { key: 'Delivery', icon: Truck },
    { key: 'Pick Up', icon: ShoppingBag },
    { key: 'Online', icon: Wifi },
  ];

  // Filter by date first, then by type and search
  const filteredOrders = useMemo(() => {
    return completedOrders.filter((order) => {
      // Date filter
      const orderDate = formatDateInput(new Date(order.settledAt));
      if (orderDate !== selectedDate) return false;

      // Type filter
      if (activeFilter !== 'All') {
        const orderTypeLabel = ORDER_TYPE_MAP[order.orderType];
        if (orderTypeLabel !== activeFilter) return false;
      }

      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          order.orderNumber.toString().includes(q) ||
          order.tableNumber.toString().includes(q) ||
          order.paymentMethod.toLowerCase().includes(q) ||
          order.items.some((item) => item.name.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [completedOrders, selectedDate, activeFilter, searchQuery]);

  // Summary stats for selected date
  const totalSales = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = filteredOrders.length;
  const cashOrders = filteredOrders.filter((o) => o.paymentMethod === 'Cash');
  const cardOrders = filteredOrders.filter((o) => o.paymentMethod === 'Card');
  const upiOrders = filteredOrders.filter((o) => o.paymentMethod === 'UPI');

  // Navigate dates
  const goToPrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(formatDateInput(d));
  };
  const goToNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    const today = new Date();
    if (d <= today) setSelectedDate(formatDateInput(d));
  };
  const goToToday = () => {
    setSelectedDate(formatDateInput(new Date()));
  };

  const selectedDateObj = new Date(selectedDate);
  const isToday = isSameDay(selectedDateObj, new Date());

  return (
    <div className="h-full flex bg-gray-50">
      {/* LEFT: Date sidebar */}
      <div className="w-56 bg-white border-r flex flex-col shrink-0">
        <div className="px-4 py-3 border-b">
          <h3 className="text-sm font-semibold text-gray-700">Order History</h3>
          <p className="text-xs text-gray-400 mt-0.5">Select a date to view orders</p>
        </div>

        {/* Quick date buttons */}
        <div className="px-3 py-2 border-b flex gap-2">
          <button
            onClick={goToToday}
            className={`flex-1 text-xs py-1.5 rounded font-medium ${
              isToday ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => {
              const d = new Date();
              d.setDate(d.getDate() - 1);
              setSelectedDate(formatDateInput(d));
            }}
            className="flex-1 text-xs py-1.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium"
          >
            Yesterday
          </button>
        </div>

        {/* Date input */}
        <div className="px-3 py-2 border-b">
          <input
            type="date"
            value={selectedDate}
            max={formatDateInput(new Date())}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
          />
        </div>

        {/* Date list with order counts */}
        <div className="flex-1 overflow-y-auto">
          {uniqueDates.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-400 text-xs">
              No order history yet
            </div>
          ) : (
            uniqueDates.map((dateStr) => {
              const d = new Date(dateStr);
              const isSelected = dateStr === selectedDate;
              const count = orderCountByDate[dateStr] || 0;

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`w-full text-left px-4 py-3 border-b flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-red-50 border-l-4 border-l-brand-red'
                      : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                  }`}
                >
                  <div>
                    <div className={`text-sm font-medium ${isSelected ? 'text-brand-red' : 'text-gray-700'}`}>
                      {getDayLabel(d)}
                    </div>
                    <div className="text-xs text-gray-400">{formatDateShort(d)}</div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT: Orders content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-800">Orders</h1>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <button onClick={goToPrevDay} className="p-1 hover:bg-gray-100 rounded">
                  <ChevronLeft size={16} />
                </button>
                <span className="px-2 font-medium text-gray-700">
                  {getDayLabel(selectedDateObj)} — {formatDateShort(selectedDateObj)}
                </span>
                <button
                  onClick={goToNextDay}
                  disabled={isToday}
                  className={`p-1 rounded ${isToday ? 'text-gray-300' : 'hover:bg-gray-100'}`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded px-3 py-1.5">
                <Search size={14} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-sm outline-none w-48 bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="bg-white border-b px-6 py-3 flex items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === f.key
                  ? 'bg-brand-red text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <f.icon size={16} />
              {f.key}
            </button>
          ))}
        </div>

        {/* Summary cards */}
        <div className="px-6 py-4 grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <p className="text-xs text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-xs text-gray-500">Total Sales</p>
            <p className="text-2xl font-bold text-brand-green mt-1">₹{totalSales.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-xs text-gray-500">Cash / Card / UPI</p>
            <p className="text-lg font-bold text-gray-800 mt-1">
              {cashOrders.length} / {cardOrders.length} / {upiOrders.length}
            </p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-xs text-gray-500">Avg Order Value</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              ₹{totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>

        {/* Orders list */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Utensils size={48} className="mb-3 opacity-30" />
              <p className="font-medium text-lg">No Orders on {getDayLabel(selectedDateObj)}</p>
              <p className="text-sm mt-1">
                {completedOrders.length === 0
                  ? 'Completed orders will appear here after settling a table'
                  : 'Try selecting a different date from the sidebar'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Table header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                <span className="col-span-1">Order #</span>
                <span className="col-span-2">Time</span>
                <span className="col-span-1">Table</span>
                <span className="col-span-1">Type</span>
                <span className="col-span-2">Items</span>
                <span className="col-span-1">Subtotal</span>
                <span className="col-span-1">Tax</span>
                <span className="col-span-1">Total</span>
                <span className="col-span-1">Payment</span>
                <span className="col-span-1"></span>
              </div>

              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg border overflow-hidden">
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="w-full grid grid-cols-12 gap-4 px-4 py-3 items-center text-sm hover:bg-gray-50 transition-colors"
                  >
                    <span className="col-span-1 font-bold text-gray-800">#{order.orderNumber}</span>
                    <span className="col-span-2 text-gray-600 text-left">
                      {formatTime(new Date(order.settledAt))}
                    </span>
                    <span className="col-span-1 text-gray-700 text-left">
                      T-{order.tableNumber}
                    </span>
                    <span className="col-span-1 text-left">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        order.orderType === 'dineIn' ? 'bg-blue-100 text-blue-700'
                        : order.orderType === 'delivery' ? 'bg-orange-100 text-orange-700'
                        : 'bg-purple-100 text-purple-700'
                      }`}>
                        {ORDER_TYPE_MAP[order.orderType]}
                      </span>
                    </span>
                    <span className="col-span-2 text-gray-500 text-left truncate">
                      {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </span>
                    <span className="col-span-1 text-gray-700 text-left">₹{order.subtotal.toFixed(2)}</span>
                    <span className="col-span-1 text-gray-500 text-left">₹{(order.sgst + order.cgst).toFixed(2)}</span>
                    <span className="col-span-1 font-bold text-gray-800 text-left">₹{order.total.toFixed(2)}</span>
                    <span className="col-span-1 text-left">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        order.paymentMethod === 'Cash' ? 'bg-green-100 text-green-700'
                        : order.paymentMethod === 'Card' ? 'bg-blue-100 text-blue-700'
                        : order.paymentMethod === 'UPI' ? 'bg-purple-100 text-purple-700'
                        : 'bg-orange-100 text-orange-700'
                      }`}>
                        {order.paymentMethod}
                      </span>
                    </span>
                    <span className="col-span-1 flex justify-end">
                      {expandedOrder === order.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </span>
                  </button>

                  {expandedOrder === order.id && (
                    <div className="border-t bg-gray-50 px-6 py-3">
                      <p className="text-xs font-semibold text-gray-500 mb-2">ORDER ITEMS</p>
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm py-1">
                            <span className="text-gray-700">{item.quantity}x {item.name}</span>
                            <span className="text-gray-600 font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t mt-2 pt-2 space-y-1 text-sm">
                        <div className="flex justify-between text-gray-500">
                          <span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                          <span>SGST (2.5%)</span><span>₹{order.sgst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                          <span>CGST (2.5%)</span><span>₹{order.cgst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-800 text-base pt-1 border-t">
                          <span>Total</span><span>₹{order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
                        Biller: {order.billerName} &nbsp;|&nbsp; Settled: {formatTime(new Date(order.settledAt))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}