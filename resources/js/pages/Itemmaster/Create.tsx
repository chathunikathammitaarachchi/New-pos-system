import React, { useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Head } from '@inertiajs/react';

interface ItemOption {
  id: number;
  name: string;
  code: string;
}

interface CategoryOption {
  id: number;
  name: string;
}

interface SupplierOption {
  id: number;
  name: string;
}

interface UnitOption {
  id: number;
  name: string;
}

interface ItemCodeOption {
  id: number;
  code: string;
  name: string;
}

const Create: React.FC = () => {
  const [form, setForm] = useState({
    fInAct: 'false',
    Status: '',
    CKey: '',
    ItmKy: '',
    ItemCode: '',
    BarCode: '',
    ItmNm: '',
    EnglishName: '',
    cdname: '',
    ItmRefKy: '',
    UnitKy: '',
    CosPri: '',
    NCostPrice: '',
    ExtraPrice: '',
    WholePrice: '',
    ReOrdlLvl: '',
    ScallItem: 'false',
    SupKey: '',
    RtQty1: '',
    RtDis1: '',
    RtQty2: '',
    RtDis2: '',
    RtQty3: '',
    RtDis3: '',
    RtQty4: '',
    RtDis4: '',
    WSQty1: '',
    WSDis1: '',
    WSQty2: '',
    WSDis2: '',
    WSQty3: '',
    WSDis3: '',
    WSQty4: '',
    WSDis4: '',
    DiscountQty: '',
    QuntityDiscount: '',
    CCPrice: '',
    SlsPri: '',
    MaxOrdQty: '',
    ExpiryDate: '',
    ItmCd: '',
    Qty2: '',
    WithDates: 'false',
    ProductionDate: '',
    BatchNo: '',
    VATItem: 'false',
    DoProcess: 'false',
    DoRound: 'false',
    ProcessRatio: '',
    OrderNo: '',
  });

  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [itemOptions, setItemOptions] = useState<ItemOption[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [supplierOptions, setSupplierOptions] = useState<SupplierOption[]>([]);
  const [unitOptions, setUnitOptions] = useState<UnitOption[]>([]);
  const [itemCodeOptions, setItemCodeOptions] = useState<ItemCodeOption[]>([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // Common headers for all requests
        const headers: { [key: string]: string } = {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        };

        // Add CSRF token if using Laravel (get it from meta tag)
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
          headers['X-CSRF-TOKEN'] = csrfToken;
        }

        const fetchOptions = {
          headers,
          credentials: 'include' as RequestCredentials,
        };

        // Fetch all data in parallel for better performance
        const [
          itemResponse,
          itemCodeResponse,
          categoryResponse,
          supplierResponse,
          unitResponse
        ] = await Promise.all([
          fetch('/api/items', fetchOptions),
          fetch('/api/item-codes', fetchOptions),
          fetch('/api/categories', fetchOptions),
          fetch('/api/suppliers', fetchOptions),
          fetch('/api/units', fetchOptions)
        ]);

        // Check each response
        const responses = [itemResponse, itemCodeResponse, categoryResponse, supplierResponse, unitResponse];
        for (const response of responses) {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Non-JSON response:', text.substring(0, 200));
            throw new Error('Server returned HTML instead of JSON');
          }
        }

        // Parse all JSON responses
        const [itemData, itemCodeData, categoryData, supplierData, unitData] = await Promise.all([
          itemResponse.json(),
          itemCodeResponse.json(),
          categoryResponse.json(),
          supplierResponse.json(),
          unitResponse.json()
        ]);

        setItemOptions(itemData as ItemOption[]);
        setItemCodeOptions(itemCodeData as ItemCodeOption[]);
        setCategoryOptions(categoryData as CategoryOption[]);
        setSupplierOptions(supplierData as SupplierOption[]);
        setUnitOptions(unitData as UnitOption[]);

      } catch (error) {
        console.error('Error fetching dropdown data:', error);
        // Check if it's an authentication issue
        if (error instanceof Error && (error.message.includes('HTML') || error.message.includes('DOCTYPE'))) {
          console.error('This appears to be an authentication issue. You might be redirected to a login page.');
          // Redirect to login or show authentication message
          // window.location.href = '/login';
        }
      }
    };

    fetchDropdownData();
  }, []);

  const handleItemCodeSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    
    if (!selectedCode) {
      // Clear form if no selection
      clearForm();
      return;
    }
    
    try {
      setSearching(true);
      setMessage('අයිතමය ලෝඩ් වෙමින්...');
      
      // Fetch item details based on selected code
      const response = await fetch(`/api/item-details/${selectedCode}`);
      const data = await response.json();
      
      if (response.ok && data) {
        const newForm = { ...form };
        for (const key in form) {
          if (key in data) {
            newForm[key as keyof typeof form] = data[key] !== null ? String(data[key]) : '';
          }
        }
        setForm(newForm);
        setMessage('අයිතමය සාර්ථකව ලෝඩ් විය.');
        setIsEditMode(true);
      } else {
        setMessage('අයිතමය සොයාගත නොහැක.');
        setIsEditMode(false);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setMessage('දත්ත ලබා ගැනීමේදී දෝෂයක් සිදුවිය.');
      }
      setIsEditMode(false);
    } finally {
      setSearching(false);
    }
  };

  const handleItemNameSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    
    if (!selectedName) {
      // Clear form if no selection
      clearForm();
      return;
    }
    
    try {
      setSearching(true);
      setMessage('අයිතමය ලෝඩ් වෙමින්...');
      
      // Find the item code from the selected name
      const selectedItem = itemOptions.find((item) => item.name === selectedName);
      if (selectedItem && selectedItem.code) {
        // Fetch item details based on the code
        const response = await fetch(`/api/item-details/${selectedItem.code}`);
        const data = await response.json();
        
        if (response.ok && data) {
          const newForm = { ...form };
          for (const key in form) {
            if (key in data) {
              newForm[key as keyof typeof form] = data[key] !== null ? String(data[key]) : '';
            }
          }
          setForm(newForm);
          setMessage('අයිතමය සාර්ථකව ලෝඩ් විය.');
          setIsEditMode(true);
        } else {
          setMessage('අයිතමය සොයාගත නොහැක.');
          setIsEditMode(false);
        }
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setMessage('දත්ත ලබා ගැනීමේදී දෝෂයක් සිදුවිය.');
      }
      setIsEditMode(false);
    } finally {
      setSearching(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async () => {
    if (!form.ItemCode && !form.ItmNm) {
      alert("කරුණාකර Item Code හෝ Item Name ඇතුළත් කරන්න.");
      return;
    }

    setSearching(true);
    setMessage('සොයමින්...');

    try {
      // Use whichever field has value for search
      const searchTerm = form.ItemCode || form.ItmNm;
      const response = await fetch(`/itemmaster/search?search_term=${searchTerm}`);
      const data = await response.json();

      if (response.ok && data.item) {
        const newForm = { ...form };
        for (const key in form) {
          if (key in data.item) {
            newForm[key as keyof typeof form] = data.item[key] !== null ? String(data.item[key]) : '';
          }
        }
        setForm(newForm);
        setMessage('අයිතමය සාර්ථකව ලෝඩ් විය.');
        setIsEditMode(true);
      } else {
        setMessage('අයිතමය සොයාගත නොහැක.');
        setIsEditMode(false);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setMessage('සෙවීමේදී දෝෂයක් සිදුවිය.');
      }
      setIsEditMode(false);
    } finally {
      setSearching(false);
    }
  };

  const generateBarCode = () => {
    const barCode = `BC${Date.now()}${Math.floor(Math.random() * 1000)}`;
    setForm({
      ...form,
      BarCode: barCode,
    });
  };

  const clearForm = () => {
    setForm({
      fInAct: 'false',
      Status: '',
      CKey: '',
      ItmKy: '',
      ItemCode: '',
      BarCode: '',
      ItmNm: '',
      EnglishName: '',
      cdname: '',
      ItmRefKy: '',
      UnitKy: '',
      CosPri: '',
      NCostPrice: '',
      ExtraPrice: '',
      WholePrice: '',
      ReOrdlLvl: '',
      ScallItem: 'false',
      SupKey: '',
      RtQty1: '',
      RtDis1: '',
      RtQty2: '',
      RtDis2: '',
      RtQty3: '',
      RtDis3: '',
      RtQty4: '',
      RtDis4: '',
      WSQty1: '',
      WSDis1: '',
      WSQty2: '',
      WSDis2: '',
      WSQty3: '',
      WSDis3: '',
      WSQty4: '',
      WSDis4: '',
      DiscountQty: '',
      QuntityDiscount: '',
      CCPrice: '',
      SlsPri: '',
      MaxOrdQty: '',
      ExpiryDate: '',
      ItmCd: '',
      Qty2: '',
      WithDates: 'false',
      ProductionDate: '',
      BatchNo: '',
      VATItem: 'false',
      DoProcess: 'false',
      DoRound: 'false',
      ProcessRatio: '',
      OrderNo: '',
    });
    setMessage('');
    setIsEditMode(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.ItemCode || !form.ItmNm) {
      alert('කරුණාකර අවශ්‍ය ක්ෂේත්‍ර පුරවන්න: Item Code සහ Item Name');
      return;
    }

    const payload = {
      ...form,
      fInAct: form.fInAct === 'true',
      ScallItem: form.ScallItem === 'true',
      WithDates: form.WithDates === 'true',
      VATItem: form.VATItem === 'true',
      DoProcess: form.DoProcess === 'true',
      DoRound: form.DoRound === 'true',
      CKey: form.CKey ? parseInt(form.CKey) : null,
      ItmKy: form.ItmKy ? parseInt(form.ItmKy) : null,
      cdname: form.cdname ? parseInt(form.cdname) : null,
      ItmRefKy: form.ItmRefKy ? parseInt(form.ItmRefKy) : null,
      UnitKy: form.UnitKy ? parseInt(form.UnitKy) : null,
      CosPri: form.CosPri ? parseFloat(form.CosPri) : null,
      NCostPrice: form.NCostPrice ? parseFloat(form.NCostPrice) : null,
      ExtraPrice: form.ExtraPrice ? parseFloat(form.ExtraPrice) : null,
      WholePrice: form.WholePrice ? parseFloat(form.WholePrice) : null,
      ReOrdlLvl: form.ReOrdlLvl ? parseInt(form.ReOrdlLvl) : null,
      SupKey: form.SupKey ? parseInt(form.SupKey) : null,
      RtQty1: form.RtQty1 ? parseInt(form.RtQty1) : null,
      RtDis1: form.RtDis1 ? parseFloat(form.RtDis1) : null,
      RtQty2: form.RtQty2 ? parseInt(form.RtQty2) : null,
      RtDis2: form.RtDis2 ? parseFloat(form.RtDis2) : null,
      RtQty3: form.RtQty3 ? parseInt(form.RtQty3) : null,
      RtDis3: form.RtDis3 ? parseFloat(form.RtDis3) : null,
      RtQty4: form.RtQty4 ? parseInt(form.RtQty4) : null,
      RtDis4: form.RtDis4 ? parseFloat(form.RtDis4) : null,
      WSQty1: form.WSQty1 ? parseInt(form.WSQty1) : null,
      WSDis1: form.WSDis1 ? parseFloat(form.WSDis1) : null,
      WSQty2: form.WSQty2 ? parseInt(form.WSQty2) : null,
      WSDis2: form.WSDis2 ? parseFloat(form.WSDis2) : null,
      WSQty3: form.WSQty3 ? parseInt(form.WSQty3) : null,
      WSDis3: form.WSDis3 ? parseFloat(form.WSDis3) : null,
      WSQty4: form.WSQty4 ? parseInt(form.WSQty4) : null,
      WSDis4: form.WSDis4 ? parseFloat(form.WSDis4) : null,
      DiscountQty: form.DiscountQty ? parseInt(form.DiscountQty) : null,
      QuntityDiscount: form.QuntityDiscount ? parseFloat(form.QuntityDiscount) : null,
      CCPrice: form.CCPrice ? parseFloat(form.CCPrice) : null,
      SlsPri: form.SlsPri ? parseFloat(form.SlsPri) : null,
      MaxOrdQty: form.MaxOrdQty ? parseInt(form.MaxOrdQty) : null,
      Qty2: form.Qty2 ? parseInt(form.Qty2) : null,
      ProcessRatio: form.ProcessRatio ? parseFloat(form.ProcessRatio) : null,
      OrderNo: form.OrderNo ? parseInt(form.OrderNo) : null,
      ExpiryDate: form.ExpiryDate || null,
      ProductionDate: form.ProductionDate || null,
      BatchNo: form.BatchNo || null,
      ItemCode: form.ItemCode,
      Status: form.Status,
      ItmNm: form.ItmNm,
      EnglishName: form.EnglishName,
      BarCode: form.BarCode,
      ItmCd: form.ItmCd,
    };

    if (isEditMode) {
      Inertia.put(`/itemmaster/${form.ItmKy}`, payload);
    } else {
      Inertia.post('/itemmaster', payload);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '6px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    fontSize: '12px',
    fontFamily: 'Arial, sans-serif'
  };

  const labelStyle = {
    fontSize: '11px',
    fontFamily: 'Arial, sans-serif',
    marginBottom: '2px',
    display: 'block',
    fontWeight: '500'
  };

  const checkboxStyle = {
    marginRight: '5px'
  };

  return (
    <>
      <Head title="New Item Entry" />
      <div style={{ 
        width: '950px', 
        margin: '20px auto', 
        padding: '10px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #999',
        fontFamily: 'Arial, sans-serif',
        fontSize: '11px'
      }}>
        {/* Title Bar */}
        <div style={{ 
          backgroundColor: '#0078d4',
          color: 'white',
          padding: '5px 10px',
          marginBottom: '15px',
          fontSize: '11px',
          fontWeight: 'bold'
        }}>
          📄 New Item Entry
        </div>

        {message && (
          <div style={{ 
            marginBottom: 15, 
            padding: '5px',
            backgroundColor: isEditMode ? '#d4edda' : '#f8d7da',
            border: `1px solid ${isEditMode ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '3px',
            fontSize: '11px'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '15px' }}>
            {/* Left Column */}
            <div style={{ flex: '1' }}>
              {/* Basic Info Section */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px 10px', alignItems: 'center', marginBottom: '15px' }}>
                <label style={labelStyle}>අයිතම් අංකය</label>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <select 
                    value={form.ItemCode} 
                    onChange={handleItemCodeSelect}
                    style={{ ...inputStyle, backgroundColor: '#ffff99' }}
                  >
                    <option value="">තෝරන්න</option>
                    {itemCodeOptions.map((option) => (
                      <option key={option.id} value={option.code}>
                        {option.code} - {option.name}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={handleSearch} disabled={searching} style={{
                    padding: '6px 12px',
                    backgroundColor: '#0078d4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '11px'
                  }}>
                    {searching ? 'සොයමින්...' : 'සොයන්න'}
                  </button>
                </div>
                
                <label style={labelStyle}>භාණ්ඩ විස්තරය</label>
                <select 
                  name="ItmNm"
                  value={form.ItmNm}
                  onChange={handleItemNameSelect}
                  style={inputStyle}
                >
                  <option value="">තෝරන්න</option>
                  {itemOptions.map((option) => (
                    <option key={option.id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>

                <label style={labelStyle}>English Name</label>
                <input
                  type="text"
                  name="EnglishName"
                  value={form.EnglishName}
                  onChange={handleChange}
                  style={inputStyle}
                />

                <label style={labelStyle}>භාණ්ඩ වර්ගය</label>
                <select 
                  name="cdname"
                  value={form.cdname}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">තෝරන්න</option>
                  {categoryOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>

                <label style={labelStyle}> ගැණුම් මිල</label>
                <input
                  type="number"
                  step="0.01"
                  name="CosPri"
                  value={form.CosPri}
                  onChange={handleChange}
                  style={inputStyle}
                />

                <label style={labelStyle}>සම්මානය ගැණුම් මිල</label>
                <input
                  type="number"
                  step="0.01"
                  name="NCostPrice"
                  value={form.NCostPrice}
                  onChange={handleChange}
                  style={inputStyle}
                />

                <label style={labelStyle}>විකුණුම් මිල</label>
                <input
                  type="number"
                  step="0.01"
                  name="SlsPri"
                  value={form.SlsPri}
                  onChange={handleChange}
                  style={inputStyle}
                />

                <label style={labelStyle}>තොග මිල</label>
                <input
                  type="number"
                  step="0.01"
                  name="WholePrice"
                  value={form.WholePrice}
                  onChange={handleChange}
                  style={inputStyle}
                />

                <label style={labelStyle}>අමතර මිල</label>
                <input
                  type="number"
                  step="0.01"
                  name="ExtraPrice"
                  value={form.ExtraPrice}
                  onChange={handleChange}
                  style={inputStyle}
                />

                <label style={labelStyle}>අවම තොග වට්ටම</label>
                <input
                  type="number"
                  name="ReOrdlLvl"
                  value={form.ReOrdlLvl}
                  onChange={handleChange}
                  style={inputStyle}
                />

                <label style={labelStyle}>Bar Code</label>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <input
                    type="text"
                    name="BarCode"
                    value={form.BarCode}
                    onChange={handleChange}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button type="button" onClick={generateBarCode} style={{
                    padding: '6px 8px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '10px'
                  }}>
                    Generate BarCode
                  </button>
                </div>

                <label style={labelStyle}>ඒකකය</label>
                <select 
                  name="UnitKy"
                  value={form.UnitKy}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">තෝරන්න</option>
                  {unitOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>

                <label style={labelStyle}>කාඩ් මිල</label>
                <input
                  type="number"
                  step="0.01"
                  name="CCPrice"
                  value={form.CCPrice}
                  onChange={handleChange}
                  style={inputStyle}
                />

                <label style={labelStyle}>සැපයුම්කරු</label>
                <select 
                  name="SupKey"
                  value={form.SupKey}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">තෝරන්න</option>
                  {supplierOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Retail Discounts */}
              <div style={{ marginBottom: '15px' }}>
                <div style={{ 
                  backgroundColor: '#e9ecef', 
                  padding: '5px', 
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  fontSize: '11px'
                }}>
                  අලෙවි මිල සහන වර්ග
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px', marginBottom: '5px' }}>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>අවම ප්‍රමාණය 1</div>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>අවම ප්‍රමාණය  2</div>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>අවම ප්‍රමාණය  3</div>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>අවම ප්‍රමාණය  4</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px', marginBottom: '5px' }}>
                  <input type="number" name="RtQty1" value={form.RtQty1} onChange={handleChange} style={inputStyle} />
                  <input type="number" name="RtQty2" value={form.RtQty2} onChange={handleChange} style={inputStyle} />
                  <input type="number" name="RtQty3" value={form.RtQty3} onChange={handleChange} style={inputStyle} />
                  <input type="number" name="RtQty4" value={form.RtQty4} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px', marginBottom: '5px' }}>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>සහන ප්‍රතිශත1</div>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>සහන ප්‍රතිශත2</div>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>සහන ප්‍රතිශත3</div>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>සහන ප්‍රතිශත4</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px' }}>
                  <input type="number" step="0.01" name="RtDis1" value={form.RtDis1} onChange={handleChange} style={inputStyle} />
                  <input type="number" step="0.01" name="RtDis2" value={form.RtDis2} onChange={handleChange} style={inputStyle} />
                  <input type="number" step="0.01" name="RtDis3" value={form.RtDis3} onChange={handleChange} style={inputStyle} />
                  <input type="number" step="0.01" name="RtDis4" value={form.RtDis4} onChange={handleChange} style={inputStyle} />
                </div>
              </div>

              {/* Wholesale Discounts */}
              <div style={{ marginBottom: '15px' }}>
                <div style={{ 
                  backgroundColor: '#e9ecef', 
                  padding: '5px', 
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  fontSize: '11px'
                }}>
                  තොග මිල සහන වර්ග
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px', marginBottom: '5px' }}>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>අවම ප්‍රමාණය 1</div>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>අවම ප්‍රමාණය   2</div>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>අවම ප්‍රමාණය   3</div>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>අවම ප්‍රමාණය  4</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px', marginBottom: '5px' }}>
                  <input type="number" name="WSQty1" value={form.WSQty1} onChange={handleChange} style={inputStyle} />
                  <input type="number" name="WSQty2" value={form.WSQty2} onChange={handleChange} style={inputStyle} />
                  <input type="number" name="WSQty3" value={form.WSQty3} onChange={handleChange} style={inputStyle} />
                  <input type="number" name="WSQty4" value={form.WSQty4} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px', marginBottom: '5px' }}>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>සහන ප්‍රතිශත1</div>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>සහන ප්‍රතිශත2</div>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>සහන ප්‍රතිශත3</div>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>සහන ප්‍රතිශත4</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px' }}>
                  <input type="number" step="0.01" name="WSDis1" value={form.WSDis1} onChange={handleChange} style={inputStyle} />
                  <input type="number" step="0.01" name="WSDis2" value={form.WSDis2} onChange={handleChange} style={inputStyle} />
                  <input type="number" step="0.01" name="WSDis3" value={form.WSDis3} onChange={handleChange} style={inputStyle} />
                  <input type="number" step="0.01" name="WSDis4" value={form.WSDis4} onChange={handleChange} style={inputStyle} />
                </div>
              </div>

              {/* Price Table */}
              <div style={{ marginBottom: '15px' }}>
                <div style={{ 
                  backgroundColor: '#e9ecef', 
                  padding: '5px', 
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  fontSize: '11px'
                }}>
                  මුල් මිල ගණන්
                </div>
             <table style={{ width: '100%', border: '1px solid #ccc', borderCollapse: 'collapse', fontSize: '10px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ border: '1px solid #ccc', padding: '3px' }}>අංකය</th>
                    <th style={{ border: '1px solid #ccc', padding: '3px' }}>සා. ගැණුම් මිල</th>
                    <th style={{ border: '1px solid #ccc', padding: '3px' }}>ගැණුම් මිල</th>
                    <th style={{ border: '1px solid #ccc', padding: '3px' }}>විකුණුම් මිල</th>
                    <th style={{ border: '1px solid #ccc', padding: '3px' }}>තොග මිල</th>
                    <th style={{ border: '1px solid #ccc', padding: '3px' }}>අමතර මිල</th>
                    <th style={{ border: '1px solid #ccc', padding: '3px' }}>කාඩ් මිල</th>
                    <th style={{ border: '1px solid #ccc', padding: '3px' }}>දිනය</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td style={{ border: '1px solid #ccc', padding: '2px' }}>
                        <input type="number" step="0.01" value={form.ItmCd} style={{ width: '100%', padding: '1px', fontSize: '10px' }} readOnly />
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '2px' }}>
                        <input type="number" step="0.01" value={form.NCostPrice} style={{ width: '100%', padding: '1px', fontSize: '10px' }} readOnly />
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '2px' }}>
                        <input type="number" step="0.01" value={form.CosPri} style={{ width: '100%', padding: '1px', fontSize: '10px' }} readOnly />
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '2px' }}>
                        <input type="number" step="0.01" value={form.SlsPri} style={{ width: '100%', padding: '1px', fontSize: '10px' }} readOnly />
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '2px' }}>
                        <input type="number" step="0.01" value={form.WholePrice} style={{ width: '100%', padding: '1px', fontSize: '10px' }} readOnly />
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '2px' }}>
                        <input type="number" step="0.01" value={form.ExtraPrice} style={{ width: '100%', padding: '1px', fontSize: '10px' }} readOnly />
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '2px' }}>
                        <input type="number" step="0.01" value={form.CCPrice} style={{ width: '100%', padding: '1px', fontSize: '10px' }} readOnly />
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '2px' }}>
                        <input type="text" value={form.WithDates} style={{ width: '100%', padding: '1px', fontSize: '10px' }} readOnly />
                    </td>
                    </tr>
                </tbody>
                </table>

              </div>
            </div>

            {/* Right Column */}
            <div style={{ width: '200px' }}>
              {/* Checkboxes */}
              <div style={{ marginBottom: '15px' }}>
                <div>
                  <input 
                    type="checkbox" 
                    id="gammanGala"
                    name="fInAct"
                    checked={form.fInAct === 'true'}
                    onChange={(e) => setForm({...form, fInAct: e.target.checked ? 'true' : 'false'})}
                    style={checkboxStyle}
                  />
                  <label htmlFor="gammanGala" style={labelStyle}>භාවිතයේ ඇත</label>
                </div>
                
                <div>
                  <input 
                    type="checkbox" 
                    id="warAmunala"
                    name="VATItem"
                    checked={form.VATItem === 'true'}
                    onChange={(e) => setForm({...form, VATItem: e.target.checked ? 'true' : 'false'})}
                    style={checkboxStyle}
                  />
                  <label htmlFor="warAmunala" style={labelStyle}>වැට් ඇතුළත්</label>
                </div>
                
                <div>
                  <input 
                    type="checkbox" 
                    id="gammagakankana"
                    name="DoProcess"
                    checked={form.DoProcess === 'true'}
                    onChange={(e) => setForm({...form, DoProcess: e.target.checked ? 'true' : 'false'})}
                    style={checkboxStyle}
                  />
                  <label htmlFor="gammagakankana" style={labelStyle}>ගණනය කරන්න</label>
                </div>
                
                <div>
                  <input 
                    type="checkbox" 
                    id="punanaAlawela"
                    name="DoRound"
                    checked={form.DoRound === 'true'}
                    onChange={(e) => setForm({...form, DoRound: e.target.checked ? 'true' : 'false'})}
                    style={checkboxStyle}
                  />
                  <label htmlFor="punanaAlawela" style={labelStyle}>පූර්ණ වටයට අගයන්න</label>
                </div>
              </div>

              {/* Additional Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                <div>
                  <label style={labelStyle}>අවම ප්‍රමාණය</label>
                  <input
                    type="text"
                    name="QuntityDiscount"
                    value={form.QuntityDiscount}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>භාණ්ඩ වට්ටම</label>
                  <input
                    type="number"
                    name="DiscountQty"
                    value={form.DiscountQty}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>අත ඇති තොගය</label>
                  <input
                    type="text"
                    name="Qty2"
                    value={form.Qty2}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>කල් ඉකුත්වන දිනය</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="date"
                    name="ExpiryDate"
                    value={form.ExpiryDate || ''}
                    onChange={handleChange}
                    style={{ ...inputStyle, fontSize: '10px' }}
                    />

                  </div>
                </div>

                <div>
                  <label style={labelStyle}>මිල මකා දමන්න</label>
                  <button type="button" style={{
                    width: '100%',
                    padding: '6px',
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '10px'
                  }}>
                    මිල මකා දමන්න
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Buttons */}
          <div style={{ 
            borderTop: '1px solid #ccc', 
            paddingTop: '10px', 
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '11px'
              }}>
                Show Item Delete
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={clearForm} style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '11px'
              }}>
                නව දත්ත
              </button>

              <button type="submit" style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 'bold'
              }}>
                ගබඩා කරන්න
              </button>

              <button type="button" style={{
                padding: '8px 16px',
                backgroundColor: '#ffc107',
                color: 'black',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '11px'
              }}>
                වෙනස් කරන්න
              </button>

              <button type="button" style={{
                padding: '8px 16px',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '11px'
              }}>
                අවසාන කරන්න
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Create;