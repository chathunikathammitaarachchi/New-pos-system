import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Head } from '@inertiajs/react';

interface SupplierOption {
  id: number;
  name: string;
}

interface SupplierFormData {
  accKy: string;
  accCd: string;
  accNm: string;
  address: string;
  tp1: string;
  fax: string;
  email: string;
  idNo: string;
  crLmt: string;
  vatNo: string;
  fVATRegistered: boolean;
}

const SupplierManagement: React.FC = () => {
  const [form, setForm] = useState<SupplierFormData>({
    accKy: '',
    accCd: '',
    accNm: '',
    address: '',
    tp1: '',
    fax: '',
    email: '',
    idNo: '',
    crLmt: '',
    vatNo: '',
    fVATRegistered: false,
  });

  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const headers: { [key: string]: string } = {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      };

      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (csrfToken) {
        headers['X-CSRF-TOKEN'] = csrfToken;
      }

      const response = await fetch('/api/suppliers', {
        headers,
        credentials: 'include' as RequestCredentials,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setMessage('සැපයුම්කරුවන් ලබා ගැනීමේදී දෝෂයක් සිදුවිය.');
    } finally {
      setLoading(false);
    }
  };

  const handleSupplierSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const supplierId = e.target.value;
    
    if (!supplierId) {
      clearForm();
      return;
    }
    
    try {
      setSearching(true);
      setMessage('සැපයුම්කරු ලෝඩ් වෙමින්...');
      
      const response = await fetch(`/api/supplier-details/${supplierId}`);
      const data = await response.json();
      
      if (response.ok && data) {
        setForm({
          accKy: data.accKy?.toString() || '',
          accCd: data.accCd || '',
          accNm: data.accNm || '',
          address: data.address || '',
          tp1: data.tp1 || '',
          fax: data.fax || '',
          email: data.email || '',
          idNo: data.idNo || '',
          crLmt: data.crLmt?.toString() || '',
          vatNo: data.vatNo || '',
          fVATRegistered: data.fVATRegistered || false,
        });
        setMessage('සැපයුම්කරු සාර්ථකව ලෝඩ් විය.');
        setIsEditMode(true);
      } else {
        setMessage('සැපයුම්කරු සොයාගත නොහැක.');
        setIsEditMode(false);
      }
    } catch (error) {
      console.error(error);
      setMessage('දත්ත ලබා ගැනීමේදී දෝෂයක් සිදුවිය.');
      setIsEditMode(false);
    } finally {
      setSearching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSearch = async () => {
    if (!form.accCd && !form.accNm) {
      alert("කරුණාකර සැපයුම්කරු කේතය හෝ නම ඇතුළත් කරන්න.");
      return;
    }

    setSearching(true);
    setMessage('සොයමින්...');

    try {
      const searchTerm = form.accCd || form.accNm;
      const response = await fetch(`/api/supplier-search?search_term=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();

      if (response.ok && data.supplier) {
        setForm({
          accKy: data.supplier.accKy?.toString() || '',
          accCd: data.supplier.accCd || '',
          accNm: data.supplier.accNm || '',
          address: data.supplier.address || '',
          tp1: data.supplier.tp1 || '',
          fax: data.supplier.fax || '',
          email: data.supplier.email || '',
          idNo: data.supplier.idNo || '',
          crLmt: data.supplier.crLmt?.toString() || '',
          vatNo: data.supplier.vatNo || '',
          fVATRegistered: data.supplier.fVATRegistered || false,
        });
        setMessage('සැපයුම්කරු සාර්ථකව ලෝඩ් විය.');
        setIsEditMode(true);
      } else {
        setMessage('සැපයුම්කරු සොයාගත නොහැක.');
        setIsEditMode(false);
      }
    } catch (error) {
      console.error(error);
      setMessage('සෙවීමේදී දෝෂයක් සිදුවිය.');
      setIsEditMode(false);
    } finally {
      setSearching(false);
    }
  };

  const generateSupplierCode = () => {
    const code = `SUP${Date.now().toString().slice(-6)}`;
    setForm(prev => ({
      ...prev,
      accCd: code
    }));
  };

  const clearForm = () => {
    setForm({
      accKy: '',
      accCd: '',
      accNm: '',
      address: '',
      tp1: '',
      fax: '',
      email: '',
      idNo: '',
      crLmt: '',
      vatNo: '',
      fVATRegistered: false,
    });
    setMessage('');
    setIsEditMode(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.accCd || !form.accNm || !form.address) {
      alert('කරුණාකර අවශ්‍ය ක්ෂේත්‍ර පුරවන්න: සැපයුම්කරු කේතය, නම සහ ලිපිනය');
      return;
    }

    // Email validation
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      alert('කරුණාකර වලංගු ඊමේල් ලිපිනයක් ඇතුළත් කරන්න');
      return;
    }

    // Phone validation (10 digits)
    if (form.tp1 && !/^\d{10}$/.test(form.tp1)) {
      alert('කරුණාකර වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න (අංක 10ක්)');
      return;
    }

    const payload = {
      accCd: form.accCd,
      accNm: form.accNm,
      address: form.address,
      tp1: form.tp1 || null,
      fax: form.fax || null,
      email: form.email || null,
      idNo: form.idNo || null,
      crLmt: form.crLmt ? parseFloat(form.crLmt) : 0,
      vatNo: form.vatNo || null,
      fVATRegistered: form.fVATRegistered,
    };

    if (isEditMode && form.accKy) {
      Inertia.put(`/supplier/${form.accKy}`, payload);
    } else {
      Inertia.post('/supplier', payload);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif'
  };

  const labelStyle = {
    fontSize: '13px',
    fontFamily: 'Arial, sans-serif',
    marginBottom: '4px',
    display: 'block',
    fontWeight: '600',
    color: '#333'
  };

  const checkboxStyle = {
    marginRight: '8px',
    transform: 'scale(1.1)'
  };

  return (
    <>
      <Head title="සැපයුම්කරු කළමනාකරණය" />
      <div style={{ 
        width: '800px', 
        margin: '20px auto', 
        padding: '20px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Title Bar */}
        <div style={{ 
          backgroundColor: '#007bff',
          color: 'white',
          padding: '12px 20px',
          marginBottom: '20px',
          fontSize: '16px',
          fontWeight: 'bold',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          🏭 සැපයුම්කරු කළමනාකරණය
        </div>

        {message && (
          <div style={{ 
            marginBottom: 20, 
            padding: '12px',
            backgroundColor: isEditMode ? '#d4edda' : '#f8d7da',
            border: `1px solid ${isEditMode ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '4px',
            fontSize: '14px',
            color: isEditMode ? '#155724' : '#721c24'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Supplier Selection */}
          <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #e9ecef' }}>
            <label style={{ ...labelStyle, fontSize: '14px', marginBottom: '8px' }}>සැපයුම්කරු තෝරන්න</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select 
                value={form.accKy} 
                onChange={handleSupplierSelect}
                style={{ ...inputStyle, backgroundColor: '#fff3cd', flex: 1 }}
                disabled={loading}
              >
                <option value="">තෝරන්න...</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              <button type="button" onClick={handleSearch} disabled={searching} style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                whiteSpace: 'nowrap'
              }}>
                {searching ? 'සොයමින්...' : 'සොයන්න'}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Left Column */}
            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '6px', border: '1px solid #e9ecef' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#495057', fontSize: '16px' }}>මූලික තොරතුරු</h3>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>සැපයුම්කරු කේතය *</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    name="accCd"
                    value={form.accCd}
                    onChange={handleChange}
                    style={{ ...inputStyle, flex: 1 }}
                    maxLength={20}
                    required
                  />
                  <button type="button" onClick={generateSupplierCode} style={{
                    padding: '8px 12px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                  }}>
                    ජනනය
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>සැපයුම්කරු නම *</label>
                <input
                  type="text"
                  name="accNm"
                  value={form.accNm}
                  onChange={handleChange}
                  style={inputStyle}
                  maxLength={60}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>ලිපිනය *</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                  maxLength={255}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>දුරකථන අංකය</label>
                <input
                  type="tel"
                  name="tp1"
                  value={form.tp1}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="0771234567"
                  maxLength={10}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>ෆැක්ස්</label>
                <input
                  type="tel"
                  name="fax"
                  value={form.fax}
                  onChange={handleChange}
                  style={inputStyle}
                  maxLength={14}
                />
              </div>
            </div>

            {/* Right Column */}
            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '6px', border: '1px solid #e9ecef' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#495057', fontSize: '16px' }}>අමතර තොරතුරු</h3>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>ඊමේල්</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  style={inputStyle}
                  maxLength={60}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>හැඳුනුම්පත් අංකය</label>
                <input
                  type="text"
                  name="idNo"
                  value={form.idNo}
                  onChange={handleChange}
                  style={inputStyle}
                  maxLength={20}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>ණය සීමාව (රු.)</label>
                <input
                  type="number"
                  name="crLmt"
                  value={form.crLmt}
                  onChange={handleChange}
                  style={inputStyle}
                  min="0"
                  step="0.01"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>VAT අංකය</label>
                <input
                  type="text"
                  name="vatNo"
                  value={form.vatNo}
                  onChange={handleChange}
                  style={inputStyle}
                  maxLength={50}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="fVATRegistered"
                    checked={form.fVATRegistered}
                    onChange={handleChange}
                    style={checkboxStyle}
                  />
                  VAT ලියාපදිංචි
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            borderTop: '1px solid #e9ecef', 
            paddingTop: '20px', 
            marginTop: '30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '6px',
            border: '1px solid #e9ecef'
          }}>
            <div>
              <button type="button" onClick={clearForm} style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                marginRight: '10px'
              }}>
                ✨ නව දත්ත
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{
                padding: '10px 20px',
                backgroundColor: isEditMode ? '#ffc107' : '#28a745',
                color: isEditMode ? '#212529' : 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {isEditMode ? '📝 යාවත්කාලීන කරන්න' : '💾 ගබඩා කරන්න'}
              </button>

              <button type="button" style={{
                padding: '10px 20px',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                🚪 වසන්න
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SupplierManagement;