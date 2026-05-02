import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Utensils, User, ClipboardList, X, Plus, Minus, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useOrderStore } from '@/store/Order.store';
import type { CartItem } from '@/store/Order.store'
import { useMenuStore } from '@/store/menu.store';

export default function BillingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableNumber = searchParams.get('table') ? Number(searchParams.get('table')) : null;
  const areaName = searchParams.get('area') || '';
  const orderTypeParam = searchParams.get('type');

  // Menu store (must come before useState that uses categoryNames)
  const categoryNames = useMenuStore((s) => s.getCategoryNames());
  const getMenuItems = useMenuStore((s) => s.getItemsByCategory);

  // Order store
  const { addItemToTable, updateItemQuantity, removeItemFromTable, tableOrders, setTableStatus, settleTable } =
    useOrderStore();

  const [activeCategory, setActiveCategory] = useState(categoryNames[0] || 'Soup');
  const [orderType, setOrderType] = useState<'dineIn' | 'delivery' | 'pickUp'>('dineIn');
  const [searchQuery, setSearchQuery] = useState('');

  const currentOrder = tableNumber ? tableOrders[tableNumber] : null;
  const cart: CartItem[] = currentOrder?.items || [];
  const total = currentOrder?.total || 0;

  useEffect(() => {
    if (orderTypeParam === 'delivery') setOrderType('delivery');
    else if (orderTypeParam === 'pickUp') setOrderType('pickUp');
    else if (tableNumber) setOrderType('dineIn');
  }, [orderTypeParam, tableNumber]);

  useEffect(() => {
    if (tableNumber && areaName) {
      toast.success(`Table ${tableNumber} (${areaName}) selected`);
    }
  }, []);

  const items = getMenuItems(activeCategory);

  const handleAddToCart = (item: { name: string; price: number }) => {
    if (tableNumber) {
      addItemToTable(tableNumber, areaName, item);
    }
  };

  const handleUpdateQuantity = (itemName: string, delta: number) => {
    if (tableNumber) {
      updateItemQuantity(tableNumber, itemName, delta);
    }
  };

  const handleRemoveItem = (itemName: string) => {
    if (tableNumber) {
      removeItemFromTable(tableNumber, itemName);
    }
  };

  const handleSave = () => {
    if (!tableNumber || cart.length === 0) {
      toast.error('Please add items first');
      return;
      
    }
    toast.success(`Order saved for Table ${tableNumber} — ₹${total.toFixed(2)}`);
    navigate('/tables');
  };

  const handleKOT = () => {
    if (!tableNumber || cart.length === 0) {
      toast.error('Please add items first');
      return;
    }
    setTableStatus(tableNumber, 'RUNNING_KOT');
    toast.success(`KOT sent to kitchen for Table ${tableNumber}`);
  };

  const handlePrint = () => {
    if (!tableNumber || cart.length === 0) {
      toast.error('Please add items first');
      return;
    }
    setTableStatus(tableNumber, 'PRINTED');
    toast.success(`Bill printed for Table ${tableNumber} — ₹${total.toFixed(2)}`);
  };

  const handlePayment = (method: string) => {
    if (!tableNumber) {
      toast.error('Please select a table first');
      return;
    }
    if (cart.length === 0) {
      toast.error('No items to settle');
      return;
    }

    // Settle the table — saves to completedOrders and clears the table
    const completedOrder = settleTable(tableNumber, method);

    if (completedOrder) {
      toast.success(
        `Table ${tableNumber} settled!\nOrder #${completedOrder.orderNumber} — ${method} ₹${completedOrder.total.toFixed(2)}`,
        { duration: 4000 }
      );
    }

    navigate('/tables');
  };

  return (
    <div className="h-full flex">
      {/* LEFT: Category Sidebar */}
      <div className="w-28 bg-sidebar-bg flex flex-col overflow-y-auto shrink-0">
        {categoryNames.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`category-item text-left text-xs leading-tight ${
              activeCategory === cat ? 'active' : ''
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* CENTER: Item Grid */}
      <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
        <div className="p-3 border-b bg-white">
          <div className="flex items-center border border-gray-300 rounded px-3 py-2">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search Item"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-sm bg-transparent"
            />
          </div>
        </div>

        {!tableNumber && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-yellow-800">
              No table selected. Go to Table View to select a table first.
            </span>
            <button
              onClick={() => navigate('/tables')}
              className="text-sm text-yellow-700 font-medium underline flex items-center gap-1"
            >
              <ArrowLeft size={14} /> Go to Tables
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2">
            {items
              .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleAddToCart(item)}
                  disabled={!tableNumber}
                  className={`menu-item-card border-l-4 ${
                    item.foodType === 'VEG' ? 'border-l-brand-green' : item.foodType === 'EGG' ? 'border-l-yellow-500' : 'border-l-brand-red'
                  } ${!tableNumber ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="text-xs">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-1">₹{item.price}</div>
                  {item.halfPrice && (
                    <div className="text-[10px] text-gray-400">Half: ₹{item.halfPrice}</div>
                  )}
                </button>
              ))}
            {items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400">
                No items in this category
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Order Cart */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col shrink-0">
        <div className="flex border-b">
          {[
            { key: 'dineIn', label: 'Dine In' },
            { key: 'delivery', label: 'Delivery' },
            { key: 'pickUp', label: 'Pick Up' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setOrderType(tab.key as any)}
              className={`flex-1 py-3 text-sm font-medium ${
                orderType === tab.key
                  ? 'bg-brand-red text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {tableNumber ? (
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-blue-800">Table {tableNumber}</span>
              {areaName && <span className="text-xs text-blue-600 ml-2">({areaName})</span>}
            </div>
            <button
              onClick={() => navigate('/tables')}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <ArrowLeft size={12} /> Back to Tables
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 border-b px-4 py-2">
            <button
              onClick={() => navigate('/tables')}
              className="text-sm text-brand-red font-medium flex items-center gap-1"
            >
              <ArrowLeft size={14} /> Select a Table
            </button>
          </div>
        )}

        <div className="flex items-center justify-center gap-6 py-2 border-b">
          <button className="p-2 hover:bg-gray-100 rounded" title="Filter">
            <Utensils size={18} className="text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded" title="Customer">
            <User size={18} className="text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded" title="Notes">
            <ClipboardList size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-500 border-b">
          <span>ITEMS</span>
          <div className="flex gap-12">
            <span>QTY.</span>
            <span>PRICE</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Utensils size={48} className="mb-3 opacity-30" />
              <p className="font-medium">No Item Selected</p>
              <p className="text-xs mt-1">Please Select Item from Left Menu Item</p>
            </div>
          ) : (
            <div className="divide-y">
              {cart.map((item) => (
                <div key={item.name} className="flex items-center justify-between px-4 py-3 group">
                  <div className="flex items-center gap-2 flex-1">
                    <button
                      onClick={() => handleRemoveItem(item.name)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleUpdateQuantity(item.name, -1)}
                        className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm w-6 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.name, 1)}
                        className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-sm w-16 text-right font-medium">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t">
          <div className="px-4 py-2 flex items-center justify-between">
            <button className="bg-brand-red text-white text-xs px-3 py-1 rounded">Split</button>
            <div className="text-lg font-bold">
              Total <span className="ml-4">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 border-t">
            {['Cash', 'Card', 'UPI', 'Due', 'Other'].map((method) => (
              <button
                key={method}
                onClick={() => handlePayment(method)}
                className={`flex-1 text-xs py-2 border rounded font-medium transition-colors ${
                  method === 'Due'
                    ? 'border-orange-300 text-orange-600 hover:bg-orange-50'
                    : 'border-gray-300 hover:bg-brand-green hover:text-white hover:border-brand-green'
                }`}
              >
                {method}
              </button>
            ))}
          </div>

          <div className="flex gap-1 p-2 bg-gray-50">
            <button onClick={handleSave } className="btn-secondary text-xs flex-1 py-2">Save</button>
            <button onClick={handlePrint} className="bg-brand-red text-white text-xs flex-1 py-2 rounded">Save & Print</button>
            <button className="bg-orange-500 text-white text-xs flex-1 py-2 rounded">Save & EBill</button>
            <button onClick={handleKOT} className="bg-blue-600 text-white text-xs flex-1 py-2 rounded">KOT</button>
            <button onClick={handleKOT} className="bg-blue-700 text-white text-xs flex-1 py-2 rounded">KOT & Print</button>
            <button className="btn-secondary text-xs flex-1 py-2">Hold</button>
          </div>
        </div>
      </div>
    </div>
  );
}