'use client';

import { useEffect, useRef, useState } from 'react';
import { getPropertyDiagnosisReport, getProperties } from '../../api/client';
import DashboardLayout from '../../components/DashboardLayout';
import {
  MagnifyingGlassIcon,
  XCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  ChevronDownIcon,
  CheckIcon,
  CurrencyDollarIcon,
  BoltIcon,
  DocumentChartBarIcon,
} from '@heroicons/react/24/outline';

// ── Types ────────────────────────────────────────────────────────────────────

interface DiagnosisEntry {
  action: string;
  condition: string;
  description: string;
}

interface DiagnosisData {
  month: string;
  status: string;
  property: { id: number; name: string };
  action_type: string;
  recommended_adr: number;
  diagnosis_reference: Record<string, DiagnosisEntry>;
}

interface Property {
  id: number;
  property_code: string;
  property_name: string;
  is_active: boolean;
}

// ── Shared dropdown helpers ──────────────────────────────────────────────────

type DropPos = { top: number; left: number; width: number };

function calcPos(el: HTMLElement): DropPos {
  const r = el.getBoundingClientRect();
  return { top: r.bottom + 4, left: r.left, width: r.width };
}

function useFloatingClose(
  a: React.RefObject<HTMLElement | null>,
  b: React.RefObject<HTMLElement | null>,
  open: boolean,
  close: () => void,
) {
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (!a.current?.contains(e.target as Node) && !b.current?.contains(e.target as Node))
        close();
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open, a, b, close]);
}

// ── Property dropdown ────────────────────────────────────────────────────────

