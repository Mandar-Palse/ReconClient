"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FiSearch, FiUpload, FiFileText, FiCheckCircle, FiXCircle, FiCalendar, FiAlertCircle, FiTrash2 } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface FileRecord {
  id: number;
  filedescription: string;
  filename: string;
  businessdate: string;
  temp_tbl_count: number;
  data_tbl_count: number;
  final_tbl_count: number;
  succrecord: number;
  totrecord: number;
  ReconConfirmation: boolean;
  error_message: string;
  Average7DayCount: number;
}

const UploadPage: React.FC = () => {
  const [businessDate, setBusinessDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [fileStatus, setFileStatus] = useState<Record<string, "idle" | "uploading" | "success" | "error">>({});
  const [globalStatus, setGlobalStatus] = useState<"idle" | "uploading" | "searching">("idle");
  const [tableData, setTableData] = useState<FileRecord[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchUploadedFiles = async () => {
    setGlobalStatus("searching");
    try {
      const response = await axios.get("https://localhost:7193/api/upload/GetUploadedFilesList",
        {
          params: {
            businessDate: businessDate // or whatever your API expects
          }
        }
      );
      if (Array.isArray(response.data)) {
        setTableData(response.data);
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        setTableData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch uploaded files list:", error);
    } finally {
      setGlobalStatus("idle");
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(newFiles);

      const newProgress: Record<string, number> = {};
      const newStatus: Record<string, "idle" | "uploading" | "success" | "error"> = {};
      newFiles.forEach(file => {
        newProgress[file.name] = 0;
        newStatus[file.name] = "idle";
      });
      setUploadProgress(newProgress);
      setFileStatus(newStatus);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleClearAllFiles = () => {
    setFiles([]);
    setUploadProgress({});
    setFileStatus({});
    setGlobalStatus("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSearch = () => {
    fetchUploadedFiles();
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setGlobalStatus("uploading");

    // Mark all available idle files as uploading
    const updatedStatus = { ...fileStatus };
    const filesToUpload = files.filter(f => fileStatus[f.name] !== 'success');

    filesToUpload.forEach(f => updatedStatus[f.name] = "uploading");
    setFileStatus(updatedStatus);

    await Promise.all(filesToUpload.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      //formData.append("businessDate", businessDate);

      try {
        await axios.post(
          "https://localhost:7193/api/upload/file",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(prev => ({
                  ...prev,
                  [file.name]: percentCompleted
                }));
              }
            }
          }
        );

        setFileStatus(prev => ({ ...prev, [file.name]: "success" }));
      } catch (error) {
        console.error(error);
        setFileStatus(prev => ({ ...prev, [file.name]: "error" }));
      }
    }));

    setGlobalStatus("idle");
    // Optionally refresh the list after a completed batch of uploads
    fetchUploadedFiles();
  };

  return (
    <div className="min-h-[80vh] bg-[#f8fbfc] p-3 flex flex-col">
      <div className="w-full space-y-1">


        {/* Controls Bar */}
        <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          {/* <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Controls Bar</h2>
          </div> */}

          <div className="p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 items-start">

              {/* Business Date Container */}
              <div className="flex items-center space-x-4">
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
              </div>

              {/* File Selection Container */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-semibold text-gray-700 flex items-center min-w-[100px]">
                    <FiFileText className="mr-2 text-[#0a3d75] text-lg" />
                    Select Files:
                  </label>
                  <div className="flex-1 flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-lg p-1.5 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-[#f0f4f8] hover:bg-[#e1e9f1] border border-[#cce7f0] rounded-md text-sm font-medium text-[#0a3d75] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#0a3d75] transition-colors whitespace-nowrap shadow-sm"
                    >
                      Choose Files
                    </button>
                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".csv,.txt,.xlsx,.xls,.0"
                      multiple
                    />
                    <div className="flex-1 min-w-0 pr-3">
                      <span className={`text-sm truncate block ${files.length > 0 ? 'text-gray-900 font-medium' : 'text-gray-500 italic'}`}>
                        {files.length > 0 ? `${files.length} file(s) selected` : "No files chosen"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Files & Progress */}
            {files.length > 0 && (
              <div className="mt-6 border-t border-gray-100 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Selected Files</h3>
                  {globalStatus === 'uploading' && (
                    <span className="text-xs font-bold text-[#0a3d75] flex items-center bg-[#f0f4f8] px-2.5 py-1 rounded-full border border-[#cce7f0]">
                      <AiOutlineLoading3Quarters className="animate-spin mr-1.5" /> Uploading in progress...
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2">
                  {files.map((file, index) => {
                    const progress = uploadProgress[file.name] || 0;
                    const cStatus = fileStatus[file.name] || "idle";

                    return (
                      <div key={index} className={`flex flex-col bg-gray-50 border ${cStatus === 'success' ? 'border-green-200 bg-green-50/30' : cStatus === 'error' ? 'border-red-200 bg-red-50/30' : 'border-gray-200'} rounded-lg p-3 shadow-sm hover:shadow transition-shadow`}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2 truncate pr-4">
                            <FiFileText className={`flex-shrink-0 ${cStatus === 'success' ? 'text-green-500' : cStatus === 'error' ? 'text-red-500' : 'text-gray-400'}`} />
                            <span className="text-sm font-medium text-gray-800 truncate">{file.name}</span>
                          </div>

                          <div className="flex items-center space-x-2 pl-2">
                            {cStatus === 'success' && <FiCheckCircle className="text-green-500 text-lg flex-shrink-0" title="Success" />}
                            {cStatus === 'error' && <FiAlertCircle className="text-red-500 text-lg flex-shrink-0" title="Error" />}
                            {cStatus === 'idle' && (
                              <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-200" title="Remove file">
                                <FiXCircle className="text-lg" />
                              </button>
                            )}
                            {cStatus === 'uploading' && (
                              <span className="text-xs font-bold text-[#0a3d75] w-8 text-right">{progress}%</span>
                            )}
                          </div>
                        </div>

                        {(cStatus === 'uploading' || cStatus === 'success' || cStatus === 'error') && (
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-300 ${cStatus === 'success' ? 'bg-green-500' :
                                cStatus === 'error' ? 'bg-red-500' :
                                  'bg-[#0a3d75]'
                                }`}
                              style={{ width: `${cStatus === 'error' ? 100 : progress}%` }}
                            ></div>
                          </div>
                        )}

                        {cStatus === 'success' && <span className="text-[11px] text-green-600 font-medium mt-1">Uploaded successfully</span>}
                        {cStatus === 'error' && <span className="text-[11px] text-red-600 font-medium mt-1">Upload failed</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons Container */}
            <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={handleSearch}
                disabled={globalStatus === 'searching'}
                // className="inline-flex items-center px-6 py-2.5 border-2 border-gray-200 text-sm font-bold rounded-lg text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 focus:outline-none transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                className="inline-flex items-center px-6 py-2.5 border-2 border-blue-500 text-sm font-bold rounded-lg text-white bg-blue-500 hover:bg-blue-600 hover:border-blue-600 focus:outline-none transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {globalStatus === 'searching' ? (
                  <AiOutlineLoading3Quarters className="animate-spin mr-2 text-lg" />
                ) : (
                  <FiSearch className="mr-2 text-lg" />
                )}
                Search
              </button>

              <div className="flex items-center space-x-4">
                {files.length > 0 && (
                  <button
                    onClick={handleClearAllFiles}
                    disabled={globalStatus === 'uploading'}
                    className="inline-flex items-center px-4 py-2.5 text-sm font-bold rounded-lg text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Clear selected files"
                  >
                    <FiTrash2 className="mr-2 text-lg" />
                    Clear List
                  </button>
                )}
                <button
                  onClick={handleUpload}
                  disabled={files.length === 0 || globalStatus === 'uploading'}
                  className={`inline-flex items-center px-8 py-2.5 border border-transparent text-sm font-bold rounded-lg shadow-md text-white transition-all duration-300 ${files.length === 0
                    ? 'bg-gray-300 cursor-not-allowed shadow-none'
                    : globalStatus === 'uploading'
                      ? 'bg-[#0a3d75] cursor-wait'
                      : 'bg-[#0a3d75] hover:bg-[#072e5a] focus:outline-none hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                >
                  {globalStatus === 'uploading' ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin mr-2 text-lg" />
                      Uploading All...
                    </>
                  ) : (
                    <>
                      <FiUpload className="mr-2 text-lg" />
                      Upload Files
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded Files List */}
        <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden relative">
          <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Uploaded Files List</h2>
            <span className="bg-[#e1e9f1] text-[#0a3d75] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {tableData.length} records found
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  {['ID', 'Description', 'File Name', 'Date', 'Temp', 'Data', 'Final', 'Success', 'Total', 'Recon', 'Error', 'Avg'].map((header) => (
                    <th key={header} scope="col" className="px-5 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap bg-gray-50/30">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {globalStatus === 'searching' ? (
                  <tr>
                    <td colSpan={12} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-[#0a3d75]" />
                        <p className="text-gray-500 text-sm font-medium">Fetching details...</p>
                      </div>
                    </td>
                  </tr>
                ) : tableData.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-12 text-center text-gray-500 font-medium">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  tableData.map((row) => (
                    <tr key={row.id} className="hover:bg-[#f0f4f8] transition-colors group">
                      <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-gray-900 border-l-4 border-transparent group-hover:border-[#0a3d75] transition-all">{row.id || '-'}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{row.filedescription || '-'}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-[#0a3d75] font-bold">{row.filename || '-'}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{row.businessdate || '-'}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600 font-mono bg-gray-50/30">{row.temp_tbl_count ?? '-'}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600 font-mono bg-gray-50/30">{row.data_tbl_count ?? '-'}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600 font-mono bg-gray-50/30">{row.final_tbl_count ?? '-'}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-green-700 font-mono font-bold bg-green-50/30">{row.succrecord ?? '-'}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-[#072e5a] font-mono font-extrabold bg-[#f0f4f8]">{row.totrecord ?? '-'}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {row.ReconConfirmation ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-800 shadow-sm border border-green-200">
                            ✔
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-800 shadow-sm border border-red-200">
                            ❌
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {!row.error_message || row.error_message === '-' ? (
                          <span className="text-gray-400 font-bold">-</span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-red-50 text-red-700 border border-red-200 shadow-sm">
                            {row.error_message}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600 font-mono font-medium">{row.Average7DayCount ?? '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;