import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function VolunteerDashboard() {
  const [volunteer, setVolunteer] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      fetchVolunteerData(userData.id);
    }
  }, []);

  const fetchVolunteerData = async (id) => {
    try {
      const [volunteerRes, tasksRes] = await Promise.all([
        fetch(`/api/volunteer/${id}`),
        fetch(`/api/volunteer/${id}/tasks`)
      ]);

      if (volunteerRes.ok) {
        const data = await volunteerRes.json();
        setVolunteer(data);
      }

      if (tasksRes.ok) {
        const data = await tasksRes.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Volunteer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {volunteer?.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Your Information</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900">{volunteer?.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="text-sm text-gray-900">{volunteer?.phone}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Availability</dt>
                  <dd className="text-sm text-gray-900">
                    {volunteer?.availability.join(', ')}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </motion.div>

        {/* Assigned Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Tasks</h3>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <h4 className="font-medium text-gray-900">{task.name}</h4>
                <p className="text-sm text-gray-600">{task.description}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {task.time}
                  </span>
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {task.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Important Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Important Information</h3>
          <div className="prose prose-blue">
            <ul className="space-y-2">
              <li>Please arrive 15 minutes before your scheduled task time</li>
              <li>Wear your volunteer T-shirt during your shifts</li>
              <li>Report to the volunteer coordinator at the start of your shift</li>
              <li>Contact the volunteer coordinator if you need to make any schedule changes</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}