function PropertyDropdown({
  properties, loading, value, onChange,
}: {
  properties: Property[];
  loading: boolean;
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<DropPos>({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useFloatingClose(triggerRef, panelRef, open, () => setOpen(false));

  const toggle = () => {
    if (!open && triggerRef.current) setPos(calcPos(triggerRef.current));
    setOpen(v => !v);
  };

  const selected = properties.find(p => String(p.id) === value);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={loading}
        onClick={toggle}
        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 border rounded-lg text-sm transition-all ${
          open ? 'border-indigo-400 ring-2 ring-indigo-500/20 bg-white'
               : 'border-gray-200 bg-gray-50/60 hover:border-gray-300 hover:bg-white'
        } ${loading ? 'opacity-60 cursor-wait' : 'cursor-pointer'}`}
      >
        <BuildingOffice2Icon className="w-4 h-4 text-slate-300 shrink-0" />
        {loading ? (
          <span className="flex items-center gap-2 text-slate-400 flex-1">
            <span className="w-3 h-3 border border-slate-300 border-t-transparent rounded-full animate-spin" />
            Loading…
          </span>
        ) : selected ? (
          <span className="flex-1 flex items-center gap-2 min-w-0">
            <span className="text-slate-900 font-medium truncate">{selected.property_name}</span>
            <span className="text-[0.6rem] font-mono font-bold text-indigo-500 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded shrink-0">
              {selected.property_code}
            </span>
          </span>
        ) : (
          <span className="text-gray-300 flex-1">Select a property</span>
        )}
        <ChevronDownIcon className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${open ? '-rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          ref={panelRef}
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
          className="bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-1"
        >
          <div className="max-h-52 overflow-y-auto">
            {properties.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-5">No properties available</p>
            ) : properties.map(p => {
              const isSel = String(p.id) === value;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { onChange(String(p.id)); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${isSel ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 ${isSel ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                    <BuildingOffice2Icon className={`w-3.5 h-3.5 ${isSel ? 'text-indigo-600' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate leading-tight ${isSel ? 'text-indigo-900' : 'text-slate-800'}`}>{p.property_name}</p>
                    <p className="text-[0.6rem] text-slate-400 mt-0.5">ID #{p.id}</p>
                  </div>
                  <span className="text-[0.6rem] font-mono font-bold text-indigo-500 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded shrink-0">
                    {p.property_code}
                  </span>
                  {isSel && <CheckIcon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

// ── Month picker ─────────────────────────────────────────────────────────────

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function MonthPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<DropPos>({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useFloatingClose(triggerRef, panelRef, open, () => setOpen(false));

  const toggle = () => {
    if (!open && triggerRef.current) setPos(calcPos(triggerRef.current));
    setOpen(v => !v);
  };

  const label = value ? MONTHS[parseInt(value) - 1] : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 border rounded-lg text-sm transition-all cursor-pointer ${
          open ? 'border-indigo-400 ring-2 ring-indigo-500/20 bg-white'
               : 'border-gray-200 bg-gray-50/60 hover:border-gray-300 hover:bg-white'
        }`}
      >
        <CalendarDaysIcon className="w-4 h-4 text-slate-300 shrink-0" />
        <span className={`flex-1 text-left ${label ? 'text-slate-900 font-medium' : 'text-gray-300'}`}>
          {label ?? 'Select month'}
        </span>
        <ChevronDownIcon className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${open ? '-rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          ref={panelRef}
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
          className="bg-white border border-gray-100 rounded-xl shadow-xl p-2"
        >
          <div className="grid grid-cols-4 gap-1">
            {MONTHS.map((m, i) => {
              const v = String(i + 1);
              const isSel = value === v;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => { onChange(v); setOpen(false); }}
                  className={`py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isSel ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

// ── Status helpers ───────────────────────────────────────────────────────────

function statusStyle(status: string) {
  switch (status?.toLowerCase()) {
    case 'on_track':
    case 'good':
      return { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircleIcon };
    case 'at_risk':
    case 'out_of_range':
      return { cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: ExclamationTriangleIcon };
    case 'off_track':
    case 'critical':
      return { cls: 'bg-red-50 text-red-700 border-red-200', icon: XCircleIcon };
    default:
      return { cls: 'bg-slate-50 text-slate-600 border-slate-200', icon: DocumentChartBarIcon };
  }
}

function fmt(key: string) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DiagnosisReportPage() {
  const [propertyId, setPropertyId] = useState('');
  const [month, setMonth] = useState('');
  const [report, setReport] = useState<DiagnosisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  useEffect(() => {
    getProperties()
      .then(data => {
        const arr: Property[] = Array.isArray(data) ? data : (data?.results ?? data?.data ?? []);
        setProperties(arr.filter(p => p.is_active));
      })
      .catch(() => {})
      .finally(() => setPropertiesLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setReport(null);
    try {
      const year = new Date().getFullYear();
      const formattedMonth = `${year}-${month.padStart(2, '0')}-01`;
      const response = await getPropertyDiagnosisReport({ property_id: propertyId, month: formattedMonth });
      if (response.data?.length > 0) {
        setReport(response.data[0]);
      } else {
        setError('No data found for the selected property and month.');
      }
    } catch {
      setError('Failed to generate report. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[1.6rem] font-bold text-slate-900 font-headline tracking-tight leading-none mb-1">
          Diagnosis Reports
        </h1>
        <p className="text-sm text-slate-400">Generate health assessments and pricing insights for your properties.</p>
      </div>

      <div className="max-w-3xl space-y-5">

        {/* Form card */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-slate-900 font-headline">Generate Report</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-[0.65rem] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Property
                </label>
                <PropertyDropdown
                  properties={properties}
                  loading={propertiesLoading}
                  value={propertyId}
                  onChange={setPropertyId}
                />
              </div>
              <div>
                <label className="block text-[0.65rem] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Month
                </label>
                <MonthPicker value={month} onChange={setMonth} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !propertyId || !month}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4 opacity-80" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating…
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="w-4 h-4" />
                  Generate Diagnosis Report
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            <XCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Report */}
        {report && (() => {
          const { cls, icon: StatusIcon } = statusStyle(report.status);
          const activeKey = report.action_type?.toLowerCase();

          return (
            <div className="space-y-4">

              {/* Overview card */}
              <div className="bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900 font-headline">
                      {report.property?.name || `Property #${propertyId}`}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {report.property?.id && `ID #${report.property.id} · `}Period: {report.month}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${cls}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {fmt(report.status)}
                  </span>
                </div>

                <div className="p-6 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                      <BoltIcon className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Action Type</p>
                      <p className="text-sm font-bold text-slate-900">{fmt(report.action_type)}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg shrink-0">
                      <CurrencyDollarIcon className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Recommended ADR</p>
                      <p className="text-sm font-bold text-emerald-700">${report.recommended_adr?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Diagnosis reference */}
              <div className="bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <p className="text-sm font-semibold text-slate-900 font-headline">Diagnosis Reference</p>
                  <p className="text-xs text-slate-400 mt-0.5">Active condition is highlighted</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(report.diagnosis_reference ?? {}).map(([key, val]) => {
                      const isActive = key === activeKey;
                      return (
                        <div
                          key={key}
                          className={`rounded-xl p-4 border transition-all ${
                            isActive
                              ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-300'
                              : 'bg-gray-50 border-gray-100'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-bold ${isActive ? 'text-indigo-700' : 'text-slate-700'}`}>
                              {fmt(key)}
                            </span>
                            {isActive && (
                              <span className="text-[0.6rem] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded-full">
                                Active
                              </span>
                            )}
                          </div>

                          <p className={`text-[0.7rem] mb-1.5 leading-snug ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                            {val.condition}
                          </p>
                          <p className={`text-xs leading-relaxed mb-3 ${isActive ? 'text-indigo-800' : 'text-slate-600'}`}>
                            {val.description}
                          </p>

                          <div className={`pt-2.5 border-t ${isActive ? 'border-indigo-200' : 'border-gray-200'}`}>
                            <span className={`text-[0.65rem] font-semibold uppercase tracking-wide ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}>
                              Action
                            </span>
                            <p className={`text-xs font-medium mt-0.5 ${isActive ? 'text-indigo-700' : 'text-slate-600'}`}>
                              {fmt(val.action)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          );
        })()}

      </div>
    </DashboardLayout>
  );
}
