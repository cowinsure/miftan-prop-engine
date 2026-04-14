'use client';

import DashboardLayout from './components/DashboardLayout';
import { ChartBarIcon, ClockIcon, BellIcon, CogIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 font-headline mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's an overview of your property analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">+12%</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Total Properties</h3>
          <p className="text-2xl font-bold text-blue-600 mb-1">142</p>
          <p className="text-sm text-slate-500">Active listings</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">+8%</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Avg. Occupancy</h3>
          <p className="text-2xl font-bold text-emerald-600 mb-1">94.2%</p>
          <p className="text-sm text-slate-500">This month</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <BellIcon className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">3</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Active Alerts</h3>
          <p className="text-2xl font-bold text-amber-600 mb-1">12</p>
          <p className="text-sm text-slate-500">Require attention</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CogIcon className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Updated</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">System Status</h3>
          <p className="text-2xl font-bold text-purple-600 mb-1">Healthy</p>
          <p className="text-sm text-slate-500">All systems operational</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-4 font-headline">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">New property added to portfolio</p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Performance report generated</p>
                <p className="text-xs text-slate-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Maintenance alert for Property #127</p>
                <p className="text-xs text-slate-500">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-4 font-headline">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium">
              <ChartBarIcon className="w-5 h-5 mx-auto mb-2" />
              View Reports
            </button>
            <button className="p-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium">
              <ClockIcon className="w-5 h-5 mx-auto mb-2" />
              Upload Data
            </button>
            <button className="p-4 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium">
              <BellIcon className="w-5 h-5 mx-auto mb-2" />
              Manage Alerts
            </button>
            <button className="p-4 bg-gradient-to-r from-slate-500 to-gray-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium">
              <CogIcon className="w-5 h-5 mx-auto mb-2" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
