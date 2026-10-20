import React, { useState, useEffect } from 'react';
import { UserPlus, Activity, Database, CheckCircle, RefreshCw, Hospital } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const COMMON_DISEASES = [
  { code: 'J10.1', name: 'Influenza with respiratory manifestations' },
  { code: 'U07.1', name: 'COVID-19' },
  { code: 'B97.4', name: 'Respiratory syncytial virus (RSV)' },
  { code: 'A90', name: 'Dengue fever [classical dengue]' },
  { code: 'A08.11', name: 'Acute gastroenteritis (Norovirus)' },
  { code: 'B05.9', name: 'Measles without complication' },
];

export default function App() {
  const [formData, setFormData] = useState({
    name: '',
    mrn: '',
    age: '',
    gender: 'M',
    diseaseCode: 'J10.1',
    diseaseName: 'Influenza with respiratory manifestations',
    admissionDate: new Date().toISOString().split('T')[0],
    department: 'Infectious Disease Ward',
  });

  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/patients`);
      if (res.ok) {
        const data = await res.json();
        setPatients(data.data || []);
      }
    } catch {
      // API offline fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDiseaseChange = (code: string) => {
    const found = COMMON_DISEASES.find((d) => d.code === code);
    setFormData((prev) => ({
      ...prev,
      diseaseCode: code,
      diseaseName: found ? found.name : 'Other Condition',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_BASE}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage('Patient case recorded successfully!');
        setFormData({
          name: '',
          mrn: '',
          age: '',
          gender: 'M',
          diseaseCode: 'J10.1',
          diseaseName: 'Influenza with respiratory manifestations',
          admissionDate: new Date().toISOString().split('T')[0],
          department: 'Infectious Disease Ward',
        });
        fetchPatients();
      } else {
        setMessage('Failed to record patient.');
      }
    } catch {
      setMessage('Error connecting to backend API. Please make sure apps/api is running.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
            <Hospital className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">EpiTrend — Patient Intake Portal</h1>
            <p className="text-xs text-slate-500">Decoupled Medical Entry Terminal · Feeds central surveillance DB</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <Database className="w-3.5 h-3.5 text-teal-600" />
          <span className="text-slate-600 font-medium">Backend:</span>
          <span className="font-mono text-slate-900">{API_BASE}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Add Patient */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs h-fit">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
            <UserPlus className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">New Patient Surveillance Admission</h2>
          </div>

          {message && (
            <div className="mb-4 p-3 rounded-lg text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Patient Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. John Doe"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">MRN (Medical Record No)</label>
                <input
                  type="text"
                  value={formData.mrn}
                  onChange={(e) => setFormData({ ...formData, mrn: e.target.value })}
                  placeholder="Auto-generated if empty"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="e.g. 34"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-teal-600"
                >
                  <option value="M">Male (M)</option>
                  <option value="F">Female (F)</option>
                  <option value="O">Other (O)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Admission Date</label>
                <input
                  type="date"
                  required
                  value={formData.admissionDate}
                  onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ICD-10 Diagnosed Pathogen</label>
              <select
                value={formData.diseaseCode}
                onChange={(e) => handleDiseaseChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-teal-600 font-medium"
              >
                {COMMON_DISEASES.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.code} — {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Admitting Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Emergency Department"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Recording Case...' : 'Submit Patient Case'}
            </button>
          </form>
        </section>

        {/* Right Table: Recent Patients Feed */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-900">Recent Admitted Patients</h2>
              <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
                {patients.length} cases
              </span>
            </div>

            <button
              onClick={fetchPatients}
              disabled={loading}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Refresh Feed"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-600' : ''}`} />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Patient</th>
                  <th className="py-2.5 px-3">MRN / Demog</th>
                  <th className="py-2.5 px-3">ICD-10 Condition</th>
                  <th className="py-2.5 px-3">Admitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      No patients recorded or backend API offline.
                    </td>
                  </tr>
                ) : (
                  patients.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-slate-900">{p.name}</td>
                      <td className="py-2.5 px-3 text-slate-500">
                        <span className="font-mono">{p.mrn}</span> · {p.age}y ({p.gender})
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-block px-1.5 py-0.5 bg-teal-50 text-teal-800 rounded font-mono font-medium text-[11px] mr-1.5">
                          {p.diseaseCode}
                        </span>
                        <span className="text-slate-700">{p.diseaseName}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{p.admissionDate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
