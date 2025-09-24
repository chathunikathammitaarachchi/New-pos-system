import React, { useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Head } from '@inertiajs/react';
interface ItemOption {
  id: number;
  name: string;
  code: string;
}

interface CategoryOption {
  id: string;    
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
  categoryName?: string;
}

const Create: React.FC = () => {
  const initialFormState = {
    fInAct: 'false',
    Status: '',
    CKey: '',
    ItmKy: '',
    ItemCode: '',
    BarCode: '',
    ItmNm: '',
    EnglishName: '',
    catkey: '',
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
  };

  const [form, setForm] = useState(initialFormState);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [itemOptions, setItemOptions] = useState<ItemOption[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [supplierOptions, setSupplierOptions] = useState<SupplierOption[]>([]);
  const [unitOptions, setUnitOptions] = useState<UnitOption[]>([]);
  const [itemCodeOptions, setItemCodeOptions] = useState<ItemCodeOption[]>([]);
  const [loading, setLoading] = useState(false);
const handleManualItemCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      ItemCode: e.target.value
    });
  };


  // Manual text input
const handleItemNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  setForm(prev => ({
    ...prev,
    ItmNm: e.target.value
  }));
};



  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoading(true);
        
        const headers: Record<string, string> = {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        };

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
          headers['X-CSRF-TOKEN'] = csrfToken;
        }

        const fetchOptions: RequestInit = {
          headers,
          credentials: 'include' as RequestCredentials,
        };

        const endpoints = [
          { 
            url: '/api/items', 
            setter: setItemOptions, 
            fallback: [] 
          },
          { 
            url: '/api/item-codes-with-category',
            setter: setItemCodeOptions, 
            fallback: [] 
          },
          { 
            url: '/api/cd-codes', 
            setter: setCategoryOptions, 
            fallback: [] 
          },
          { 
            url: '/api/suppliers', 
            setter: setSupplierOptions, 
            fallback: [] 
          },
          { 
            url: '/api/units', 
            setter: setUnitOptions, 
            fallback: [] 
          }
        ];



        
        const fetchPromises = endpoints.map(async ({ url, setter, fallback }) => {
          try {
            const response = await fetch(url, fetchOptions);
            
            if (!response.ok) {
              console.warn(`API ${url} failed: ${response.status}`);
              setter(fallback);
              return null;
            }
            
            const data = await response.json();
            
            // Handle different response formats
            let safeData;
            if (Array.isArray(data)) {
              safeData = data;
            } else if (Array.isArray(data?.data)) {
              safeData = data.data;
            } else {
              safeData = fallback;
            }
            
            setter(safeData);
            return safeData;
          } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            setter(fallback);
            return null;
          }
        });

        await Promise.all(fetchPromises);

      } catch (error) {
        console.error('Error in fetchDropdownData:', error);
        setMessage('Failed to load dropdown data. Some features may not work properly.');
      } finally {
        setLoading(false);
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


 // Dropdown selection
  const handleItemNameSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedName = e.target.value;

  setForm(prev => ({
    ...prev,
    ItmNm: selectedName,  // sync form field
  }));

  if (!selectedName) {
    setMessage('');
    setIsEditMode(false);
    return;
  }

  try {
    setSearching(true);
    setMessage('අයිතමය ලෝඩ් වෙමින්...');

    const selectedItem = itemOptions.find(item => item.name === selectedName);

    if (selectedItem && selectedItem.code) {
      const response = await fetch(`/api/item-details/${selectedItem.code}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data) {
        const newForm = { ...initialFormState };

        for (const key in newForm) {
          if (key in data && data[key] !== null && data[key] !== undefined) {
            newForm[key as keyof typeof newForm] = String(data[key]);
          }
        }

        setForm(newForm);
        setMessage('අයිතමය සාර්ථකව ලෝඩ් විය.');
        setIsEditMode(true);
      } else {
        setMessage('අයිතමය සොයාගත නොහැක.');
        setIsEditMode(false);
      }
    } else {
      setMessage('අයිතම කේතය සොයාගත නොහැක.');
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
      const searchTerm = form.ItemCode || form.ItmNm;
      const response = await fetch(`/itemmaster/search?search_term=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data && data.item) {
        const newForm = { ...initialFormState };
        for (const key in newForm) {
          if (key in data.item && data.item[key] !== null && data.item[key] !== undefined) {
            newForm[key as keyof typeof newForm] = String(data.item[key]);
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
      setMessage('සෙවීමේදී දෝෂයක් සිදුවිය.');
      setIsEditMode(false);
    } finally {
      setSearching(false);
    }
  };

 const generateBarCode = () => {
  // Get current timestamp in milliseconds (normally 13 digits)
  const timestamp = Date.now().toString();

  // Ensure barcode is 13 digits:
  // If timestamp is longer than 13, truncate
  // If shorter, pad with random digits
  let barCode = timestamp;
  if (barCode.length > 13) {
    barCode = barCode.substring(0, 13);
  } else if (barCode.length < 13) {
    const remainingLength = 13 - barCode.length;
    const randomDigits = Math.floor(Math.random() * Math.pow(10, remainingLength))
                          .toString()
                          .padStart(remainingLength, '0');
    barCode += randomDigits;
  }

  setForm({
    ...form,
    BarCode: barCode,
  });
};

  const clearForm = () => {
    setForm(initialFormState);
    setMessage('');
    setIsEditMode(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.ItemCode || !form.ItmNm) {
      alert('කරුණාකර අවශ්‍ය ක්ෂේත්‍ර පුරවන්න: Item Code සහ Item Name');
      return;
    }


      console.log('Submitting form data:', {
    ...form,
    catkey: form.catkey,
    catkeyType: typeof form.catkey
  });

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
    catkey: form.catkey || null,  
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

   console.log('Final payload with catkey:', payload.catkey);
  console.log('Category Options:', categoryOptions);
  console.log('Selected catkey:', form.catkey);

  if (isEditMode) {
    Inertia.put(`/itemmaster/${form.ItmKy}`, payload);
  } else {
    Inertia.post('/itemmaster', payload);
  }
};
// Soft refresh function
const handleSoftRefresh = async () => {
  setMessage('Refreshing data...');
  setSearching(true);
  
  // Clear form but keep basic selections
  const currentItemCode = form.ItemCode;
  const currentItemName = form.ItmNm;
  
  clearForm();
  
  // Restore basic selections
  setForm(prev => ({
    ...prev,
    ItemCode: currentItemCode,
    ItmNm: currentItemName
  }));
  
  // Re-fetch dropdown data
  await fetchDropdownData();
  
  setMessage('Data refreshed successfully');
  setSearching(false);
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
  marginBottom: '4px',
  display: 'block',
  fontWeight: '500'
};

  const checkboxStyle = {
    marginRight: '5px'
  };

  const rowStyle = {
  display: 'flex',
  gap: '50px',
    justifyContent: 'space-between',

    marginBottom: '15px',

};

const columnStyle = {
  flex: 0.5,
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};



 return (
  <>
    <Head title="New Item Entry" />
    <div style={{ 
      width: '750px', 
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

      {loading && (
        <div style={{ 
          marginBottom: 15, 
          padding: '5px',
          backgroundColor: '#d1ecf1',
          border: '1px solid #bee5eb',
          borderRadius: '3px',
          fontSize: '11px'
        }}>
          Loading dropdown data...
        </div>
      )}

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
            {/* Grid Section for Basic Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px 10px', alignItems: 'center', marginBottom: '15px' }}>
              {/* Item Code */}
              {/* Item Code */}
<label style={labelStyle}>අයිතම් අංකය</label>
<div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
  <input
    type="text"
    list="itemCodeList"
    placeholder="අයිතම කේතය ටයිප් කරන්න හෝ තෝරන්න"
    value={form.ItemCode}
    onChange={handleManualItemCodeChange}
    style={{ 
      ...inputStyle, 
      flex: 1, 
      fontSize: '11px', 
      padding: '6px 8px' 
    }}
    disabled={loading}
  />
  <button 
    type="button" 
    onClick={handleSearch} 
    disabled={searching || loading}
    style={{
      padding: '6px 10px',
      backgroundColor: '#0078d4',
      color: 'white',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
      fontSize: '11px',
      whiteSpace: 'nowrap'
    }}
  >
    {searching ? 'සොයමින්...' : 'සොයන්න'}
  </button>

  {/* Datalist for autocomplete */}
  <datalist id="itemCodeList">
    {Array.isArray(itemCodeOptions) && itemCodeOptions.map((option) => (
      <option key={option.id} value={option.code}>
        {option.code} - {option.name}
      </option>
    ))}
  </datalist>
</div>

            {/* Item Name */}
<label style={labelStyle}>භාණ්ඩ විස්තරය</label>
<div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
  <input
    type="text"
    name="ItmNm"
    list="itemNameList"
    placeholder="භාණ්ඩ නම ටයිප් කරන්න හෝ තෝරන්න"
    value={form.ItmNm}
    onChange={handleItemNameInput}
    style={inputStyle}
    disabled={loading}
  />
  <datalist id="itemNameList">
    {Array.isArray(itemOptions) && itemOptions.map((option, index) => (
      <option key={option.id ?? index} value={option.name} />
    ))}
  </datalist>
</div>

              {/* English Name */}
              <label style={labelStyle}>English Name</label>
              <input
                type="text"
                name="EnglishName"
                value={form.EnglishName}
                onChange={handleChange}
                style={inputStyle}
              />
              {/* Category */}
              <label style={labelStyle}>භාණ්ඩ වර්ගය</label>
              <select 
                name="catkey"
                value={form.catkey}
                onChange={handleChange}
                style={inputStyle}
                disabled={loading || categoryOptions.length === 0}
              >
                <option value="">තෝරන්න</option>
                {Array.isArray(categoryOptions) && categoryOptions.map((option, index) => (
                  <option key={option.id || index} value={option.id}>  {/* value = catkey */}
                    {option.name}  {/* Display = cname */}
                  </option>
                ))}
              </select>
              </div>
         {/* Price Fields */}
<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
  {/* Row 1 */}
  <div style={{ display: 'flex', gap: '20px' }}>
    <div style={{ flex: 1 }}>
      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>ගැණුම් මිල</label>
      <input
        type="number"
        step="0.01"
        name="CosPri"
        value={form.CosPri}
        onChange={handleChange}
        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
    </div>
    <div style={{ flex: 1 }}>
      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>සාමාන්‍ය ගැණුම් මිල</label>
      <input
        type="number"
        step="0.01"
        name="NCostPrice"
        value={form.NCostPrice}
        onChange={handleChange}
        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
    </div>
  </div>

  {/* Row 2 */}
  <div style={{ display: 'flex', gap: '20px' }}>
    <div style={{ flex: 1 }}>
      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>සිල්ලර මිල</label>
      <input
        type="number"
        step="0.01"
        name="SlsPri"
        value={form.SlsPri}
        onChange={handleChange}
        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
    </div>
    <div style={{ flex: 1 }}>
      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>තොග මිල</label>
      <input
        type="number"
        step="0.01"
        name="WholePrice"
        value={form.WholePrice}
        onChange={handleChange}
        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
    </div>
  </div>

  {/* Row 3 */}
  <div style={{ display: 'flex', gap: '20px' }}>
    <div style={{ flex: 1 }}>
      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>අමතර මිල</label>
      <input
        type="number"
        step="0.01"
        name="ExtraPrice"
        value={form.ExtraPrice}
        onChange={handleChange}
        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
    </div>
    <div style={{ flex: 1 }}>
      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>කාඩ් මිල</label>
      <input
        type="number"
        step="0.01"
        name="CCPrice"
        value={form.CCPrice}
        onChange={handleChange}
        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
    </div>
  </div>

  {/* Row 4 */}
  <div style={{ display: 'flex', gap: '20px' }}>
    <div style={{ flex: 1 }}>
      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>අවම තොග වට්ටම</label>
      <input
        type="number"
        name="ReOrdlLvl"
        value={form.ReOrdlLvl}
        onChange={handleChange}
        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
    </div>
    <div style={{ flex: 1 }}>
      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>ඒකකය</label>
      <select
        name="UnitKy"
        value={form.UnitKy}
        onChange={handleChange}
        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      >
        <option value="">තෝරන්න</option>
        {unitOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>





<div style={{ display: 'flex', gap: '40px', marginBottom: '15px', alignItems: 'flex-start' }}>
  {/* Bar Code Section */}
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <label style={labelStyle}>Bar Code</label>
    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
      <input
        type="text"
        name="BarCode"
        value={form.BarCode}
        onChange={handleChange}
        style={{ ...inputStyle, width: '150px' }}
      />
      <button
        type="button"
        onClick={generateBarCode}
        style={{
          padding: '6px 10px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer',
          fontSize: '11px',
          height: '30px'
        }}
      >
        Generate
      </button>
    </div>
  </div>

  {/* Supplier Section */}
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
    <label style={labelStyle}>සැපයුම්කරු</label>
    <select
      name="SupKey"
      value={form.SupKey}
      onChange={handleChange}
      style={inputStyle}
      disabled={loading}
    >
      <option value="">තෝරන්න</option>
      {Array.isArray(supplierOptions) &&
        supplierOptions.map((option, index) => (
          <option key={option.id || index} value={option.id}>
            {option.name}
          </option>
        ))}
    </select>
  </div>
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
                  සිල්ලර මිල සදහා වට්ටම්
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
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>සහන වට්ටම 1</div>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>සහන වට්ටම 2</div>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>සහන වට්ටම 3</div>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>සහන වට්ටම 4</div>
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
                  තොග මිල සදහා වට්ටම්
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px', marginBottom: '5px' }}>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>අවම ප්‍රමාණය 1</div>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>අවම ප්‍රමාණය 2</div>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>අවම ප්‍රමාණය 3</div>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>අවම ප්‍රමාණය 4</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px', marginBottom: '5px' }}>
                  <input type="number" name="WSQty1" value={form.WSQty1} onChange={handleChange} style={inputStyle} />
                  <input type="number" name="WSQty2" value={form.WSQty2} onChange={handleChange} style={inputStyle} />
                  <input type="number" name="WSQty3" value={form.WSQty3} onChange={handleChange} style={inputStyle} />
                  <input type="number" name="WSQty4" value={form.WSQty4} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px', marginBottom: '5px' }}>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>සහන වට්ටම 1</div>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>සහන වට්ටම 2</div>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>සහන වට්ටම 3</div>
                  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>සහන වට්ටම 4</div>
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

function fetchDropdownData() {
  throw new Error('Function not implemented.');
}
