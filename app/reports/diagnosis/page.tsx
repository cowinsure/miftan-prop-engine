'use client';

import { useState } from 'react';
import { getPropertyDiagnosisReport } from '../../api/client';
import DashboardLayout from '../../components/DashboardLayout';
import { DocumentChartBarIcon, MagnifyingGlassIcon, XCircleIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface DiagnosisData {
  property: {
    id: number;
    name: string;
  };
  month: string;
  diagnosis: {
    status: string;
    reason: string;
    action: string;
    action_type: string;
  };
  key_metrics: {
    pace_ratio: {
      value: number;
      threshold: number;
      status: string;
    };
    nights_pace_ratio: {
      value: number;
      low_threshold: number;
      high_threshold: number;
      status: string;
    };
    adr_ratio: {
      value: number;
      low_threshold: number;
      high_threshold: number;
    };
    adr_gap: {
      value: number;
      interpretation: string;
    };
  };
  data_assessment: {
    has_revenue_data: boolean;
    has_nights_data: boolean;
    is_valid: boolean;
    month_progress: number;
  };
  forecast: {
    target_revenue: number;
    forecast_revenue: number;
    potential_revenue: number;
    forecast_vs_target: number;
    forecast_vs_target_pct: number;
  };
  action_value: {
    action_type: string;
    current_adr: number;
    recommended_adr: number;
    adr_change_pct: number;
    current_forecast_revenue: number;
    forecast_after_action: number;
    revenue_impact: number;
    revenue_impact_pct: number;
    potential_occupancy_after_action: number;
    occupancy_change: number;
    confidence: string;
  };
}

export default function DiagnosisReportPage() {
  const [propertyId, setPropertyId] = useState('');
  const [month, setMonth] = useState('');
  const [report, setReport] = useState<DiagnosisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const data = await getPropertyDiagnosisReport({ property_id: propertyId, month });
      setReport(data);
      setSuccess('Diagnosis report generated successfully!');
    } catch (err) {
      setError('Failed to generate diagnosis report. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'on_track':
      case 'good':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'at_risk':
      case 'out_of_range':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'off_track':
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'on_track':
      case 'good':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'at_risk':
      case 'out_of_range':
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      case 'off_track':
      case 'critical':
        return <XCircleIcon className="w-5 h-5" />;
      default:
        return <DocumentChartBarIcon className="w-5 h-5" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 font-headline mb-2">Diagnosis Reports</h1>
        <p className="text-slate-600">Generate comprehensive health assessments and insights for your properties.</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 font-headline">Generate Diagnosis Report</h2>

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
                  <span>Generate Diagnosis Report</span>
                </>
              )}
            </button>
          </div>
        </form>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
          <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3">
          <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
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
                  <div className={`px-4 py-2 rounded-lg border flex items-center space-x-2 ${getHealthColor(report.diagnosis.status)}`}>
                    {getHealthIcon(report.diagnosis.status)}
                    <span className="font-semibold capitalize">{report.diagnosis.status.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 mb-6">
                  <p className="text-slate-700 font-medium">{report.diagnosis.reason}</p>
                  <p className="text-slate-600 text-sm mt-1">{report.diagnosis.action}</p>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 font-headline">Key Performance Metrics</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600">Pace Ratio</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          report.key_metrics.pace_ratio.status === 'GOOD'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {report.key_metrics.pace_ratio.status}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900">{report.key_metrics.pace_ratio.value.toFixed(2)}</div>
                      <div className="text-sm text-slate-500">Threshold: {report.key_metrics.pace_ratio.threshold}</div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600">Nights Pace Ratio</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          report.key_metrics.nights_pace_ratio.status === 'OUT_OF_RANGE'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {report.key_metrics.nights_pace_ratio.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900">{report.key_metrics.nights_pace_ratio.value.toFixed(1)}</div>
                      <div className="text-sm text-slate-500">
                        Range: {report.key_metrics.nights_pace_ratio.low_threshold} - {report.key_metrics.nights_pace_ratio.high_threshold}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-slate-600 mb-2">ADR Ratio</div>
                      <div className="text-2xl font-bold text-slate-900">{report.key_metrics.adr_ratio.value.toFixed(3)}</div>
                      <div className="text-sm text-slate-500">
                        Range: {report.key_metrics.adr_ratio.low_threshold} - {report.key_metrics.adr_ratio.high_threshold}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-slate-600 mb-2">ADR Gap</div>
                      <div className="text-2xl font-bold text-slate-900">${report.key_metrics.adr_gap.value.toFixed(0)}</div>
                      <div className="text-sm text-slate-500">{report.key_metrics.adr_gap.interpretation}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Assessment */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 font-headline">Data Assessment</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-2">Data Availability</div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className={`w-4 h-4 ${report.data_assessment.has_revenue_data ? 'text-emerald-500' : 'text-slate-400'}`} />
                        <span className="text-sm">Revenue</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className={`w-4 h-4 ${report.data_assessment.has_nights_data ? 'text-emerald-500' : 'text-slate-400'}`} />
                        <span className="text-sm">Nights</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-2">Validation Status</div>
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className={`w-5 h-5 ${report.data_assessment.is_valid ? 'text-emerald-500' : 'text-red-500'}`} />
                      <span className="font-medium">{report.data_assessment.is_valid ? 'Valid' : 'Invalid'}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-2">Month Progress</div>
                    <div className="text-2xl font-bold text-slate-900">{(report.data_assessment.month_progress * 100).toFixed(1)}%</div>
                    <div className="text-sm text-slate-500">Month completed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Forecast */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 font-headline">Revenue Forecast</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-2">Target Revenue</div>
                    <div className="text-2xl font-bold text-slate-900">${report.forecast.target_revenue.toLocaleString()}</div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-2">Forecast Revenue</div>
                    <div className="text-2xl font-bold text-slate-900">${report.forecast.forecast_revenue.toLocaleString()}</div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-2">Potential Revenue</div>
                    <div className="text-2xl font-bold text-slate-900">${report.forecast.potential_revenue.toLocaleString()}</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-slate-600">Forecast vs Target</div>
                      <div className={`text-xl font-bold ${report.forecast.forecast_vs_target < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        ${report.forecast.forecast_vs_target.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-600">Variance</div>
                      <div className={`text-xl font-bold ${report.forecast.forecast_vs_target_pct < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {report.forecast.forecast_vs_target_pct.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 font-headline">Recommended Actions</h3>

                <div className="bg-slate-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-slate-900 capitalize">
                      {report.action_value.action_type.replace('_', ' ')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      report.action_value.confidence === 'HIGH'
                        ? 'bg-emerald-100 text-emerald-700'
                        : report.action_value.confidence === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {report.action_value.confidence} Confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm font-medium text-slate-600 mb-2">Current ADR</div>
                      <div className="text-xl font-bold text-slate-900">${report.action_value.current_adr.toFixed(2)}</div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-slate-600 mb-2">Recommended ADR</div>
                      <div className="text-xl font-bold text-blue-600">${report.action_value.recommended_adr.toFixed(2)}</div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-slate-600 mb-2">ADR Change</div>
                      <div className={`text-xl font-bold ${report.action_value.adr_change_pct >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {report.action_value.adr_change_pct.toFixed(1)}%
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-slate-600 mb-2">Revenue Impact</div>
                      <div className={`text-xl font-bold ${report.action_value.revenue_impact >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        ${report.action_value.revenue_impact.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">Projected Revenue After Action:</span> ${report.action_value.forecast_after_action.toLocaleString()}
                      <span className="text-emerald-600 font-medium ml-2">
                        (+{report.action_value.revenue_impact_pct.toFixed(1)}%)
                      </span>
                    </div>
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