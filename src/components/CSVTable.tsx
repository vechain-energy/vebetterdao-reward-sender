import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { CSVRow } from '../types';
import { ArrowUpDown, ExternalLink } from 'lucide-react';

interface CSVTableProps {
  data: CSVRow[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

const columnHelper = createColumnHelper<CSVRow>();

const shortenAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const columns = [
  columnHelper.accessor('address', {
    header: ({ column }) => (
      <button
        className="flex items-center gap-2 text-white/80"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Address
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: (info) => (
      <a
        href={`https://vechainstats.com/account/${info.getValue()}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-orange-400 hover:text-orange-300 flex items-center gap-1"
      >
        {shortenAddress(info.getValue())}
        <ExternalLink className="h-3 w-3" />
      </a>
    ),
  }),
  columnHelper.accessor('amount', {
    header: ({ column }) => (
      <button
        className="flex items-center gap-2 text-white/80"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Amount (B3TR)
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: (info) => (
      <span className="text-white/80">
        {parseFloat(info.getValue()).toFixed(2)}
      </span>
    ),
  }),
  columnHelper.accessor('reason', {
    header: ({ column }) => (
      <button
        className="flex items-center gap-2 text-white/80"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Reason
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: (info) => (
      <span className="text-white/80">
        {info.getValue()}
      </span>
    ),
  }),
];

export function CSVTable({ data, globalFilter, setGlobalFilter }: CSVTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="w-full">
      <div className="mb-4">
        <input
          type="text"
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Search all columns..."
        />
      </div>
      <div className="rounded-lg border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-white/10 bg-white/5">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3 text-left text-white/80">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-white/10 hover:bg-white/5">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-white/80">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}