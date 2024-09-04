import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [emails, setEmails] = useState('');
  const [validEmails, setValidEmails] = useState([]);
  const [invalidEmails, setInvalidEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setEmails(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const emailArray = emails.split(',').map(email => email.trim());
    const valid = [];
    const invalid = [];

    try {
      const apiKey = '08ef404d07114b669df508c0b50d8971'; // Replace with your actual API key

      // Using Promise.all to handle all API requests concurrently
      const emailValidationPromises = emailArray.map(async (email) => {
        if (email) {
          try {
            const response = await axios.get(
              `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`
            );
            
            if (response.data.deliverability === 'DELIVERABLE') {
              valid.push(email);
            } else {
              invalid.push(email);
            }
          } catch (err) {
            invalid.push(email); // If there's an error, consider the email invalid
          }
        }
      });

      await Promise.all(emailValidationPromises);

      setValidEmails((prev) => [...prev, ...valid]);
      setInvalidEmails((prev) => [...prev, ...invalid]);
      setEmails(''); // Clear input after submission
    } catch (err) {
      setError('Something went wrong, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-semibold mb-8">Email Checker</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <textarea
          value={emails}
          onChange={handleChange}
          placeholder="Enter email addresses separated by commas"
          required
          rows="5"
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
          {loading ? 'Checking...' : 'Check Emails'}
        </button>
      </form>
      {error && <div className="mt-6 text-red-600">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full max-w-4xl">
        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">Valid Emails</h2>
          <ul className="list-disc pl-5 text-lg">
            {validEmails.length === 0 ? (
              <li>No valid emails yet</li>
            ) : (
              validEmails.map((email, index) => (
                <li key={index}>{email}</li>
              ))
            )}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">Invalid Emails</h2>
          <ul className="list-disc pl-5 text-lg">
            {invalidEmails.length === 0 ? (
              <li>No invalid emails yet</li>
            ) : (
              invalidEmails.map((email, index) => (
                <li key={index}>{email}</li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
