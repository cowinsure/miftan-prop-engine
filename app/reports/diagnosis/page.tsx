'use client';

import { useState } from 'react';
import { getPropertyDiagnosisReport } from '../../api/client';
import DashboardLayout from '../../components/DashboardLayout';
import { DocumentChartBarIcon, MagnifyingGlassIcon, XCircleIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface DiagnosisData {
  month: string;
  status: string;
  property: {
    id: number;
    name: string;
  };
  action_type: string;
  recommended_adr: number;
  diagnosis_reference: {
    on_track: {
      action: string;
      condition: string;
      description: string;
    };
    adr_too_low: {
      action: string;
      condition: string;
      description: string;
    };
    underpriced: {
      action: string;
      condition: string;
      description: string;
    };
    adr_too_high: {
      action: string;
      condition: string;
      description: string;
    };
    price_too_high: {
      action: string;
      condition: string;
      description: string;
    };
    underperforming: {
      action: string;
      condition: string;
      description: string;
    };
    low_booking_pace: {
      action: string;
      condition: string;
      description: string;
    };
  };
}

interface ApiResponse {
  status: string;
  message: string;
  data: DiagnosisData[];
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
      const formattedMonth = `2026-${month.padStart(2, '0')}-01`;
      const response = await getPropertyDiagnosisReport({ property_id: propertyId, month: formattedMonth });
      
      // Handle the new response structure with data array
      if (response.data && response.data.length > 0) {
        setReport(response.data[0]);
        setSuccess('Diagnosis report generated successfully!');
      } else {
        setError('No data found for the selected property and month.');
      }
    } catch (err) {
      setError('Failed to generate diagnosis report. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (status: string) => {
    if (!status) return 'text-slate-600 bg-slate-50 border-slate-200';
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
    if (!status) return <DocumentChartBarIcon className="w-5 h-5" />;
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
                    <h2 className="text-xl font-semibold text-slate-900 font-headline">
                      {report.property?.name || `Property ID: ${propertyId}`}
                    </h2>
                    <p className="text-slate-600">
                      {report.property?.id ? `Property ID: ${report.property.id} • ` : ''}Month: {report?.month}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-lg border flex items-center space-x-2 ${getHealthColor(report?.status)}`}>
                    {getHealthIcon(report?.status)}
                    <span className="font-semibold capitalize">{report?.status?.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-slate-600">Action Type</span>
                      <p className="text-slate-900 font-semibold capitalize">{report?.action_type?.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-600">Recommended ADR</span>
                      <p className="text-slate-900 font-semibold">${report?.recommended_adr?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnosis Reference */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 font-headline">Diagnosis Reference</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(report?.diagnosis_reference || {}).map(([key, value]: [string, any]) => (
                    <div 
                      key={key} 
                      className={`p-4 rounded-lg border ${
                        key === report?.action_type?.toLowerCase().replace(' ', '_') || key === 'on_track'
                          ? 'bg-emerald-50 border-emerald-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-900 capitalize">{key.replace('_', ' ')}</span>
                        {key === report?.action_type?.toLowerCase().replace(' ', '_') && (
                          <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mb-1">{value.condition}</p>
                      <p className="text-sm text-slate-700">{value.description}</p>
                      <div className="mt-2 pt-2 border-t border-slate-200">
                        <span className="text-xs font-medium text-slate-500">Action: </span>
                        <span className="text-xs text-slate-700 capitalize">{value.action?.replace('_', ' ')}</span>
                      </div>
                    </div>
                  ))}
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