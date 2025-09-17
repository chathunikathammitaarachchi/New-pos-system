import React from 'react';
import { Link } from '@inertiajs/react';

const Layout = ({ children }) => {
    return (
        <div>
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link 
                                    href="/customer-form" 
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Customer Registration
                                </Link>
                                <Link 
                                    href="/supplier-form" 
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Supplier Registration
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            
            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;