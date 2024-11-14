import React, { useState, useEffect } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('team', {
    header: 'Team',
    cell: info => info.getValue() || '-',
  }),
  columnHelper.accessor('experience', {
    header: 'Experience',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('created_at', {
    header: 'Registration Date',
    cell: info => new Date(info.getValue()).toLocaleDateString(),
  }),
];

export default function Dashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [teams, setTeams] = useState([]);
  const [activeTab, setActiveTab] = useState('registrations');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [registrationsRes, teamsRes, welcomeRes] = await Promise.all([
        fetch('/api/admin/registrations'),
        fetch('/api/admin/teams'),
        fetch('/api/admin/welcome-message')
      ]);

      if (registrationsRes.ok) {
        const data = await registrationsRes.json();
        setRegistrations(data);
      }

      if (teamsRes.ok) {
        const data = await teamsRes.json();
        setTeams(data);
      }

      if (welcomeRes.ok) {
        const data = await welcomeRes.json();
        setWelcomeMessage(data.message || '');
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateWelcomeMessage = async () => {
    try {
      const response = await fetch('/api/admin/welcome-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: welcomeMessage }),
      });

      if (response.ok) {
        alert('Welcome message updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update welcome message:', error);
      alert('Failed to update welcome message');
    }
  };

  const table = useReactTable({
    data: registrations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Message Editor */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Welcome Message</h3>
          <div className="space-y-4">
            <textarea
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              className="w-full h-32 p-2 border rounded-md"
              placeholder="Enter welcome message..."
            />
            <button
              onClick={updateWelcomeMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Message
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('registrations')}
              className={`${
                activeTab === 'registrations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
            >
              Registrations
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`${
                activeTab === 'teams'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
            >
              Teams
            </button>
          </nav>
        </div>

        {/* Content Panels */}
        {activeTab === 'registrations' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Registrations Dashboard
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Total Registrations: {registrations.length}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Teams Overview
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Total Teams: {teams.length}
              </p>
            </div>
            <div className="border-t border-gray-200">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-4">
                {teams.map((team) => (
                  <div
                    key={team.name}
                    className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h4 className="text-lg font-medium text-gray-900">{team.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">Members: {team.members.length}</p>
                    <ul className="mt-2 space-y-1">
                      {team.members.map((member) => (
                        <li key={member.email} className="text-sm text-gray-600">
                          {member.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}