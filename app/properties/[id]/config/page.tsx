'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPropertyMonthlyConfig, createPropertyMonthlyConfig } from '../../../api/client';
import { useAuth } from '../../../auth/context';
import DashboardLayout from '../../../components/DashboardLayout';

interface Config {
  id?: number;
  property_id: number;
  year: number;
  month: number;
  market_adr: number;
  market_occupancy: number;
  paf: number;
  pace_threshold: number;
  nights_low_threshold: number;
  nights_high_threshold: number;
  adr_low_threshold: number;
  adr_high_threshold: number;
  early_month_guard_days: number;
  created_by: number;
  remarks: string;
}

export default function PropertyConfigPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [configs, setConfigs] = useState<Config[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Config>({
    property_id: parseInt(id as string),
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    market_adr: 0,
    market_occupancy: 0,
    paf: 0,
    pace_threshold: 0,
    nights_low_threshold: 0,
    nights_high_threshold: 0,
    adr_low_threshold: 0,
    adr_high_threshold: 0,
    early_month_guard_days: 0,
    created_by: user?.id || 1,
    remarks: '',
  });

  useEffect(() => {
    fetchConfigs();
  }, [id]);

  const fetchConfigs = async () => {
    try {
      const data = await getPropertyMonthlyConfig({ property_id: id as string });
      setConfigs(data);
    } catch (err) {
      setError('Failed to load configs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPropertyMonthlyConfig(formData);
      setShowForm(false);
      setFormData({
        property_id: parseInt(id as string),
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        market_adr: 0,
        market_occupancy: 0,
        paf: 0,
        pace_threshold: 0,
        nights_low_threshold: 0,
        nights_high_threshold: 0,
        adr_low_threshold: 0,
        adr_high_threshold: 0,
        early_month_guard_days: 0,
        created_by: user?.id || 1,
        remarks: '',
      });
      fetchConfigs();
    } catch (err) {
      setError('Failed to create config');
    }
  };

  if (loading) return <DashboardLayout><div>Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Property Monthly Config</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {showForm ? 'Cancel' : 'Add Config'}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="p-2 border"
              required
            />
            <input
              type="number"
              placeholder="Month"
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
              className="p-2 border"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Market ADR"
              value={formData.market_adr}
              onChange={(e) => setFormData({ ...formData, market_adr: parseFloat(e.target.value) })}
              className="p-2 border"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Market Occupancy"
              value={formData.market_occupancy}
              onChange={(e) => setFormData({ ...formData, market_occupancy: parseFloat(e.target.value) })}
              className="p-2 border"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="PAF"
              value={formData.paf}
              onChange={(e) => setFormData({ ...formData, paf: parseFloat(e.target.value) })}
              className="p-2 border"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Pace Threshold"
              value={formData.pace_threshold}
              onChange={(e) => setFormData({ ...formData, pace_threshold: parseFloat(e.target.value) })}
              className="p-2 border"
              required
            />
            <input
              type="number"
              placeholder="Nights Low Threshold"
              value={formData.nights_low_threshold}
              onChange={(e) => setFormData({ ...formData, nights_low_threshold: parseInt(e.target.value) })}
              className="p-2 border"
              required
            />
            <input
              type="number"
              placeholder="Nights High Threshold"
              value={formData.nights_high_threshold}
              onChange={(e) => setFormData({ ...formData, nights_high_threshold: parseInt(e.target.value) })}
              className="p-2 border"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="ADR Low Threshold"
              value={formData.adr_low_threshold}
              onChange={(e) => setFormData({ ...formData, adr_low_threshold: parseFloat(e.target.value) })}
              className="p-2 border"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="ADR High Threshold"
              value={formData.adr_high_threshold}
              onChange={(e) => setFormData({ ...formData, adr_high_threshold: parseFloat(e.target.value) })}
              className="p-2 border"
              required
            />
            <input
              type="number"
              placeholder="Early Month Guard Days"
              value={formData.early_month_guard_days}
              onChange={(e) => setFormData({ ...formData, early_month_guard_days: parseInt(e.target.value) })}
              className="p-2 border"
              required
            />
            <textarea
              placeholder="Remarks"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="p-2 border col-span-2"
            />
          </div>
          <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
            Create Config
          </button>
        </form>
      )}

      <div className="space-y-4">
        {configs.map((config) => (
          <div key={`${config.year}-${config.month}`} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">{config.year} - {config.month}</h3>
            <p>Market ADR: {config.market_adr}</p>
            <p>Market Occupancy: {config.market_occupancy}</p>
            <p>PAF: {config.paf}</p>
            <p>Pace Threshold: {config.pace_threshold}</p>
            <p>Nights Threshold: {config.nights_low_threshold} - {config.nights_high_threshold}</p>
            <p>ADR Threshold: {config.adr_low_threshold} - {config.adr_high_threshold}</p>
            <p>Early Guard Days: {config.early_month_guard_days}</p>
            <p>Remarks: {config.remarks}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}