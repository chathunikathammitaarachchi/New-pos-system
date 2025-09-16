import React, { useState, useEffect } from 'react';
import { AlertCircle, Plus } from 'lucide-react';

interface ControllerMaster {
  id: number;
  concode: string;
  conkey: string;
  conname: string;
}

interface CodeMaster {
  id?: number;
  conkey: string;
  concode: string;
  cdcode: string;
  cdname: string;
  created_at?: string;
  updated_at?: string;
  controller?: {
    id: number;
    concode: string;
    conname: string;
  };
}

interface ApiResponse {
  success: boolean;
  controller_master?: ControllerMaster[];
  code_master?: CodeMaster[];
  data?: any;
  error?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

const CodeMasterManager: React.FC = () => {
  const [controllerMaster, setControllerMaster] = useState<ControllerMaster[]>([]);
  const [codeMaster, setCodeMaster] = useState<CodeMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    concode: '',
    cdname: ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [csrfToken, setCsrfToken] = useState<string>('');

  // Fetch CSRF token and data on component mount
  useEffect(() => {
    fetchCsrfToken();
    fetchData();
  }, []);

  const fetchCsrfToken = async () => {
    try {
      // First try to get from meta tag
      const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      if (metaToken) {
        setCsrfToken(metaToken);
        return;
      }
      
      // If not in meta tag, try to get from Laravel's CSRF cookie
      const response = await fetch('/sanctum/csrf-cookie', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        // The token should now be in the cookies, we'll extract it when making requests
        console.log('CSRF cookie set successfully');
      }
    } catch (err) {
      console.error('Error fetching CSRF token:', err);
    }
  };

  const getCsrfTokenFromCookie = () => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
    
    return cookieValue ? decodeURIComponent(cookieValue) : '';
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/code-master', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include' // Important for sending cookies
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      console.log('API Response:', data);
      
      if (data.success) {
        setControllerMaster(data.controller_master || []);
        setCodeMaster(data.code_master || []);
      } else {
        throw new Error(data.error || 'Failed to fetch data');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch data';
      setError(errorMessage);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.concode || !formData.cdname.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      setValidationErrors({});
      
      // Prepare headers
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      };
      
      // Add CSRF token if available (prefer the one from state, then from cookie)
      const tokenToUse = csrfToken || getCsrfTokenFromCookie();
      if (tokenToUse) {
        headers['X-XSRF-TOKEN'] = tokenToUse;
      }
      
      const response = await fetch('/api/code-master', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
        credentials: 'include' // Important for sending cookies
      });
      
      console.log('Response status:', response.status);
      
      const data: ApiResponse = await response.json();
      console.log('Response data:', data);
      
      if (response.ok && data.success && data.data) {
        // Add the new entry to the beginning of the list
        setCodeMaster(prev => [data.data, ...prev]);
        setFormData({ concode: '', cdname: '' });
        setSuccess('Code Master entry created successfully!');
        setTimeout(() => setSuccess(null), 5000);
      } else if (response.status === 422 && data.errors) {
        setValidationErrors(data.errors);
        setError('Please fix the validation errors below');
      } else if (response.status === 419) {
        // CSRF token issue, try to refresh it
        await fetchCsrfToken();
        setError('Session expired. Please try again.');
      } else {
        throw new Error(data.error || data.message || 'Failed to create entry');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create Code Master entry';
      setError(errorMessage);
      console.error('Error creating code master:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation errors for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Code Master Management</h1>
        <p className="text-gray-600 mt-2">Manage your code master entries and controller mappings</p>
      </div>
      
      {/* Alert Messages */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-700">{error}</p>
            <button 
              onClick={clearMessages}
              className="ml-auto text-red-400 hover:text-red-600 text-xl leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex items-center">
            <div className="h-5 w-5 text-green-400 mr-2 font-bold">✓</div>
            <p className="text-green-700">{success}</p>
            <button 
              onClick={clearMessages}
              className="ml-auto text-green-400 hover:text-green-600 text-xl leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Add New Code Master Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex items-center mb-4">
          <Plus className="h-5 w-5 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Add New Code Master Entry</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Controller Code *
              </label>
              <select
                name="concode"
                value={formData.concode}
                onChange={handleInputChange}
                className={`w-full py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.concode ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a Controller Code</option>
                {controllerMaster.map(controller => (
                  <option key={controller.id} value={controller.concode}>
                    {controller.concode} - {controller.conname}
                  </option>
                ))}
              </select>
              {validationErrors.concode && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.concode[0]}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code Name *
              </label>
              <input
                type="text"
                name="cdname"
                value={formData.cdname}
                onChange={handleInputChange}
                placeholder="Enter code name"
                className={`w-full py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.cdname ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {validationErrors.cdname && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.cdname[0]}</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Code Master
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Code Master Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Code Master Entries</h2>
          <p className="text-gray-600">Total entries: {codeMaster.length}</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Controller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {codeMaster.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No code master entries found
                  </td>
                </tr>
              ) : (
                codeMaster.map(code => (
                  <tr key={code.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{code.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{code.concode}</div>
                        <div className="text-sm text-gray-500">Key: {code.conkey}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{code.cdname}</div>
                        <div className="text-sm text-gray-500 font-mono">{code.cdcode}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {code.created_at ? new Date(code.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CodeMasterManager;