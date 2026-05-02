import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
import { TABLE_STATUS_COLORS } from '@petpooja/shared';
import { useOrderStore } from '@/store/Order.store';

const MOCK_AREAS = [
  {
    name: 'Nightindoor',
    tables: [1, 2, 3, 4, 5, 6],
  },
  {
    name: 'Outdoor',
    tables: [7, 8, 9, 10, 11],
  },
];

const STATUS_LEGEND = [
  { label: 'Blank Table', color: TABLE_STATUS_COLORS.BLANK },
  { label: 'Running Table', color: TABLE_STATUS_COLORS.RUNNING },
  { label: 'Printed Table', color: TABLE_STATUS_COLORS.PRINTED },
  { label: 'Paid Table', color: TABLE_STATUS_COLORS.PAID },
  { label: 'Running KOT Table', color: TABLE_STATUS_COLORS.RUNNING_KOT },
];

function getElapsedTime(startedAt: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(startedAt).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${minutes} Min`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return `${hours}h ${rem}m`;
}

export default function TableViewPage() {
  const [areas] = useState(MOCK_AREAS);
  const navigate = useNavigate();
  const tableOrders = useOrderStore((s) => s.tableOrders);

  const handleTableClick = (tableNumber: number, areaName: string) => {
    navigate(`/billing?table=${tableNumber}&area=${encodeURIComponent(areaName)}`);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
        <h1 className="text-xl font-semibold text-gray-800">Table View</h1>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded">
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => navigate('/billing?type=delivery')}
            className="bg-brand-red text-white text-sm px-4 py-2 rounded"
          >
            Delivery
          </button>
          <button
            onClick={() => navigate('/billing?type=pickUp')}
            className="bg-yellow-500 text-white text-sm px-4 py-2 rounded"
          >
            Pick Up
          </button>
          <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded flex items-center gap-1">
            <Plus size={14} /> Add Table
          </button>
        </div>
      </div>

      {/* Legend + Contactless */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b">
        <button className="bg-brand-green text-white text-sm px-4 py-1.5 rounded flex items-center gap-1">
          <Plus size={14} /> Contactless
        </button>
        <div className="flex items-center gap-1">
          <label className="flex items-center gap-1 mr-4">
            <input type="checkbox" className="rounded" />
            <span className="text-xs text-gray-600">Move KOT / Items</span>
          </label>
          {STATUS_LEGEND.map((s) => (
            <div key={s.label} className="flex items-center gap-1 mx-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-xs text-gray-600">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {areas.map((area) => (
          <div key={area.name} className="mb-8">
            <h2 className="text-base font-semibold text-gray-700 mb-4">{area.name}</h2>
            <div className="flex flex-wrap gap-4">
              {area.tables.map((tableNum) => {
                const order = tableOrders[tableNum];
                const isOccupied = !!order;
                const status = order?.status || 'BLANK';
                const bgColor = TABLE_STATUS_COLORS[status as keyof typeof TABLE_STATUS_COLORS];

                return (
                  <button
                    key={tableNum}
                    onClick={() => handleTableClick(tableNum, area.name)}
                    className="table-card w-28 hover:shadow-md hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: isOccupied ? bgColor : 'white',
                      borderColor: isOccupied ? bgColor : '#E5E7EB',
                    }}
                  >
                    {isOccupied ? (
                      <>
                        <span className="text-[10px] text-gray-600">
                          {getElapsedTime(order.startedAt)}
                        </span>
                        <span className="font-bold text-lg">{tableNum}</span>
                        <span className="text-xs font-bold text-gray-800">
                          ₹ {order.total.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-gray-500 mt-0.5">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-lg text-gray-400">{tableNum}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}