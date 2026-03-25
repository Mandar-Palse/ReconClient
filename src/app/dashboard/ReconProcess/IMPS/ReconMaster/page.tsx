'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

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
        <label className="font-bold text-gray-800 text-lg">Business Date:</label>
        <div className="flex items-center border border-gray-300 bg-white rounded overflow-hidden shadow-sm">
          <input
            type="date"
            className="px-3 py-2 outline-none text-gray-700 w-44"
            value={businessDate}
            onChange={(e) => setBusinessDate(e.target.value)}
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-[#0a3d75] text-white px-6 py-2 rounded font-semibold shadow hover:bg-[#072e5a] transition"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="bg-white border text-left border-gray-200 shadow-sm rounded-sm overflow-hidden mb-12">
        <table className="min-w-full border-collapse">
          <thead className="bg-[#0a3d75] text-white">
            <tr>
              <th className="px-4 py-3 font-semibold text-sm border-r border-[#072e5a]">Id</th>
              <th className="px-4 py-3 font-semibold text-sm border-r border-[#072e5a]">File Description</th>
              <th className="px-4 py-3 font-semibold text-sm border-r border-[#072e5a]">Filename</th>
              <th className="px-4 py-3 font-semibold text-sm text-center border-r border-[#072e5a]">Business Date</th>
              <th className="px-4 py-3 font-semibold text-sm text-center border-r border-[#072e5a]">Temp_Tbl_Count</th>
              <th className="px-4 py-3 font-semibold text-sm text-center border-r border-[#072e5a]">Data_Tbl_Count</th>
              <th className="px-4 py-3 font-semibold text-sm text-center">Succrecord</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-800">
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{row.id}</td>
                  <td className="px-4 py-3">{row.filedescription}</td>
                  <td className="px-4 py-3">{row.filename}</td>
                  <td className="px-4 py-3 text-center">{row.businessdate}</td>
                  <td className="px-4 py-3 text-center">{row.temp_tbl_count}</td>
                  <td className="px-4 py-3 text-center">{row.data_tbl_count}</td>
                  <td className="px-4 py-3 text-center">{row.succrecord}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No records to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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