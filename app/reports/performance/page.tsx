'use client';

import { useState } from 'react';
import { getPropertyPerformanceReport } from '../../api/client';
import DashboardLayout from '../../components/DashboardLayout';
import { DocumentChartBarIcon, MagnifyingGlassIcon, XCircleIcon, CheckCircleIcon, CurrencyDollarIcon, CalendarIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface PerformanceData {
  property: {
    id: number;
    name: string;
  };
  month: string;
  metrics: {
    total_revenue: number;
    occupancy_rate: number;
    average_daily_rate: number;
    total_nights: number;
    revenue_per_available_room: number;
  };
  trends: {
    revenue_trend: string;
    occupancy_trend: string;
    adr_trend: string;
  };
  comparison: {
    vs_previous_month: {
      revenue_change: number;
      occupancy_change: number;
      adr_change: number;
    };
    vs_budget: {
      revenue_variance: number;
      occupancy_variance: number;
    };
  };
}

export default function PerformanceReportPage() {
  const [propertyId, setPropertyId] = useState('');
  const [month, setMonth] = useState('');
  const [report, setReport] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const data = await getPropertyPerformanceReport({ property_id: propertyId, month });
      setReport(data);
      setSuccess('Performance report generated successfully!');
    } catch (err) {
      setError('Failed to generate performance report. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'up':
      case 'increasing':
        return 'text-emerald-600';
      case 'down':
      case 'decreasing':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 font-headline mb-2">Performance Reports</h1>
        <p className="text-slate-600">Analyze detailed performance metrics and trends for your properties.</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 font-headline">Generate Performance Report</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Property ID
                </label>
                <input
                  type="text"
                  placeholder="e.g., 123"
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Month
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                  required
                >
                  <option value="">Select month</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !propertyId || !month}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Report...</span>
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  <span>Generate Performance Report</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
            <XCircleIcon className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3">
            <CheckCircleIcon className="w-5 h-5 text-emerald-500 shrink-0" />
            <p className="text-emerald-700 font-medium">{success}</p>
          </div>
        )}

        {report && (
          <div className="space-y-6">
            {/* Property Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 font-headline">{report.property.name}</h2>
                    <p className="text-slate-600">Property ID: {report.property.id} • Month: {report.month}</p>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-2 bg-slate-100 rounded-lg">
                    <ChartBarIcon className="w-5 h-5 text-slate-600" />
                    <span className="font-medium text-slate-700">Performance Report</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 font-headline">Key Performance Metrics</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <CurrencyDollarIcon className="w-6 h-6 text-slate-600" />
                      <span className={`text-sm font-medium ${getTrendColor(report.trends.revenue_trend)}`}>
                        {report.trends.revenue_trend}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-600 mb-1">Total Revenue</div>
                    <div className="text-2xl font-bold text-slate-900">{formatCurrency(report.metrics.total_revenue)}</div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <UserGroupIcon className="w-6 h-6 text-slate-600" />
                      <span className={`text-sm font-medium ${getTrendColor(report.trends.occupancy_trend)}`}>
                        {report.trends.occupancy_trend}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-600 mb-1">Occupancy Rate</div>
                    <div className="text-2xl font-bold text-slate-900">{formatPercentage(report.metrics.occupancy_rate)}</div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <CurrencyDollarIcon className="w-6 h-6 text-slate-600" />
                      <span className={`text-sm font-medium ${getTrendColor(report.trends.adr_trend)}`}>
                        {report.trends.adr_trend}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-600 mb-1">Average Daily Rate</div>
                    <div className="text-2xl font-bold text-slate-900">{formatCurrency(report.metrics.average_daily_rate)}</div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <CalendarIcon className="w-6 h-6 text-slate-600" />
                      <span className="text-sm font-medium text-slate-600">Total</span>
                    </div>
                    <div className="text-sm font-medium text-slate-600 mb-1">Room Nights</div>
                    <div className="text-2xl font-bold text-slate-900">{report.metrics.total_nights.toLocaleString()}</div>
                  </div>
                </div>

                <div className="mt-6 bg-slate-50 rounded-lg p-6">
                  <div className="text-sm font-medium text-slate-600 mb-3">Revenue Per Available Room (RevPAR)</div>
                  <div className="text-3xl font-bold text-slate-900">{formatCurrency(report.metrics.revenue_per_available_room)}</div>
                </div>
              </div>
            </div>

            {/* Month-over-Month Comparison */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 font-headline">Month-over-Month Comparison</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-2">Revenue Change</div>
                    <div className={`text-2xl font-bold ${report.comparison.vs_previous_month.revenue_change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {report.comparison.vs_previous_month.revenue_change >= 0 ? '+' : ''}{formatPercentage(report.comparison.vs_previous_month.revenue_change)}
                    </div>
                    <div className="text-sm text-slate-500">vs previous month</div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-2">Occupancy Change</div>
                    <div className={`text-2xl font-bold ${report.comparison.vs_previous_month.occupancy_change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {report.comparison.vs_previous_month.occupancy_change >= 0 ? '+' : ''}{formatPercentage(report.comparison.vs_previous_month.occupancy_change)}
                    </div>
                    <div className="text-sm text-slate-500">vs previous month</div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-2">ADR Change</div>
                    <div className={`text-2xl font-bold ${report.comparison.vs_previous_month.adr_change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {report.comparison.vs_previous_month.adr_change >= 0 ? '+' : ''}{formatPercentage(report.comparison.vs_previous_month.adr_change)}
                    </div>
                    <div className="text-sm text-slate-500">vs previous month</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Comparison */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 font-headline">Budget Performance</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-2">Revenue Variance</div>
                    <div className={`text-2xl font-bold ${report.comparison.vs_budget.revenue_variance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {report.comparison.vs_budget.revenue_variance >= 0 ? '+' : ''}{formatPercentage(report.comparison.vs_budget.revenue_variance)}
                    </div>
                    <div className="text-sm text-slate-500">vs budget</div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-2">Occupancy Variance</div>
                    <div className={`text-2xl font-bold ${report.comparison.vs_budget.occupancy_variance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {report.comparison.vs_budget.occupancy_variance >= 0 ? '+' : ''}{formatPercentage(report.comparison.vs_budget.occupancy_variance)}
                    </div>
                    <div className="text-sm text-slate-500">vs budget</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Raw Data (Collapsible) */}
            <details className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <summary className="p-6 font-semibold text-slate-900 cursor-pointer hover:bg-slate-50 transition-colors">
                View Raw Data
              </summary>
              <div className="px-6 pb-6">
                <pre className="bg-slate-50 p-4 rounded-lg text-sm overflow-x-auto text-slate-700">
                  {JSON.stringify(report, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}