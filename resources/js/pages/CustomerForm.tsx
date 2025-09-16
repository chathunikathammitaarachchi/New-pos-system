import React, { useState } from 'react';
import { AlertCircle, CheckCircle, User, CreditCard } from 'lucide-react';

const CustomerForm: React.FC = () => {
  const [formData, setFormData] = useState({
    accCd: '',
    accNm: '',
    adrNm: '',
    tp1: '',
    fax: '',
    email: '',
    idNo: '',
    crLmt: '',
    vatNo: '',
    fVATRegistered: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.accCd.trim()) newErrors.accCd = 'Account Code is required';
    if (!formData.accNm.trim()) newErrors.accNm = 'Customer Name is required';
    if (!formData.adrNm.trim()) newErrors.adrNm = 'Address is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.crLmt && parseFloat(formData.crLmt) < 0) {
      newErrors.crLmt = 'Credit limit cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({type: 'error', text: 'Please fix the errors below'});
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Simulate API call
const response = await fetch('http://localhost:8000/api/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage({type: 'success', text: data.message});
        // Reset form on success
        setFormData({
          accCd: '',
          accNm: '',
          adrNm: '',
          tp1: '',
          fax: '',
          email: '',
          idNo: '',
          crLmt: '',
          vatNo: '',
          fVATRegistered: false,
        });
      } else {
        setMessage({type: 'error', text: data.message || 'Registration failed'});
      }
    } catch (error: any) {
      setMessage({
        type: 'error', 
        text: 'Server error occurred. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Customer Registration</h2>
          <p className="mt-2 text-gray-600">Create a new customer account</p>
        </div>

        {/* Alert Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-md flex items-center ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {message.text}
          </div>
        )}

        {/* Form */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Code & Customer Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Code *
                </label>
                <input
                  type="text"
                  name="accCd"
                  value={formData.accCd}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.accCd ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter account code"
                />
                {errors.accCd && <p className="mt-1 text-sm text-red-600">{errors.accCd}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  name="accNm"
                  value={formData.accNm}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.accNm ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter customer name"
                />
                {errors.accNm && <p className="mt-1 text-sm text-red-600">{errors.accNm}</p>}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                name="adrNm"
                value={formData.adrNm}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.adrNm ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter complete address"
              />
              {errors.adrNm && <p className="mt-1 text-sm text-red-600">{errors.adrNm}</p>}
            </div>

            {/* Phone & Fax */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="tp1"
                  value={formData.tp1}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fax Number
                </label>
                <input
                  type="tel"
                  name="fax"
                  value={formData.fax}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter fax number"
                />
              </div>
            </div>

            {/* Email & NIC */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIC Number
                </label>
                <input
                  type="text"
                  name="idNo"
                  value={formData.idNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter NIC number"
                />
              </div>
            </div>

            {/* Credit Limit & VAT Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <CreditCard className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Financial Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credit Limit (LKR)
                  </label>
                  <input
                    type="number"
                    name="crLmt"
                    value={formData.crLmt}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.crLmt ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.crLmt && <p className="mt-1 text-sm text-red-600">{errors.crLmt}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    VAT Registration Number
                  </label>
                  <input
                    type="text"
                    name="vatNo"
                    value={formData.vatNo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter VAT number"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="fVATRegistered"
                    checked={formData.fVATRegistered}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    This customer is VAT registered
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </span>
                ) : (
                  'Register Customer'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;