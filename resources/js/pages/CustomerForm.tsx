import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Layout from '../layouts/layout';

interface CustomerFormData {
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

const CustomerForm = () => {
    const { data, setData, post, processing, errors, reset } = useForm<CustomerFormData>({
        accCd: '',
        accNm: '',
        address: '',
        tp1: '',
        fax: '',
        email: '',
        idNo: '',
        crLmt: '',
        vatNo: '',
        fVATRegistered: false
    });

    const [localErrors, setLocalErrors] = useState<Partial<Record<keyof CustomerFormData, string>>>({});

    const validate = (): boolean => {
        const newErrors: typeof localErrors = {};

        if (!data.accCd.trim()) newErrors.accCd = 'Account Code is required.';
        if (!data.accNm.trim()) newErrors.accNm = 'Account Name is required.';

        if (!/^[A-Za-z\s\.,\-]+$/.test(data.address.trim())) {
            newErrors.address = 'Address must contain only letters, spaces, dots, commas or dashes.';
        }

        if (data.tp1 && !/^\d{10}$/.test(data.tp1)) {
            newErrors.tp1 = 'Phone number must be exactly 10 digits.';
        }

        if (data.fax && !/^\d{6,14}$/.test(data.fax)) {
            newErrors.fax = 'Fax must be between 6 and 14 digits.';
        }

        if (data.vatNo && !/^\d{6,50}$/.test(data.vatNo)) {
            newErrors.vatNo = 'VAT Number must be 6 to 50 digits.';
        }

        if (data.idNo && !/^\d{6,20}$/.test(data.idNo)) {
            newErrors.idNo = 'ID Number must be 6 to 20 digits.';
        }

        if (data.crLmt && isNaN(Number(data.crLmt))) {
            newErrors.crLmt = 'Credit Limit must be a number.';
        } else if (Number(data.crLmt) < 0) {
            newErrors.crLmt = 'Credit Limit cannot be negative.';
        }

        setLocalErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        post('/customers', {
            onSuccess: () => {
                reset();
                setLocalErrors({});
            },
            preserveScroll: true
        });
    };

    const showError = (field: keyof CustomerFormData) => {
        return localErrors[field] || errors[field];
    };

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4">Customer Registration</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">අංකය</label>
                            <input
                                type="text"
                                value={data.accCd}
                                onChange={e => setData('accCd', e.target.value)}
                                required
                                maxLength={20}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {showError('accCd') && <div className="text-red-600 text-sm">{showError('accCd')}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">නම</label>
                            <input
                                type="text"
                                value={data.accNm}
                                onChange={e => setData('accNm', e.target.value)}
                                required
                                maxLength={60}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {showError('accNm') && <div className="text-red-600 text-sm">{showError('accNm')}</div>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">ලිපිනය</label>
                        <input
                            type="text"
                            pattern="[A-Za-z\s\.,\-]+"
                            title="Only letters, spaces, dots, commas, and dashes allowed"
                            value={data.address}
                            onChange={e => setData('address', e.target.value)}
                            required
                            maxLength={255}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {showError('address') && <div className="text-red-600 text-sm">{showError('address')}</div>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">දුරකථන අංකය</label>
                            <input
                                type="text"
                                pattern="\d{10}"
                                title="Please enter a 10-digit phone number"
                                value={data.tp1}
                                onChange={e => setData('tp1', e.target.value)}
                                maxLength={10}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {showError('tp1') && <div className="text-red-600 text-sm">{showError('tp1')}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">ෆැක්ස් අංකය</label>
                            <input
                                type="text"
                                pattern="\d{6,14}"
                                title="Fax number must be between 6 and 14 digits"
                                value={data.fax}
                                onChange={e => setData('fax', e.target.value)}
                                maxLength={14}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {showError('fax') && <div className="text-red-600 text-sm">{showError('fax')}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">ඊමේල් ලිපිනය</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                maxLength={60}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {showError('email') && <div className="text-red-600 text-sm">{showError('email')}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">හැඳුනුම්පත් අංකය</label>
                            <input
                                type="text"
                                pattern="\d{6,20}"
                                title="ID must be 6–20 digits"
                                value={data.idNo}
                                onChange={e => setData('idNo', e.target.value)}
                                maxLength={20}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {showError('idNo') && <div className="text-red-600 text-sm">{showError('idNo')}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Credit Limit</label>
                            <input
                                type="number"
                                value={data.crLmt}
                                onChange={e => setData('crLmt', e.target.value)}
                                min="0"
                                step="0.01"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {showError('crLmt') && <div className="text-red-600 text-sm">{showError('crLmt')}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">වැට් අංකය</label>
                            <input
                                type="text"
                                pattern="\d{6,50}"
                                title="VAT number must be 6–50 digits"
                                value={data.vatNo}
                                onChange={e => setData('vatNo', e.target.value)}
                                maxLength={50}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {showError('vatNo') && <div className="text-red-600 text-sm">{showError('vatNo')}</div>}
                        </div>

                        <div className="flex items-center mt-6">
                            <input
                                type="checkbox"
                                checked={data.fVATRegistered}
                                onChange={e => setData('fVATRegistered', e.target.checked)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">වැට් බදු ලියාපදිංචි</label>
                        </div>
                    </div>

                   <div className="flex space-x-4">
                    <div>
                        <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        disabled={processing}
                        >
                        {processing ? 'Processing...' : 'නව දත්ත'}
                        </button>
                    </div>

                    <div>
                        <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        disabled={processing}
                        >
                        {processing ? 'Processing...' : 'ගබඩා කිරීම'}
                        </button>
                    </div>

                    <div>
                        <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        disabled={processing}
                        >
                        {processing ? 'Processing...' : 'අවසන් කිරීම'}
                        </button>
                    </div>
                    </div>

                </form>
            </div>
        </Layout>
    );
};

export default CustomerForm;
