'use client';

import { useState } from 'react';
import { getPropertyPerformanceReport } from '../../api/client';
import DashboardLayout from '../../components/DashboardLayout';
import { DocumentChartBarIcon, MagnifyingGlassIcon, XCircleIcon, CheckCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface PerformanceData {
  otb: {
    nights: number;
    revenue: number;
  };
  kpis: {
    adr_gap: number;
    adr_ratio: {
      value: number;
      low_threshold: number;
      high_threshold: number;
    };
    pace_ratio: {
      value: number;
      threshold: number;
    };
    nights_pace_ratio: {
      value: number;
      low_threshold: number;
      high_threshold: number;
    };
  };
  month: string;
  actual: {
    adr: number;
    nights_to_date: number;
    revenue_to_date: number;
  };
  expected: {
    adr: number;
    occupancy: number;
    nights_month: number;
    revenue_month: number;
    nights_to_date: number;
    revenue_to_date: number;
  };
  forecast: {
    forecast_revenue: number;
    potential_revenue: number;
    forecast_vs_target: number;
    remaining_free_days: number;
    forecast_after_action: number;
    forecast_vs_target_pct: number;
  };
  property: {
    id: number;
    name: string;
  };
  confidence: string;
  current_day: number;
  days_in_month: number;
  month_progress: number;
  data_validation: {
    is_valid: boolean;
    has_nights_data: boolean;
    has_revenue_data: boolean;
  };
}

interface ApiResponse {
  status: string;
  message: string;
  data: PerformanceData;
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
      const formattedMonth = `2026-${month.padStart(2, '0')}-01`;
      const response = await getPropertyPerformanceReport({ property_id: propertyId, month: formattedMonth });
      
      if (response.data) {
        setReport(response.data);
        setSuccess('Performance report generated successfully!');
      } else {
        setError('No data found for the selected property and month.');
      }
    } catch (err) {
      setError('Failed to generate performance report. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
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
                    <h2 className="text-xl font-semibold text-slate-900 font-headline">
                      {report.property?.name || `Property ID: ${propertyId}`}
                    </h2>
                    <p className="text-slate-600">
                      {report.property?.id ? `Property ID: ${report.property.id} • ` : ''}Month: {report?.month}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-2 bg-slate-100 rounded-lg">
                    <ChartBarIcon className="w-5 h-5 text-slate-600" />
                    <span className="font-medium text-slate-700">Performance Report</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <span className="text-sm font-medium text-slate-600">Confidence</span>
                    <p className={`text-lg font-semibold ${
                      report.confidence === 'HIGH' ? 'text-emerald-600' :
                      report.confidence === 'MEDIUM' ? 'text-amber-600' : 'text-slate-600'
                    }`}>
                      {report.confidence}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <span className="text-sm font-medium text-slate-600">Month Progress</span>
                    <p className="text-lg font-semibold text-slate-900">
                      Day {report.current_day} of {report.days_in_month}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <span className="text-sm font-medium text-slate-600">Data Status</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <CheckCircleIcon className={`w-4 h-4 ${report.data_validation?.is_valid ? 'text-emerald-500' : 'text-red-500'}`} />
                      <span className="text-sm text-slate-700">{report.data_validation?.is_valid ? 'Valid' : 'Invalid'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actual vs Expected */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 font-headline">Actual vs Expected Performance</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <h4 className="text-sm font-semibold text-slate-600 mb-4">Actual (To Date)</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-slate-500">ADR</span>
                        <p className="text-xl font-bold text-slate-900">${report.actual?.adr?.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Nights</span>
                        <p className="text-xl font-bold text-slate-900">{report.actual?.nights_to_date}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Revenue</span>
                        <p className="text-xl font-bold text-slate-900">${report.actual?.revenue_to_date?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-lg">
                    <h4 className="text-sm font-semibold text-slate-600 mb-4">Expected (To Date)</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-slate-500">ADR</span>
                        <p className="text-xl font-bold text-slate-900">${report.expected?.adr?.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Nights</span>
                        <p className="text-xl font-bold text-slate-900">{report.expected?.nights_to_date}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Revenue</span>
                        <p className="text-xl font-bold text-slate-900">${report.expected?.revenue_to_date?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* KPIs */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 font-headline">Key Performance Indicators</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-2">Pace Ratio</div>
                    <div className="text-2xl font-bold text-slate-900">{report.kpis?.pace_ratio?.value?.toFixed(3)}</div>
                    <div className="text-sm text-slate-500">Threshold: {report.kpis?.pace_ratio?.threshold}</div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-2">Nights Pace Ratio</div>
                    <div className="text-2xl font-bold text-slate-900">{report.kpis?.nights_pace_ratio?.value?.toFixed(3)}</div>
                    <div className="text-sm text-slate-500">
                      Range: {report.kpis?.nights_pace_ratio?.low_threshold} - {report.kpis?.nights_pace_ratio?.high_threshold}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-2">ADR Ratio</div>
                    <div className="text-2xl font-bold text-slate-900">{report.kpis?.adr_ratio?.value?.toFixed(3)}</div>
                    <div className="text-sm text-slate-500">
                      Range: {report.kpis?.adr_ratio?.low_threshold} - {report.kpis?.adr_ratio?.high_threshold}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-2">ADR Gap</div>
                    <div className={`text-2xl font-bold ${report.kpis?.adr_gap < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      ${report.kpis?.adr_gap?.toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-500">vs expected</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Forecast */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 font-headline">Revenue Forecast</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-2">Expected Revenue</div>
                    <div className="text-2xl font-bold text-slate-900">${report.expected?.revenue_month?.toLocaleString()}</div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-2">Forecast Revenue</div>
                    <div className="text-2xl font-bold text-slate-900">${report.forecast?.forecast_revenue?.toLocaleString()}</div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-2">Potential Revenue</div>
                    <div className="text-2xl font-bold text-slate-900">${report.forecast?.potential_revenue?.toLocaleString()}</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-slate-600">Forecast vs Target</div>
                      <div className={`text-xl font-bold ${(report.forecast?.forecast_vs_target || 0) < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        ${(report.forecast?.forecast_vs_target || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-600">Variance</div>
                      <div className={`text-xl font-bold ${(report.forecast?.forecast_vs_target_pct || 0) < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {(report.forecast?.forecast_vs_target_pct || 0).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-1">Remaining Free Days</div>
                    <div className="text-lg font-bold text-slate-900">{report.forecast?.remaining_free_days} days</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-1">Forecast After Action</div>
                    <div className="text-lg font-bold text-emerald-600">${report.forecast?.forecast_after_action?.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* OTB */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 font-headline">On The Books (OTB)</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-2">OTB Nights</div>
                    <div className="text-2xl font-bold text-slate-900">{report.otb?.nights}</div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-2">OTB Revenue</div>
                    <div className="text-2xl font-bold text-slate-900">${report.otb?.revenue?.toLocaleString()}</div>
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