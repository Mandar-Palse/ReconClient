'use client';
import React from 'react';

export default function ReconMasterPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Username</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4">1</td>
              <td className="px-6 py-4">john.doe</td>
              <td className="px-6 py-4">john@example.com</td>
              <td className="px-6 py-4">Admin</td>
            </tr>
            <tr>
              <td className="px-6 py-4">2</td>
              <td className="px-6 py-4">jane.smith</td>
              <td className="px-6 py-4">jane@example.com</td>
              <td className="px-6 py-4">User</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}