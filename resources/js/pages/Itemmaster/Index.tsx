import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { PageProps } from '@/types';

interface Item {
  ItmKy: number;
  ItemCode: string;
  ItmNm: string;
  BarCode: string;
  CosPri: number;
  SlsPri: number;
  fInAct: boolean;
}

interface Props extends PageProps {
  items: {
    data: Item[];
    links: any[];
  };
}

const Index: React.FC<Props> = ({ items }) => {
  return (
    <div className="py-12">
      <Head title="Items" />

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 bg-white border-b border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">අයිතම ලැයිස්තුව</h1>
           
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                {/* ... rest of the table code ... */}
                <tbody>
                  {items.data.map((item) => (
                    <tr key={item.ItmKy}>
                      {/* ... table cells ... */}
                      <td className="px-4 py-2 border">
                        <div className="flex space-x-2">
                        
                          {/* ... delete button ... */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {/* ... pagination code ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;