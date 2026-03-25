'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { FiCalendar, FiSearch } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export interface ReportsModel {
    reportstatusid: number;
    reportid: number;
    reportname: string;
    reportstatus: string;
    reportdate: string;
    reportedon: string;
    generatedOn: string;
    reportfilepath: string | null;
    ttumreportfilepath: string | null;
    ftmid: number;
    ActionFlag: string;
    FileName: string;
    daterangereport: boolean;
    reporttodate: string;
}

export default function IMPSReportsPage() {
    const [businessDate, setBusinessDate] = useState<string>('');
    const [reportsData, setReportsData] = useState<ReportsModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [globalSearch, setGlobalSearch] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [networks, setNetworks] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [fileTypes, setFileTypes] = useState<any[]>([]);

    const [selectedNetwork, setSelectedNetwork] = useState<string>('');
    const [selectedReport, setSelectedReport] = useState<string>('');
    const [selectedFileType, setSelectedFileType] = useState<string>('');
    const [modalReportDate1, setModalReportDate1] = useState<string>('');
    const [modalReportDate2, setModalReportDate2] = useState<string>('');

    // Fetch initial modal data on load
    useEffect(() => {
        if (isModalOpen) {
            fetch('https://localhost:7193/api/Reports/GetNetworkList?Channel=IMPS')
                .then(res => res.json())
                .then(data => setNetworks(data || []))
                .catch(err => console.error(err));
                
            fetch('https://localhost:7193/api/Reports/GetFileTypeList')
                .then(res => res.json())
                .then(data => setFileTypes(data || []))
                .catch(err => console.error(err));
        }
    }, [isModalOpen]);

    const handleNetworkChange = async (networkId: string) => {
        setSelectedNetwork(networkId);
        setSelectedReport(''); // reset report when network changes
        if (!networkId) {
            setReports([]);
            return;
        }
        try {
            const res = await fetch(`https://localhost:7193/api/Reports/GetReportListById?id=${networkId}`);
            if (res.ok) {
                const data = await res.json();
                setReports(data || []);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleModalSubmit = async () => {
        if (!selectedReport || !selectedFileType || !modalReportDate1) {
            alert("Please select Report, File Type, and Report Date");
            return;
        }
        try {
            const payload = {
                reportstatusid: 0,
                reportid: parseInt(selectedReport, 10),
                reportdate: modalReportDate1,
                ftmid: parseInt(selectedFileType, 10),
                ActionFlag: null
            };
            const res = await fetch('https://localhost:7193/api/Reports/InsertReportRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                alert('Report request submitted successfully');
                setIsModalOpen(false);
                setSelectedNetwork('');
                setSelectedReport('');
                setSelectedFileType('');
                setModalReportDate1('');
                setModalReportDate2('');
                handleSearch(); // Refresh the main table
            } else {
                alert('Failed to submit request');
            }
        } catch (error) {
             console.error(error);
             alert('Error submitting request');
        }
    };

    const handleSearch = async () => {
        if (!businessDate) {
            alert("Please select a date");
            return;
        }
        setLoading(true);
        try {
            // API call
            const res = await fetch(`https://localhost:7193/api/Reports/GetReportData?id=0&BusinessDate=${businessDate}&Network=IMPS`);
            if (res.ok) {
                const data = await res.json();
                setReportsData(data || []);
            } else {
                alert("Failed to fetch reports");
            }
        } catch (error) {
            console.error(error);
            alert("Error fetching reports");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reportstatusid: number) => {
        if (!confirm("Are you sure you want to delete this request?")) return;
        
        try {
            // Delete API call
            const res = await fetch(`https://localhost:7193/api/Reports/Delete?id=${reportstatusid}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                alert("Request deleted successfully");
                handleSearch(); // Refresh list
            } else {
                alert("Failed to delete request");
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting request");
        }
    };

    const filteredData = useMemo(() => {
        if (!globalSearch) return reportsData;
        const lowerSearch = globalSearch.toLowerCase();
        return (reportsData || []).filter(row => 
            (row.reportname || '').toLowerCase().includes(lowerSearch) ||
            (row.reportstatus || '').toLowerCase().includes(lowerSearch) ||
            (row.FileName || '').toLowerCase().includes(lowerSearch) ||
            (row.reportdate || '').toLowerCase().includes(lowerSearch) ||
            (row.reportedon || '').toLowerCase().includes(lowerSearch)
        );
    }, [reportsData, globalSearch]);

    return (
        <div className="flex flex-col min-h-screen p-6 bg-[#f8fbfc] text-[#333]">
           {/* Header Area */}
           <div className="flex justify-between items-center mb-6">
               <h1 className="text-2xl text-gray-700">IMPS Report Status</h1>
               <div className="flex flex-col items-end space-y-2">
                   <div className="text-sm text-gray-500 flex items-center">
                       <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                       <span className="cursor-pointer hover:underline text-gray-400">Home</span> <span className="mx-2 text-gray-300">&gt;</span> <span className="cursor-pointer hover:underline text-gray-400">Layout</span> <span className="mx-2 text-gray-300">&gt;</span> <span className="text-gray-500">IMPS Report Status</span>
                   </div>
                   <button 
                       onClick={() => setIsModalOpen(true)}
                       className="bg-[#0a3d75] hover:bg-[#072e5a] text-white px-4 py-2 rounded text-sm font-medium flex items-center shadow"
                   >
                       <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                       New Report Request
                   </button>
               </div>
           </div>

           {/* Main Card */}
           <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 mb-6 flex justify-between items-center p-3 rounded-xl">
               <div className="flex items-center space-x-4">
                   <label htmlFor="businessDate" className="text-sm font-semibold text-gray-700 flex items-center min-w-[120px]">
                       <FiCalendar className="mr-2 text-[#0a3d75] text-lg" />
                       Business Date:
                   </label>
                   <input 
                       type="date" 
                       id="businessDate"
                       className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-[#0a3d75] focus:border-[#0a3d75] outline-none transition-all shadow-sm max-w-[200px]"
                       value={businessDate}
                       onChange={(e) => setBusinessDate(e.target.value)}
                   />
                   <button 
                       onClick={handleSearch}
                       disabled={loading}
                       className="inline-flex items-center px-6 py-2.5 border-2 border-blue-500 text-sm font-bold rounded-lg text-white bg-blue-500 hover:bg-blue-600 hover:border-blue-600 focus:outline-none transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                   >
                       {loading ? (
                           <AiOutlineLoading3Quarters className="animate-spin mr-2 text-lg" />
                       ) : (
                           <FiSearch className="mr-2 text-lg" />
                       )}
                       Search
                   </button>
               </div>
               <button 
                   onClick={handleSearch}
                   title="Refresh"
                   className="p-2 border border-[#0a3d75] rounded-lg text-[#0a3d75] hover:bg-[#f0f4f8] shadow-sm transition-colors"
               >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
               </button>
           </div>

           {/* Table Search Input */}
           <div className="flex justify-end mb-2">
               <div className="flex items-center">
                   <label className="text-sm text-gray-600 mr-2">Search:</label>
                   <input 
                       type="text" 
                       className="border border-gray-300 px-2 py-1 outline-none text-sm w-48"
                       value={globalSearch}
                       onChange={(e) => setGlobalSearch(e.target.value)}
                   />
               </div>
           </div>

           {/* Table */}
           <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden relative">
               <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                   <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Reports Data List</h2>
                   <span className="bg-[#e1e9f1] text-[#0a3d75] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                       {filteredData.length} records found
                   </span>
               </div>
               
               <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse table-fixed">
                       <thead>
                           {/* Header Row */}
                           <tr className="bg-gray-50/50 border-b-2 border-gray-100">
                               <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-[12%]">
                                   Report Name <span className="opacity-50 ml-1">↓↑</span>
                               </th>
                               <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-[12%]">
                                   Report Status <span className="opacity-50 ml-1">↓↑</span>
                               </th>
                               <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-[12%]">
                                   Request Date <span className="opacity-50 ml-1">↓↑</span>
                               </th>
                               <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-[12%]">
                                   Report Date <span className="opacity-50 ml-1">↓↑</span>
                               </th>
                               <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-[15%]">
                                   File Name <span className="opacity-50 ml-1">↓↑</span>
                               </th>
                               <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                                   Voucher
                               </th>
                               <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                                   Trickle Feed
                               </th>
                               <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                                   Action
                               </th>
                           </tr>
                       </thead>
                       <tbody className="bg-white divide-y divide-gray-100">
                           {filteredData.length > 0 ? (
                               filteredData.map((row) => (
                                   <tr key={row.reportstatusid} className="hover:bg-[#f0f4f8] transition-colors group text-center">
                                       <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-gray-900 border-l-4 border-transparent group-hover:border-[#0a3d75] transition-all">{row.reportname || '-'}</td>
                                       <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{row.reportstatus || '-'}</td>
                                       <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{row.reportdate || '-'}</td>
                                       <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{row.reportedon || '-'}</td>
                                       <td className="px-5 py-4 whitespace-nowrap text-sm text-[#0a3d75] font-bold">{row.FileName || '-'}</td>
                                       <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600 font-mono bg-gray-50/30">
                                            {row.reportfilepath ? (
                                                <a href={row.reportfilepath} download className="text-blue-600 hover:underline">Download</a>
                                            ) : '-'}
                                       </td>
                                       <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600 font-mono bg-gray-50/30">
                                            {row.ttumreportfilepath ? (
                                                <a href={row.ttumreportfilepath} download className="text-blue-600 hover:underline">Download</a>
                                            ) : '-'}
                                       </td>
                                       <td className="px-5 py-4 whitespace-nowrap">
                                           <button 
                                               onClick={() => handleDelete(row.reportstatusid)}
                                               className="text-red-500 hover:text-red-700 font-semibold transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md"
                                           >
                                               Delete
                                           </button>
                                       </td>
                                   </tr>
                               ))
                           ) : (
                               <tr>
                                   <td colSpan={8} className="text-center py-12 text-gray-500 font-medium">
                                       {loading ? 'Searching...' : 'No records found.'}
                                   </td>
                               </tr>
                           )}
                       </tbody>
                   </table>
               </div>
           </div>

           {/* Pagination placeholder matching image */}
           <div className="flex justify-end mt-4">
               <div className="flex border border-gray-300 rounded overflow-hidden">
                   <button className="px-3 py-1 bg-white text-gray-600 text-sm hover:bg-gray-50 border-r border-gray-300">Previous</button>
                   <button className="px-3 py-1 bg-white text-gray-600 text-sm hover:bg-gray-50">Next</button>
               </div>
           </div>

           {/* Footer */}
           <div className="text-center text-gray-500 text-sm mt-12 mb-4">
               Copyright © 2026 <strong className="text-gray-700">Paysis</strong>. All rights reserved.
           </div>

           {/* Request Report Modal */}
           {isModalOpen && (
               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                   <div className="bg-white rounded shadow-lg w-[600px] overflow-hidden">
                       <div className="flex justify-between items-center p-4 border-b border-gray-200">
                           <h2 className="text-[#4a3675] text-lg font-semibold">Request Report</h2>
                           <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                           </button>
                       </div>

                       <div className="p-6 space-y-4">
                           <div className="flex items-center border border-gray-300 rounded-sm">
                               <div className="w-[30%] px-4 py-2 border-r border-gray-300 bg-gray-50 text-sm text-gray-600 font-medium">Network</div>
                               <select 
                                   className="w-[70%] px-4 py-2 outline-none text-sm text-gray-700 bg-white"
                                   value={selectedNetwork}
                                   onChange={(e) => handleNetworkChange(e.target.value)}
                               >
                                   <option value="">Select Network...</option>
                                   {networks.map(net => (
                                       <option key={net.id} value={net.id}>{net.networkname}</option>
                                   ))}
                               </select>
                           </div>

                           <div className="flex items-center border border-gray-300 rounded-sm">
                               <div className="w-[30%] px-4 py-2 border-r border-gray-300 bg-gray-50 text-sm text-gray-600 font-medium">Report</div>
                               <select 
                                   className="w-[70%] px-4 py-2 outline-none text-sm text-gray-700 bg-white"
                                   value={selectedReport}
                                   onChange={(e) => setSelectedReport(e.target.value)}
                               >
                                   <option value="">Select Report...</option>
                                   {reports.map(rep => (
                                       <option key={rep.reportid} value={rep.reportid}>{rep.reportname}</option>
                                   ))}
                               </select>
                           </div>

                           <div className="flex items-center border border-gray-300 rounded-sm">
                               <div className="w-[30%] px-4 py-2 border-r border-gray-300 bg-gray-50 text-sm text-gray-600 font-medium">FileType</div>
                               <select 
                                   className="w-[70%] px-4 py-2 outline-none text-sm text-gray-700 bg-white"
                                   value={selectedFileType}
                                   onChange={(e) => setSelectedFileType(e.target.value)}
                               >
                                   <option value="">Select File Type...</option>
                                   {fileTypes.map(ft => (
                                       <option key={ft.ftmid} value={ft.ftmid}>{ft.filetypename}</option>
                                   ))}
                               </select>
                           </div>

                           <div className="flex items-center border border-gray-300 rounded-sm">
                               <div className="w-[30%] px-4 py-2 border-r border-gray-300 bg-gray-50 text-sm text-gray-600 font-medium">Report Date</div>
                               <input 
                                   type="date"
                                   className="w-[70%] px-4 py-2 outline-none text-sm text-gray-700"
                                   value={modalReportDate1}
                                   onChange={(e) => setModalReportDate1(e.target.value)}
                               />
                           </div>

                           <div className="flex items-center border border-gray-300 rounded-sm">
                               <div className="w-[30%] px-4 py-2 border-r border-gray-300 bg-gray-50 text-sm text-gray-600 font-medium">Report Date</div>
                               <input 
                                   type="date"
                                   className="w-[70%] px-4 py-2 outline-none text-sm text-gray-700"
                                   value={modalReportDate2}
                                   onChange={(e) => setModalReportDate2(e.target.value)}
                               />
                           </div>
                       </div>

                       <div className="px-6 py-4 flex justify-between bg-white border-t border-gray-200">
                           <button 
                               onClick={() => setIsModalOpen(false)}
                               className="px-6 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 shadow-sm"
                           >
                               Close
                           </button>
                           <button 
                               onClick={handleModalSubmit}
                               className="px-6 py-2 bg-[#0a3d75] hover:bg-[#072e5a] text-white rounded text-sm font-medium shadow-sm transition-colors"
                           >
                               Submit
                           </button>
                       </div>
                   </div>
               </div>
           )}
        </div>
    );
}