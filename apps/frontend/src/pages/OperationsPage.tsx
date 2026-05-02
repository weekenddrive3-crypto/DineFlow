import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Globe,
  FileText,
  CreditCard,
  Monitor,
  Printer,
  LayoutGrid,
  Users,
  Truck,
  Wallet,
  Receipt,
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
  UtensilsCrossed,
  ToggleLeft,
  Calculator,
  Percent,
  
  MessageSquare,
  Tv,
  Package,
  MonitorSmartphone,
  UserCog,
  RefreshCw,
  Bell,
  ShieldCheck,
  HelpCircle,
  Settings,
  Languages,
} from 'lucide-react';

interface OperationItem {
  icon: React.ElementType;
  label: string;
  path?: string;
  color?: string;
}

interface OperationSection {
  title: string;
  items: OperationItem[];
}

const SECTIONS: OperationSection[] = [
  {
    title: 'Orders & Billing',
    items: [
      { icon: ClipboardList, label: 'Orders', path: '/orders' },
      { icon: Globe, label: 'Online Orders' },
      { icon: FileText, label: 'KOTs' },
      { icon: CreditCard, label: 'Due Payment' },
      { icon: Monitor, label: 'Billing Screen', path: '/billing' },
      { icon: Receipt, label: 'Live View', path: '/tables' },
      { icon: Printer, label: 'Bill / KOT Print' },
      { icon: LayoutGrid, label: 'Table', path: '/tables' },
      { icon: Settings, label: 'Custom Order Status' },
      { icon: Truck, label: 'Delivery Boys' },
    ],
  },
  {
    title: 'Payments & Finance',
    items: [
      { icon: Wallet, label: 'Cash Flow' },
      { icon: Receipt, label: 'Expense' },
      { icon: ArrowDownCircle, label: 'Withdrawal' },
      { icon: ArrowUpCircle, label: 'Cash Top-Up' },
      { icon: DollarSign, label: 'Currency Conversion' },
    ],
  },
  {
    title: 'Menu & Inventory',
    items: [
      { icon: UtensilsCrossed, label: 'Menu', path: '/menu' },
      { icon: ToggleLeft, label: 'Menu Item On Off', path: '/menu' },
      { icon: Calculator, label: 'Tax', color: 'text-green-600' },
      { icon: Percent, label: 'Discount' },
      { icon: Users, label: 'Customers' },
      { icon: MessageSquare, label: 'Feedback' },
      { icon: Tv, label: 'LED Display' },
      { icon: Package, label: 'Inventory' },
      { icon: MonitorSmartphone, label: 'Dual Screen' },
    ],
  },
  {
    title: 'System Settings',
    items: [
      { icon: UserCog, label: 'Billing User Profile' },
      { icon: RefreshCw, label: 'Manual Sync' },
      { icon: Bell, label: 'Alerts' },
      { icon: ShieldCheck, label: 'Service Renewal' },
      { icon: HelpCircle, label: 'Help' },
      { icon: Settings, label: 'Settings', path: '/settings' },
      { icon: Languages, label: 'Language Profiles' },
    ],
  },
];

export default function OperationsPage() {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-800">Operations</h1>
          <span className="text-sm text-gray-400">Version: 1.0.0</span>
        </div>
      </div>

      {/* Sections */}
      <div className="p-6 space-y-8">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">{section.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => item.path && navigate(item.path)}
                  className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg 
                             px-4 py-4 hover:shadow-sm hover:border-gray-300 
                             transition-all duration-150 text-left group"
                >
                  <div className="shrink-0">
                    <item.icon
                      size={20}
                      className={item.color || 'text-gray-500 group-hover:text-gray-700'}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}