"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Download } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

type Company = {
  id: number;
  rank: number;
  company: string;
  sector: string;
  marketCap: number;
  revenue: number;
  profit: number;
  employees: number;
};

export default function Home() {
  const [data, setData] = useState<Company[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('All');
  
  const [sort, setSort] = useState('rank');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const [allDataForCharts, setAllDataForCharts] = useState<Company[]>([]);

  // Sectors for dropdown
  const sectors = [
    "All", "Financials", "Utilities", "Information Technology", "Consumer Staples",
    "Energy", "Materials", "Communication Services", "Industrials", "Real Estate", "Health Care"
  ];

  const fetchTableData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/companies?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&sector=${encodeURIComponent(sector)}&sort=${sort}&order=${order}`);
      const json = await res.json();
      setData(json.data || []);
      setTotal(json.meta?.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      // Fetch top 100 for charts depending on filters, without pagination
      const res = await fetch(`/api/companies?page=1&limit=100&search=${encodeURIComponent(search)}&sector=${encodeURIComponent(sector)}&sort=${sort}&order=${order}`);
      const json = await res.json();
      setAllDataForCharts(json.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTableData();
    fetchChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, sector, sort, order]);

  // Chart Data Processing
  const sectorDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    allDataForCharts.forEach(c => {
      counts[c.sector] = (counts[c.sector] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [allDataForCharts]);

  const top10Financials = useMemo(() => {
    return [...allDataForCharts].sort((a, b) => b.revenue - a.revenue).slice(0, 10).map(c => ({
      name: c.company,
      Revenue: c.revenue,
      Profit: c.profit
    }));
  }, [allDataForCharts]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899', '#f43f5e', '#84cc16', '#06b6d4', '#8b5cf6'];

  const formatCurrency = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(2) + ' B';
    return num + ' M';
  };

  const handleSort = (column: string) => {
    if (sort === column) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(column);
      setOrder('asc');
    }
    setPage(1);
  };

  const getSortIcon = (column: string) => {
    if (sort !== column) return <ArrowUpDown className="w-3 h-3 ml-1 text-slate-300" />;
    return order === 'asc' ? <ArrowUp className="w-3 h-3 ml-1 text-blue-600" /> : <ArrowDown className="w-3 h-3 ml-1 text-blue-600" />;
  };

  const getSectorColor = (sector: string) => {
    switch (sector) {
      case 'Financials': return 'text-emerald-700 bg-emerald-50';
      case 'Information Technology': return 'text-blue-700 bg-blue-50';
      case 'Health Care': return 'text-rose-700 bg-rose-50';
      case 'Utilities': return 'text-amber-700 bg-amber-50';
      case 'Energy': return 'text-orange-700 bg-orange-50';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col max-w-7xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
            Top Malaysian Companies
          </h1>
          <p className="text-slate-500 mt-2 text-sm max-w-2xl">
            A comprehensive, data-driven dashboard exploring market capitalization, revenue, and profit across key economic sectors in Malaysia.
          </p>
        </div>
      </header>

      {/* Dashboard Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Top 100 Distribution by Sector</h3>
          <div className="flex-grow min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                >
                  {sectorDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Top 10 by Revenue vs Profit</h3>
          <div className="flex-grow min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10Financials} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} tick={{fontSize: 10, fill: '#64748b'}} interval={0}/>
                <YAxis tickFormatter={(val) => `${val / 1000}B`} tick={{fontSize: 11, fill: '#64748b'}} />
                <RechartsTooltip formatter={(val: any) => `RM ${formatCurrency(val)}`} />
                <Legend verticalAlign="top" align="right"/>
                <Bar dataKey="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <main className="flex-grow flex flex-col bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Controls */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search companies..." 
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
            <select 
              value={sector}
              onChange={(e) => { setSector(e.target.value); setPage(1); }}
              className="bg-white border border-slate-300 text-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            >
              {sectors.map(s => <option key={s} value={s}>{s === 'All' ? 'All Sectors' : s}</option>)}
            </select>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="hidden sm:inline">
              {loading ? 'Loading...' : `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, total)} of ${total}`}
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))} 
                disabled={page === 1 || loading}
                className="p-2 hover:bg-slate-200 text-slate-600 rounded-lg disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-medium text-slate-700">Page {page}</span>
              <button 
                onClick={() => setPage(p => p + 1)} 
                disabled={page * limit >= total || loading}
                className="p-2 hover:bg-slate-200 text-slate-600 rounded-lg disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto custom-scrollbar flex-grow" style={{ maxHeight: '60vh' }}>
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-200 transition-colors select-none" onClick={() => handleSort('rank')}>
                  <div className="flex items-center">Rank {getSortIcon('rank')}</div>
                </th>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-200 transition-colors select-none" onClick={() => handleSort('company')}>
                  <div className="flex items-center">Company Name {getSortIcon('company')}</div>
                </th>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-200 transition-colors select-none" onClick={() => handleSort('sector')}>
                  <div className="flex items-center">Sector {getSortIcon('sector')}</div>
                </th>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-200 transition-colors select-none text-right" onClick={() => handleSort('marketCap')}>
                  <div className="flex items-center justify-end">Mkt Cap (MYR) {getSortIcon('marketCap')}</div>
                </th>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-200 transition-colors select-none text-right" onClick={() => handleSort('revenue')}>
                  <div className="flex items-center justify-end">Revenue (MYR) {getSortIcon('revenue')}</div>
                </th>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-200 transition-colors select-none text-right" onClick={() => handleSort('profit')}>
                  <div className="flex items-center justify-end">Profit (MYR) {getSortIcon('profit')}</div>
                </th>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-200 transition-colors select-none text-right" onClick={() => handleSort('employees')}>
                  <div className="flex items-center justify-end">Employees {getSortIcon('employees')}</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {loading && data.length === 0 ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-8"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16 ml-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16 ml-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16 ml-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-12 ml-auto"></div></td>
                  </tr>
                ))
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50 transition-colors group">
                    <td className="px-6 py-3 text-slate-500 font-medium">{row.rank}</td>
                    <td className="px-6 py-3 font-semibold text-slate-800">{row.company}</td>
                    <td className="px-6 py-3">
                      <span className={`font-medium px-2 py-1 rounded-md text-xs ${getSectorColor(row.sector)}`}>
                        {row.sector}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right text-emerald-700 font-mono font-medium">RM {formatCurrency(row.marketCap)}</td>
                    <td className="px-6 py-3 text-right text-slate-600 font-mono">RM {formatCurrency(row.revenue)}</td>
                    <td className="px-6 py-3 text-right text-slate-600 font-mono">RM {formatCurrency(row.profit)}</td>
                    <td className="px-6 py-3 text-right text-slate-600 font-mono">{new Intl.NumberFormat('en-MY').format(row.employees)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
