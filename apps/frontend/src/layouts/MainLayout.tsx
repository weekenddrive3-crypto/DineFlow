import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import {
  Menu,
  Receipt,
  Settings,
  LayoutGrid,
  BarChart3,
  Radio,
  LogOut,
  Search,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Grid3X3,
  Bell,
  Pause,
  X,
  RefreshCw,
} from 'lucide-react';

const REPORT_ITEMS = [
  'Category Summary',
  'Item Summary',
  'Sales Summary',
  'Order Summary',
  'Executive Sales Summary',
  'Employee Summary',
  'Group Summary',
  'Variation Summary',
  'Cover Size Summary',
  'Tip Summary',
  'Counter Summary',
  'Locality Wise Summary',
  'Captain Wise Summary',
  'NC Item Summary',
  'Assignee Wise Summary',
];

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleReportClick = (report: string) => {
    const slug = report.toLowerCase().replace(/\s+/g, '-');
    navigate(`/reports/${slug}`);
    setSidebarOpen(false);
  };

  const navItems = [
    { path: '/billing', label: 'Billing', icon: Receipt },
    { path: '/operations', label: 'Operations', icon: LayoutGrid },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* TOP HEADER BAR */}
      <header className="h-12 bg-white border-b border-gray-200 flex items-center px-3 gap-3 shrink-0 z-20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-red rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">POS</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/billing')}
          className="btn-primary text-sm py-1.5 px-4"
        >
          New Order
        </button>

        <div className="flex items-center gap-2 ml-2">
          <div className="flex items-center border border-gray-300 rounded px-2 py-1">
            <Search size={14} className="text-gray-400 mr-1" />
            <input type="text" placeholder="Bill No" className="text-sm outline-none w-20 bg-transparent" />
          </div>
          <div className="flex items-center border border-gray-300 rounded px-2 py-1">
            <Search size={14} className="text-gray-400 mr-1" />
            <input type="text" placeholder="KOT No." className="text-sm outline-none w-20 bg-transparent" />
          </div>
        </div>

        <div className="flex-1" />

        <button className="flex flex-col items-center text-gray-600 hover:text-gray-900 px-2">
          <ShoppingBag size={18} />
          <span className="text-[10px] mt-0.5">Item On/Off</span>
        </button>
        <button className="flex flex-col items-center text-gray-600 hover:text-gray-900 px-2">
          <Grid3X3 size={18} />
          <span className="text-[10px] mt-0.5">Store</span>
        </button>
        <button onClick={() => navigate('/tables')} className="flex flex-col items-center text-gray-600 hover:text-gray-900 px-2">
          <Radio size={18} />
          <span className="text-[10px] mt-0.5">Live View</span>
        </button>
        <button onClick={() => navigate('/orders')} className="flex flex-col items-center text-gray-600 hover:text-gray-900 px-2">
          <Receipt size={18} />
          <span className="text-[10px] mt-0.5">Orders</span>
        </button>
        <button className="flex flex-col items-center text-gray-600 hover:text-gray-900 px-2">
          <BarChart3 size={18} />
          <span className="text-[10px] mt-0.5">Recent</span>
        </button>
        <button className="flex flex-col items-center text-gray-600 hover:text-gray-900 px-2">
          <Pause size={18} />
          <span className="text-[10px] mt-0.5">Hold</span>
        </button>
        <button className="flex flex-col items-center text-gray-600 hover:text-gray-900 px-2">
          <Bell size={18} />
          <span className="text-[10px] mt-0.5">Alerts</span>
        </button>
        <button onClick={handleLogout} className="flex flex-col items-center text-gray-600 hover:text-gray-900 px-2">
          <LogOut size={18} />
          <span className="text-[10px] mt-0.5">Logout</span>
        </button>

        <div className="bg-yellow-400 text-black text-xs font-bold px-3 py-2 rounded ml-2">
          <div>{user?.outlet?.name || 'POS'}</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        {sidebarOpen && (
          <>
            <div className="fixed inset-0 bg-black/30 z-30" onClick={() => setSidebarOpen(false)} />

            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar-bg text-white z-40 flex flex-col shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-600">
                <h2 className="text-lg font-semibold">Settings</h2>
                <div className="flex items-center gap-2">
                  <Search size={16} className="text-gray-400" />
                  <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-sidebar-hover rounded">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Nav items */}
              <nav className="flex-1 overflow-y-auto py-2">
                {/* Billing */}
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `category-item flex items-center gap-3 px-4 ${isActive ? 'active bg-sidebar-active' : ''}`
                    }
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}

                {/* Reports with expandable submenu */}
                <button
                  onClick={() => setReportsOpen(!reportsOpen)}
                  className={`category-item flex items-center gap-3 px-4 w-full ${
                    location.pathname.startsWith('/reports') ? 'active bg-sidebar-active' : ''
                  }`}
                >
                  <BarChart3 size={18} />
                  <span>Reports</span>
                  {reportsOpen ? (
                    <ChevronUp size={14} className="ml-auto" />
                  ) : (
                    <ChevronDown size={14} className="ml-auto" />
                  )}
                </button>

                {/* Report submenu items */}
                {reportsOpen && (
                  <div className="bg-black/20">
                    {REPORT_ITEMS.map((report) => {
                      const slug = report.toLowerCase().replace(/\s+/g, '-');
                      const isActive = location.pathname === `/reports/${slug}`;
                      return (
                        <button
                          key={report}
                          onClick={() => handleReportClick(report)}
                          className={`w-full text-left text-sm px-10 py-2.5 transition-colors ${
                            isActive
                              ? 'bg-sidebar-active text-white'
                              : 'text-gray-300 hover:bg-sidebar-hover hover:text-white'
                          }`}
                        >
                          {report}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Live View */}
                <NavLink
                  to="/tables"
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `category-item flex items-center gap-3 px-4 ${isActive ? 'active bg-sidebar-active' : ''}`
                  }
                >
                  <Radio size={18} />
                  <span>Live View</span>
                </NavLink>

                {/* Settings */}
                <NavLink
                  to="/settings"
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `category-item flex items-center gap-3 px-4 ${isActive ? 'active bg-sidebar-active' : ''}`
                  }
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </NavLink>

                {/* Check Updates */}
                <button className="category-item flex items-center gap-3 px-4 w-full">
                  <RefreshCw size={18} />
                  <span>Check Updates</span>
                </button>

                <div className="border-t border-gray-600 my-2" />

                <button
                  onClick={handleLogout}
                  className="category-item flex items-center gap-3 px-4 w-full"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </nav>

              {/* Footer */}
              <div className="border-t border-gray-600 px-4 py-3 text-xs text-gray-400">
                <div>Ref ID : {user?.outlet?.refId || 'N/A'} &nbsp; Version : 1.0.0</div>
                <div className="mt-1 text-center">Biller Name : {user?.name || 'N/A'}</div>
              </div>
            </aside>
          </>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}