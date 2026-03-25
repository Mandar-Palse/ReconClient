'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export interface RecongroupList {
    id: number;
    recongroupname: string;
}

export interface ReconStatusMaster {
    id: number;
    recondate: string;
    recongroupname: string;
    function_name: string;
    statusname: string;
    requestdatetime: string;
    requestclosedatetime: string;
    Action: string;
}

function ProcessReconContent() {
    const searchParams = useSearchParams();
    const businessDate = searchParams.get('date') || '';

    const [reconGroups, setReconGroups] = useState<RecongroupList[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string>('');
    const [statusData, setStatusData] = useState<ReconStatusMaster[]>([]);
    
    const [loadingGroups, setLoadingGroups] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (businessDate) {
            fetchGroups();
            fetchStatus();
        }
    }, [businessDate]);

    const fetchGroups = async () => {
        setLoadingGroups(true);
        try {
            const res = await fetch(`https://localhost:7193/api/ReconDetails/GetReconGroupList?businessDate=${businessDate}&channel=IMPS`);
            if (res.ok) {
                const data = await res.json();
                setReconGroups(data);
            }
        } catch (error) {
            console.error('Failed to fetch groups', error);
        } finally {
            setLoadingGroups(false);
        }
    };

    const fetchStatus = async () => {
        setLoadingStatus(true);
        try {
            const res = await fetch(`https://localhost:7193/api/ReconDetails/GetReconStatus?businessDate=${businessDate}&channel=IMPS`);
            if (res.ok) {
                const data = await res.json();
                setStatusData(data);
            }
        } catch (error) {
            console.error('Failed to fetch status', error);
        } finally {
            setLoadingStatus(false);
        }
    };

    const handleProcessRecon = async () => {
        if (!selectedGroup) {
            alert("Please select a Recon Group");
            return;
        }
        setProcessing(true);
        try {
            const payload = {
                ReconGroupId: parseInt(selectedGroup),
                BusinessDate: businessDate,
                RequestedBy: 1
            };
            
            const res = await fetch(`https://localhost:7193/api/ReconDetails/RaiseReconRequest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (res.ok) {
                const result = await res.text();
                alert(`${result}`);
                fetchStatus();
            } else {
                alert('Failed to process recon');
            }
        } catch (error) {
            console.error('Error raising request', error);
            alert('Error raising request');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen p-6 bg-[#f8fbfc] text-[#333]">
           <div className="bg-white shadow-sm rounded-md p-10 mb-8 max-w-3xl mx-auto w-full border border-gray-100 flex flex-col items-center">
               <div className="flex items-center justify-center w-full max-w-lg mb-6 border-b border-gray-200 pb-6">
                   <div className="w-1/3 text-right pr-4 font-bold text-gray-600 text-lg">Business Date:</div>
                   <div className="w-2/3 font-semibold text-lg text-gray-900">{businessDate || 'Not selected'}</div>
               </div>
               
               <div className="flex items-center justify-center w-full max-w-lg mb-8">
                   <div className="w-1/3 text-right pr-4 font-bold text-gray-600 text-lg">Recon Group:</div>
                   <div className="w-2/3">
                       <select 
                           className="w-full border border-gray-300 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-[#0a3d75] bg-white"
                           value={selectedGroup}
                           onChange={(e) => setSelectedGroup(e.target.value)}
                       >
                           <option value="">Select Recon Group</option>
                           {reconGroups.map(g => (
                               <option key={g.id} value={g.id}>{g.recongroupname}</option>
                           ))}
                       </select>
                   </div>
               </div>

               <button 
                   onClick={handleProcessRecon}
                   disabled={processing || !selectedGroup}
                   className={`bg-[#0a3d75] text-white px-8 py-3 rounded font-bold text-lg shadow hover:bg-[#072e5a] transition w-72 ${(!selectedGroup || processing) ? 'opacity-50 cursor-not-allowed' : ''}`}
               >
                   {processing ? 'Processing...' : 'Process Recon'}
               </button>
           </div>

           <div className="mb-3">
               <h3 className="text-gray-600 font-semibold text-sm">Darta d class ReconStatusMaster</h3>
           </div>
           
           <div className="bg-white border text-left border-gray-200 shadow-sm rounded-sm overflow-x-auto mb-12">
               <table className="min-w-full border-collapse">
                   <thead className="bg-[#f2f2f2] text-gray-700 border-b">
                       <tr>
                           <th className="px-5 py-4 font-semibold text-sm border-r border-gray-300">ID</th>
                           <th className="px-5 py-4 font-semibold text-sm border-r border-gray-300">Recon Date</th>
                           <th className="px-5 py-4 font-semibold text-sm border-r border-gray-300">Recon Group</th>
                           <th className="px-5 py-4 font-semibold text-sm border-r border-gray-300">Function Name</th>
                           <th className="px-5 py-4 font-semibold text-sm border-r border-gray-300">Status</th>
                           <th className="px-5 py-4 font-semibold text-sm border-r border-gray-300">Request DateTime</th>
                           <th className="px-5 py-4 font-semibold text-sm border-r border-gray-300">Request Close Date</th>
                           <th className="px-5 py-4 font-semibold text-sm">Action</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-200 text-gray-800">
                       {statusData.length > 0 ? (
                           statusData.map((row) => (
                               <tr key={row.id} className="hover:bg-gray-50">
                                   <td className="px-5 py-4">{row.id}</td>
                                   <td className="px-5 py-4">{row.recondate}</td>
                                   <td className="px-5 py-4">{row.recongroupname}</td>
                                   <td className="px-5 py-4">{row.function_name}</td>
                                   <td className="px-5 py-4">{row.statusname}</td>
                                   <td className="px-5 py-4">{row.requestdatetime}</td>
                                   <td className="px-5 py-4">{row.requestclosedatetime || '-'}</td>
                                   <td className="px-5 py-4">
                                       <button className="bg-[#0a3d75] text-white px-4 py-1.5 rounded text-sm font-semibold hover:bg-[#072e5a] shadow-sm">
                                            Rerun
                                       </button>
                                   </td>
                               </tr>
                           ))
                       ) : (
                           <tr>
                               <td colSpan={8} className="text-center py-8 text-gray-500">
                                   {loadingStatus ? 'Loading...' : 'No records to display.'}
                               </td>
                           </tr>
                       )}
                   </tbody>
               </table>
           </div>
        </div>
    );
}

export default function ProcessReconPage() {
    return (
        <Suspense fallback={<div className="p-6">Loading Process Recon...</div>}>
            <ProcessReconContent />
        </Suspense>
    );
}