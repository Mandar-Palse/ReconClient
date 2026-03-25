'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FaHome,
  FaUsers,
  FaChartBar,
  FaCog,
  FaChevronDown,
  FaSync,
  FaMoneyBillAlt,
  FaCloudUploadAlt,
  FaCreditCard,
  FaMobile,
  FaMobileAlt,
  FaQrcode,
  FaExchangeAlt,
  FaChartLine,
  FaFileAlt,
  FaReceipt,
} from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { FactCheckTwoTone } from '@mui/icons-material';

/* -------------------- TYPES -------------------- */
type MenuItem = {
  name: string;
  icon?: React.ReactNode;
  href?: string;
  children?: MenuItem[];
};

/* -------------------- MENU DATA -------------------- */
const menuItems: MenuItem[] = [
  { name: 'Dashboard', icon: <FaHome />, href: '/dashboard' },
  {
    name: 'Recon Process',
    icon: <FaExchangeAlt />,
    children: [
      {
        name: 'ATM',
        icon: <FaCreditCard />,
        children: [
          {
            name: 'Upload RAW Files',
            icon: <FaCloudUploadAlt />,
            href: '/dashboard/ReconProcess/ATM/UploadRAWFiles',
          },
          {
            name: 'Recon Master',
            icon: <FaExchangeAlt />,
            href: '/dashboard/ReconProcess/ATM/ReconMaster',
          },
          {
            name: 'Reports',
            icon: <FaFileAlt />,
            href: '/dashboard/ReconProcess/ATM/Reports',
          },
          {
            name: 'Vouchers',
            icon: <FaReceipt />,
            href: '/dashboard/ReconProcess/ATM/Vouchers',
          },
        ],
      },
      {
        name: 'IMPS',
        icon: <FaMobileAlt />,
        children: [
          {
            name: 'Upload RAW Files',
            icon: <FaCloudUploadAlt />,
            href: '/dashboard/ReconProcess/IMPS/UploadRAWFiles',
          },
          {
            name: 'Recon Master',
            icon: <FaExchangeAlt />,
            href: '/dashboard/ReconProcess/IMPS/ReconMaster',
          },
          {
            name: 'Reports',
            icon: <FaFileAlt />,
            href: '/dashboard/ReconProcess/IMPS/Reports',
          },
          {
            name: 'Vouchers',
            icon: <FactCheckTwoTone />,
            href: '/dashboard/ReconProcess/IMPS/Vouchers',
          },
        ],
      },
      {
        name: 'UPI',
        icon: <FaQrcode />,
        children: [
          {
            name: 'Upload RAW Files',
            icon: <FaCloudUploadAlt />,
            href: '/dashboard/ReconProcess/UPI/UploadRAWFiles',
          },
          {
            name: 'Recon Master',
            icon: <FaExchangeAlt />,
            href: '/dashboard/ReconProcess/UPI/ReconMaster',
          },
          {
            name: 'Reports',
            icon: <FaFileAlt />,
            href: '/dashboard/ReconProcess/UPI/Reports',
          },
          {
            name: 'Vouchers',
            icon: <FaReceipt />,
            href: '/dashboard/ReconProcess/UPI/Vouchers',
          },
        ],
      },
    ],
  },
  { name: 'Masters', icon: <FaUsers />, href: '/dashboard/masters' },
  { name: 'Users', icon: <FaUsers />, href: '/dashboard/users' },
];

/* -------------------- RECURSIVE ITEM -------------------- */
const SidebarItem = ({
  item,
  level = 0,
  pathname,
}: {
  item: MenuItem;
  level?: number;
  pathname: string;
}) => {
  const [open, setOpen] = useState(false);

  const paddingLeft = `${level * 16}px`;

  // If item has children → render button
  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between py-3 px-4 rounded hover:bg-gray-300 text-sm"
          style={{ paddingLeft }}
        >
          <div className="flex items-center gap-3 text-sm">
            {item.icon}
            <span>{item.name}</span>
          </div>

          <FaChevronDown
            className={`transition-transform ${open ? 'rotate-180' : ''
              }`}
          />
        </button>

        {/* CHILDREN */}
        {open && (
          <div className="space-y-1 text-sm">
            {item.children.map(child => (
              <SidebarItem
                key={child.name}
                item={child}
                level={level + 1}
                pathname={pathname}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // If item is a link
  return (
    <Link
      href={item.href!}
      className={`flex items-center gap-3 py-3 px-4 rounded ${pathname === item.href ? 'bg-gray-300' : 'hover:bg-gray-300'
        }`}
      style={{ paddingLeft }}
    >
      {item.icon}
      <span>{item.name}</span>
    </Link>
  );
};

/* -------------------- MAIN SIDEBAR -------------------- */
const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 min-h-screen bg-gray-200 text-black flex flex-col p-6 border-r border-gray-300">
      <h1 className="text-1xl font-bold mb-8">Paysis Admin</h1>

      <nav className="flex-1 space-y-2">
        {menuItems.map(item => (
          <SidebarItem
            key={item.name}
            item={item}
            pathname={pathname}
          />
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;