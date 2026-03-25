'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiCalendar, FiSearch } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export interface Fileuploaddata {
  id: number;
  filedescription: string;
  filename: string;
  businessdate: string;
  temp_tbl_count: string;
  data_tbl_count: string;
  succrecord: string;
}

export default function IMPSReconMasterPage() {
  const router = useRouter();
  const [businessDate, setBusinessDate] = useState('');
  const [data, setData] = useState<Fileuploaddata[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // If the API allows, we might pass businessDate as a query param. 
      // The user specified to call this exact API on click.
      const response = await fetch('https://localhost:7193/api/upload/GetUploadedFilesList');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        console.error('Failed to fetch data', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 bg-[#f8fbfc] text-[#333]">
      <div className="flex items-center space-x-4 mb-8">
        <label htmlFor="businessDate" className="text-sm font-semibold text-gray-700 flex items-center min-w-[120px]">
          <FiCalendar className="mr-2 text-[#0a3d75] text-lg" />
          Business Date:
        </label>
        <input
          type="date"
          id="businessDate"
          value={businessDate}
          onChange={(e) => setBusinessDate(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-[#0a3d75] focus:border-[#0a3d75] outline-none transition-all shadow-sm max-w-[200px]"
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

      <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mb-12">
        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Recon Master Records</h2>
          <span className="bg-[#e1e9f1] text-[#0a3d75] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {data.length} records found
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b-2 border-gray-100">
                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Id</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">File Description</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Filename</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Business Date</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Temp_Tbl_Count</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Data_Tbl_Count</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Succrecord</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-gray-800">
              {data.length > 0 ? (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-[#f0f4f8] transition-colors group">
                    <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-gray-900 border-l-4 border-transparent group-hover:border-[#0a3d75] transition-all">{row.id || '-'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{row.filedescription || '-'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-[#0a3d75] font-bold">{row.filename || '-'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 font-medium text-center">{row.businessdate || '-'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600 font-mono bg-gray-50/30 text-center">{row.temp_tbl_count || '-'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600 font-mono bg-gray-50/30 text-center">{row.data_tbl_count || '-'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-green-700 font-mono font-bold bg-green-50/30 text-center">{row.succrecord || '-'}</td>
                  </tr>
                ))
              ) : (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-500 font-medium">
                  No records to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => {
            const url = '/dashboard/ReconProcess/IMPS/ReconMaster/ProcessRecon' + (businessDate ? `?date=${businessDate}` : '');
            router.push(url);
          }}
          className="bg-[#0a3d75] text-white text-xl font-bold px-10 py-3 rounded shadow hover:bg-[#072e5a] transition"
        >
          Go to Recon
        </button>
      </div>
    </div>
  );
}