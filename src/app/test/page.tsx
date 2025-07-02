'use client';
import React, { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  role?: string; // Making role optional since your schema might not require it
}

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    role: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch existing data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/test');
        const result = await response.json();

        if(result.success) {
          setUsers(result.data);
        } else {
          setError('Failed to fetch data');
        }
      } catch(err) {
        setError('Network error occurred');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!formData.name) {
      setError('Name is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if(result.success) {
        // Refresh the list after successful submission
        const response = await fetch('/api/test');
        const newData = await response.json();
        setUsers(newData.data);

        // Reset form
        setFormData({ name: '', role: '' });
      } else {
        setError('Failed to save data');
      }
    } catch(err) {
      setError('Network error occurred');
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      {/* Display existing users */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Existing Users</h2>
        {loading && !users.length ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <ul className="space-y-2">
            {users.map(user => (
              <li key={user._id} className="border p-3 rounded">
                <p><strong>Name:</strong> {user.name}</p>
                {user.role && <p><strong>Role:</strong> {user.role}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add new user form */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="name" className="block mb-1">Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block mb-1">Role</label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;