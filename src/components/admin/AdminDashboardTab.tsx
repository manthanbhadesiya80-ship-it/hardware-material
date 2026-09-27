import React from 'react';
import { Product, Order, BulkEnquiry, Offer } from '../../types';
import { useAdmin } from '../../context/AdminContext';
import {
  IndianRupee,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Package,
  Layers,
  Building2,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';

interface AdminDashboardTabProps {
  products: Product[];
  orders: Order[];
  enquiries: BulkEnquiry[];
  offers: Offer[];
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  products,
  orders,
  enquiries,
  offers
}) => {
  const { setActiveTab } = useAdmin();

  // Financial Metrics
  const totalSales = orders
    .filter(o => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const todayOrders = orders.filter(o => {
    const today = new Date().toISOString().split('T')[0];
    return o.createdAt.startsWith(today);
  });

  const todaySales = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.orderStatus === 'Order Placed' || o.orderStatus === 'Confirmed');
  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Total Sales</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900">
            ₹{totalSales.toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Across {orders.length} lifetime orders</span>
          </p>
        </div>

        {/* Today's Sales */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Today's Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#124DA6] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#083B82]">
            ₹{todaySales.toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] text-gray-500 mt-1">
            {todayOrders.length} orders placed today
          </p>
        </div>

        {/* Pending Orders */}
        <div
          onClick={() => setActiveTab('orders')}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs cursor-pointer hover:border-[#124DA6] transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Orders To Pack</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-amber-600">
            {pendingOrders.length}
          </h3>
          <p className="text-[11px] text-amber-700 font-semibold mt-1 flex items-center gap-1">
            <span>Requires warehouse dispatch →</span>
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div
          onClick={() => setActiveTab('inventory')}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs cursor-pointer hover:border-[#124DA6] transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Low Stock SKUs</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-red-600">
            {lowStockCount}
          </h3>
          <p className="text-[11px] text-red-700 font-semibold mt-1">
            Replenishment needed
          </p>
        </div>
      </div>

      {/* Secondary Quick Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-gray-200 text-xs">
        <div className="p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-400 block text-[10px] uppercase font-bold">Total Products</span>
          <strong className="text-base text-gray-900 font-bold">{products.length} SKUs</strong>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-400 block text-[10px] uppercase font-bold">B2B Enquiries</span>
          <strong className="text-base text-[#124DA6] font-bold">{enquiries.length} Active</strong>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-400 block text-[10px] uppercase font-bold">Active Offers</span>
          <strong className="text-base text-[#E87500] font-bold">{offers.length} Running</strong>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-400 block text-[10px] uppercase font-bold">Fulfillment Rate</span>
          <strong className="text-base text-emerald-600 font-bold">98.4%</strong>
        </div>
      </div>

      {/* Visual Sales By Category Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">
          Hardware Category Distribution
        </h3>
        <div className="space-y-3">
          {[
            { name: 'Bed Fittings & Hydraulic Lifts', count: 14, color: 'bg-[#124DA6]' },
            { name: 'Furniture Hardware (Hinges & Slides)', count: 28, color: 'bg-[#E87500]' },
            { name: 'Cabinet Handles & Profile Pulls', count: 32, color: 'bg-[#083B82]' },
            { name: 'Door Locks & Architectural Hardware', count: 22, color: 'bg-emerald-600' },
            { name: 'Fasteners, Screws & Adhesives', count: 34, color: 'bg-indigo-600' }
          ].map((cat, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-gray-800">{cat.name}</span>
                <span className="text-gray-500 font-bold">{cat.count} Items</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${cat.color} rounded-full`}
                  style={{ width: `${(cat.count / 35) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Recent Customer & Trade Orders</h3>
            <p className="text-[11px] text-gray-500">Live order stream across web and phone channels</p>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs font-bold text-[#124DA6] hover:underline"
          >
            View All ({orders.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.slice(0, 5).map(o => (
                <tr key={o.id} className="hover:bg-blue-50/40">
                  <td className="py-3 px-4 font-mono font-bold text-[#124DA6]">
                    {o.orderNumber}
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    <div>{o.customerName}</div>
                    <div className="text-[10px] text-gray-400">{o.customerPhone}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {o.items.length} items ({o.items[0]?.name.slice(0, 20)}...)
                  </td>
                  <td className="py-3 px-4 font-black text-gray-900">
                    ₹{o.total.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4">
                    <span className="uppercase text-[10px] font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
                      {o.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-[11px] text-[#E87500]">
                      {o.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
