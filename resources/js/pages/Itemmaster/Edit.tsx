import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import {route} from 'ziggy-js';

interface Item {
  ItmKy: number;
  ItemCode: string;
  ItmNm: string;
  // Add other item properties
}

interface Props extends PageProps {
  item: Item;
}

const Edit: React.FC<Props> = ({ item }) => {
  return (
    <div className="py-12">
      <Head title={`සංස්කරණය - ${item.ItmNm}`} />
      
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 bg-white border-b border-gray-200">
            
            <h1 className="text-2xl font-bold mb-6">අයිතමය සංස්කරණය: {item.ItmNm}</h1>
            
            {/* Add your edit form here */}
            <p>සංස්කරණ පෝරමය මෙතැන දමන්න</p>
            
            <div className="mt-4">
              <Link
                href={route('itemmaster.index')}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                ආපසු
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;