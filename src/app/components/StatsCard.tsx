'use client';
import React from 'react';

interface StatsCardProps {
  title: string;
  Total: string | number;
  Matched: string | number;
  Unmatched: string | number;
  icon: React.ReactNode;
}

export default function StatsCard({ title, Total, Matched, Unmatched, icon }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded shadow flex items-center gap-4">
      <div className="text-2xl text-[#0a3d75]">{icon}</div>
      <div>
        <div className="text-2xl font-bold">{title}</div>
        <div className="bg-white p-1 rounded shadow flex items-center gap-3">
          <div className="text-gray-500">Total:</div>
          <div className="text-gray-500">{Total}</div>
        </div>
        <div className="bg-white p-1 rounded shadow flex items-center gap-3">
          <div className="text-gray-500">Matched:</div>
          <div className="text-gray-500">{Matched}</div>
        </div>
        <div className="bg-white p-1 rounded shadow flex items-center gap-3">
          <div className="text-gray-500">Unmatched:</div>
          <div className="text-gray-500">{Unmatched}</div>
        </div>
      </div>
    </div>
  );
}