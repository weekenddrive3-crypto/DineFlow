import { useState } from 'react';
import { useMenuStore, MenuItemData } from '@/store/menu.store';
import {
  Plus, Pencil, Trash2, X, Check, ChevronDown, ChevronRight,
  ToggleLeft, ToggleRight, Search, RotateCcw, UtensilsCrossed,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MenuPage() {
  const {
    categories, addCategory, updateCategory, deleteCategory, toggleCategory,
    addItem, updateItem, deleteItem, toggleItem, resetToDefault,
  } = useMenuStore();

  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [showAddItem, setShowAddItem] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // New item form
  const [newItem, setNewItem] = useState({ name: '', price: '', halfPrice: '', foodType: 'VEG' as 'VEG' | 'NON_VEG' | 'EGG' });
  // Edit item form
  const [editItem, setEditItem] = useState({ name: '', price: '', halfPrice: '', foodType: 'VEG' as 'VEG' | 'NON_VEG' | 'EGG' });

  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0);
  const activeItems = categories.reduce((sum, c) => sum + c.items.filter((i) => i.isActive).length, 0);

  // Filter categories/items by search
  const filteredCategories = categories.filter((cat) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return cat.name.toLowerCase().includes(q) || cat.items.some((i) => i.name.toLowerCase().includes(q));
  });

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim());
    setNewCatName('');
    setShowAddCategory(false);
    toast.success(`Category "${newCatName.trim()}" added`);
  };

  const handleSaveCategory = (id: string) => {
    if (!editCatName.trim()) return;
    updateCategory(id, editCatName.trim());
    setEditingCatId(null);
    toast.success('Category updated');
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (confirm(`Delete "${name}" and all its items?`)) {
      deleteCategory(id);
      toast.success(`"${name}" deleted`);
    }
  };

  const handleAddItem = (categoryId: string) => {
    if (!newItem.name.trim() || !newItem.price) return;
    addItem(categoryId, {
      name: newItem.name.trim(),
      price: Number(newItem.price),
      halfPrice: newItem.halfPrice ? Number(newItem.halfPrice) : undefined,
      foodType: newItem.foodType,
    });
    setNewItem({ name: '', price: '', halfPrice: '', foodType: 'VEG' });
    setShowAddItem(null);
    toast.success(`"${newItem.name.trim()}" added`);
  };

  const handleSaveItem = (categoryId: string, itemId: string) => {
    if (!editItem.name.trim() || !editItem.price) return;
    updateItem(categoryId, itemId, {
      name: editItem.name.trim(),
      price: Number(editItem.price),
      halfPrice: editItem.halfPrice ? Number(editItem.halfPrice) : undefined,
      foodType: editItem.foodType,
    });
    setEditingItemId(null);
    toast.success('Item updated');
  };

  const handleDeleteItem = (categoryId: string, itemId: string, name: string) => {
    if (confirm(`Delete "${name}"?`)) {
      deleteItem(categoryId, itemId);
      toast.success(`"${name}" deleted`);
    }
  };

  const startEditItem = (item: MenuItemData) => {
    setEditingItemId(item.id);
    setEditItem({
      name: item.name,
      price: item.price.toString(),
      halfPrice: item.halfPrice?.toString() || '',
      foodType: item.foodType,
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Menu Management</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {categories.length} categories · {totalItems} total items · {activeItems} active
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-300 rounded px-3 py-1.5">
              <Search size={14} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm outline-none w-48 bg-transparent"
              />
            </div>
            <button
              onClick={() => setShowAddCategory(true)}
              className="btn-primary text-sm py-1.5 px-4 flex items-center gap-1"
            >
              <Plus size={14} /> Add Category
            </button>
            <button
              onClick={() => {
                if (confirm('Reset menu to default Mughlai Zaika menu?')) {
                  resetToDefault();
                  toast.success('Menu reset to default');
                }
              }}
              className="text-sm text-gray-500 hover:text-gray-700 p-2 rounded hover:bg-gray-100"
              title="Reset to default"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Add category form */}
      {showAddCategory && (
        <div className="bg-blue-50 border-b px-6 py-3 flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">New Category:</span>
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            placeholder="Category name"
            autoFocus
            className="text-sm border border-gray-300 rounded px-3 py-1.5 w-64 outline-none focus:ring-2 focus:ring-brand-red"
          />
          <button onClick={handleAddCategory} className="btn-primary text-sm py-1.5 px-3">
            <Check size={14} />
          </button>
          <button onClick={() => { setShowAddCategory(false); setNewCatName(''); }} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Category & Items list */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {filteredCategories.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <UtensilsCrossed size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No categories found</p>
          </div>
        )}

        {filteredCategories.map((cat) => {
          const isExpanded = expandedCat === cat.id;
          const activeCount = cat.items.filter((i) => i.isActive).length;

          // Filter items by search within this category
          const filteredItems = searchQuery
            ? cat.items.filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
            : cat.items;

          return (
            <div key={cat.id} className="bg-white rounded-lg border overflow-hidden">
              {/* Category header */}
              <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                <button
                  onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                  className="flex items-center gap-3 flex-1"
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  {editingCatId === cat.id ? (
                    <input
                      type="text"
                      value={editCatName}
                      onChange={(e) => setEditCatName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveCategory(cat.id);
                        if (e.key === 'Escape') setEditingCatId(null);
                      }}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm font-semibold border border-blue-300 rounded px-2 py-0.5 outline-none"
                    />
                  ) : (
                    <span className={`text-sm font-semibold ${cat.isActive ? 'text-gray-800' : 'text-gray-400 line-through'}`}>
                      {cat.name}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 ml-2">
                    {activeCount}/{cat.items.length} items
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  {editingCatId === cat.id ? (
                    <>
                      <button onClick={() => handleSaveCategory(cat.id)} className="text-green-600 hover:text-green-800 p-1">
                        <Check size={16} />
                      </button>
                      <button onClick={() => setEditingCatId(null)} className="text-gray-400 hover:text-gray-600 p-1">
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleCategory(cat.id)}
                        className={`p-1 ${cat.isActive ? 'text-green-600' : 'text-gray-400'}`}
                        title={cat.isActive ? 'Active - click to disable' : 'Disabled - click to enable'}
                      >
                        {cat.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                      <button
                        onClick={() => { setEditingCatId(cat.id); setEditCatName(cat.name); }}
                        className="text-gray-400 hover:text-blue-600 p-1"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="text-gray-400 hover:text-red-600 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Items list (expanded) */}
              {isExpanded && (
                <div className="border-t">
                  {/* Items header */}
                  <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 uppercase">
                    <span className="col-span-4">Item Name</span>
                    <span className="col-span-2 text-right">Full Price (₹)</span>
                    <span className="col-span-2 text-right">Half Price (₹)</span>
                    <span className="col-span-2">Type</span>
                    <span className="col-span-2 text-right">Actions</span>
                  </div>

                  {/* Item rows */}
                  {filteredItems.map((item) => (
                    <div key={item.id} className={`grid grid-cols-12 gap-2 px-4 py-2.5 border-t items-center text-sm ${!item.isActive ? 'bg-gray-50 opacity-60' : ''}`}>
                      {editingItemId === item.id ? (
                        <>
                          <input
                            className="col-span-4 border rounded px-2 py-1 text-sm outline-none"
                            value={editItem.name}
                            onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                          />
                          <input
                            className="col-span-2 border rounded px-2 py-1 text-sm text-right outline-none"
                            type="number"
                            value={editItem.price}
                            onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                          />
                          <input
                            className="col-span-2 border rounded px-2 py-1 text-sm text-right outline-none"
                            type="number"
                            placeholder="Optional"
                            value={editItem.halfPrice}
                            onChange={(e) => setEditItem({ ...editItem, halfPrice: e.target.value })}
                          />
                          <select
                            className="col-span-2 border rounded px-1 py-1 text-sm outline-none"
                            value={editItem.foodType}
                            onChange={(e) => setEditItem({ ...editItem, foodType: e.target.value as any })}
                          >
                            <option value="VEG">Veg</option>
                            <option value="NON_VEG">Non-Veg</option>
                            <option value="EGG">Egg</option>
                          </select>
                          <div className="col-span-2 flex justify-end gap-1">
                            <button onClick={() => handleSaveItem(cat.id, item.id)} className="text-green-600 p-1"><Check size={14} /></button>
                            <button onClick={() => setEditingItemId(null)} className="text-gray-400 p-1"><X size={14} /></button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="col-span-4 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${
                              item.foodType === 'VEG' ? 'bg-green-500' : item.foodType === 'EGG' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                            <span className={!item.isActive ? 'line-through' : ''}>{item.name}</span>
                          </span>
                          <span className="col-span-2 text-right">₹{item.price}</span>
                          <span className="col-span-2 text-right text-gray-400">
                            {item.halfPrice ? `₹${item.halfPrice}` : '-'}
                          </span>
                          <span className="col-span-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              item.foodType === 'VEG' ? 'bg-green-100 text-green-700'
                              : item.foodType === 'EGG' ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                            }`}>
                              {item.foodType === 'NON_VEG' ? 'Non-Veg' : item.foodType === 'EGG' ? 'Egg' : 'Veg'}
                            </span>
                          </span>
                          <div className="col-span-2 flex justify-end gap-1">
                            <button onClick={() => toggleItem(cat.id, item.id)} className={`p-1 ${item.isActive ? 'text-green-500' : 'text-gray-400'}`}>
                              {item.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                            </button>
                            <button onClick={() => startEditItem(item)} className="text-gray-400 hover:text-blue-600 p-1"><Pencil size={14} /></button>
                            <button onClick={() => handleDeleteItem(cat.id, item.id, item.name)} className="text-gray-400 hover:text-red-600 p-1"><Trash2 size={14} /></button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {/* Add item form */}
                  {showAddItem === cat.id ? (
                    <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-t items-center bg-blue-50">
                      <input
                        className="col-span-4 border rounded px-2 py-1 text-sm outline-none"
                        placeholder="Item name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        autoFocus
                      />
                      <input
                        className="col-span-2 border rounded px-2 py-1 text-sm text-right outline-none"
                        type="number"
                        placeholder="Price"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      />
                      <input
                        className="col-span-2 border rounded px-2 py-1 text-sm text-right outline-none"
                        type="number"
                        placeholder="Half (opt)"
                        value={newItem.halfPrice}
                        onChange={(e) => setNewItem({ ...newItem, halfPrice: e.target.value })}
                      />
                      <select
                        className="col-span-2 border rounded px-1 py-1 text-sm outline-none"
                        value={newItem.foodType}
                        onChange={(e) => setNewItem({ ...newItem, foodType: e.target.value as any })}
                      >
                        <option value="VEG">Veg</option>
                        <option value="NON_VEG">Non-Veg</option>
                        <option value="EGG">Egg</option>
                      </select>
                      <div className="col-span-2 flex justify-end gap-1">
                        <button onClick={() => handleAddItem(cat.id)} className="bg-brand-green text-white px-2 py-1 rounded text-xs">Add</button>
                        <button onClick={() => setShowAddItem(null)} className="text-gray-400 p-1"><X size={14} /></button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddItem(cat.id)}
                      className="w-full text-left px-4 py-2.5 border-t text-sm text-brand-red font-medium hover:bg-red-50 flex items-center gap-2"
                    >
                      <Plus size={14} /> Add Item
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}