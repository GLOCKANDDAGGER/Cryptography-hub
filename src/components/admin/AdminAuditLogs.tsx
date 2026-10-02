import React from 'react';
import { useApp } from '../../context/AppContext';
import { ListFilter, ShieldCheck, Download } from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const { auditLogs, showNotification } = useApp();

  const handleExportLogs = () => {
    const csvContent =
      'Timestamp,Actor,Role,Action,IP,Location,Status,Details\n' +
      auditLogs
        .map(
          (l) =>
            `"${l.timestamp}","${l.actor}","${l.actorRole}","${l.action.replace(/"/g, '""')}","${l.ipAddress}","${l.location}","${l.status}","${l.details.replace(/"/g, '""')}"`
        )
        .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CryptoHub_AuditLogs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showNotification('Audit log export CSV generated for compliance archiving.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0A0E17] border border-[#1E293B] rounded-lg p-5">
        <div>
          <div className="text-xs font-mono text-[#FFA000] uppercase font-semibold">
            IMMUTABLE SECURITY AUDIT TELEMETRY
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Cryptographic Audit Trail
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Tamper-evident system logs recorded across Massachusetts operational clusters.
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-[#111827] border border-slate-700 rounded transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#FFA000]" />
          <span>Export Audit Ledger</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Timestamp (EST)</th>
                <th className="py-2.5 px-3">Actor</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Event / Action</th>
                <th className="py-2.5 px-3">IP / Location</th>
                <th className="py-2.5 px-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#111827]/50 transition-colors">
                  <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-3 px-3 font-bold text-white whitespace-nowrap">{log.actor}</td>
                  <td className="py-3 px-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                      {log.actorRole}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-white max-w-sm">
                    <div>{log.action}</div>
                    {log.details && <div className="text-[10px] text-slate-400 truncate">{log.details}</div>}
                  </td>
                  <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                    {log.ipAddress} · {log.location}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                      {log.status}
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
