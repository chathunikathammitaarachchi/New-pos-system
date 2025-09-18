// UnitTable.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
interface UnitCnv {
  UnitKy: number;
  Unit: string;
  ConvRate: number;
  finAct: boolean;
  Status?: string | null;
  fBase: boolean;
  Des?: string | null;
  created_at?: string;
  updated_at?: string;
}

const UnitTable: React.FC = () => {
  //  2. Proper types for state
  const [units, setUnits] = useState<UnitCnv[]>([]);
  const [error, setError] = useState<string | null>(null);

  //  3. Fetch units
  useEffect(() => {
    axios
      .get<UnitCnv[]>('/unit-cnv')
      .then((res) => {
        setUnits(res.data);
      })
      .catch(() => {
        // Error message should match the expected string type
        setError('Data load වෙන්න බැරි උනා. නැවත උත්සහ කරන්න.');
      });
  }, []);

  //  4. Render
  return (
    <div>
      <h2>Unit Conversion Table</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
   <table style={{ borderCollapse: 'collapse', width: '100%' }}>
  <thead>
    <tr>
      <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
      <th style={{ border: '1px solid black', padding: '8px' }}>Unit</th>
      <th style={{ border: '1px solid black', padding: '8px' }}>ConvRate</th>
      <th style={{ border: '1px solid black', padding: '8px' }}>finAct</th>
      <th style={{ border: '1px solid black', padding: '8px' }}>Status</th>
      <th style={{ border: '1px solid black', padding: '8px' }}>fBase</th>
      <th style={{ border: '1px solid black', padding: '8px' }}>Description</th>
    </tr>
  </thead>
  <tbody>
    {units.map((item) => (
      <tr key={item.UnitKy}>
        <td style={{ border: '1px solid black', padding: '8px' }}>{item.UnitKy}</td>
        <td style={{ border: '1px solid black', padding: '8px' }}>{item.Unit}</td>
        <td style={{ border: '1px solid black', padding: '8px' }}>{item.ConvRate}</td>
        <td style={{ border: '1px solid black', padding: '8px' }}>{item.finAct ? 'Yes' : 'No'}</td>
        <td style={{ border: '1px solid black', padding: '8px' }}>{item.Status}</td>
        <td style={{ border: '1px solid black', padding: '8px' }}>{item.fBase ? 'Yes' : 'No'}</td>
        <td style={{ border: '1px solid black', padding: '8px' }}>{item.Des}</td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default UnitTable;
