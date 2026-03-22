'use client';
import React from 'react';
import { FaUsers, FaChartLine, FaDollarSign, FaCreditCard, FaMobileAlt, FaExchangeAlt, FaQrcode } from 'react-icons/fa';
import StatsCard from '../components/StatsCard';

export default function DashboardPage() {
  const stats = [
    { title: 'ATM', Total: 1523, Matched: 1200, Unmatched: 323, icon: <FaCreditCard /> },
    { title: 'UPI', Total: 1000, Matched: 800, Unmatched: 200, icon: <FaQrcode /> },
    { title: 'IMPS', Total: 3000, Matched: 2500, Unmatched: 500, icon: <FaMobileAlt /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map(stat => (
        <StatsCard key={stat.title} title={stat.title} Total={stat.Total} Matched={stat.Matched} Unmatched={stat.Unmatched} icon={stat.icon} />
      ))}
    </div>
  );
}