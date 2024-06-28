"use client";

import { FormEvent, useState } from 'react';
import style from './settings.module.css';
import Select from 'react-select';
import { useMutation } from '@tanstack/react-query';
import { showErrorToast, showSuccessToast } from '@/utils/toast-helpers';
import { useRouter } from 'next/navigation';
import Spinner from '../Modals/Spinner';
import { CountryOption } from '@/types/select-options';
import { countryCodes, defaultMaxOrders, defaultPriceLimit } from '@/constants';
import { FaInfoCircle } from 'react-icons/fa';

const OrderSettings = ({ metadata }: { metadata?: Record<string, any> | null }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    priceLimit: metadata?.order_settings?.price_limit || defaultPriceLimit.toString(),
    maxOrders: metadata?.order_settings?.max_orders || defaultMaxOrders.toString(),
    allowedCountryCodes: metadata?.order_settings?.allowed_countries || countryCodes,
  });

  const handleChange = (option: readonly CountryOption[]) => {
    setFormData({ ...formData, allowedCountryCodes: option });
  };

  const updateSettings = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const { priceLimit, maxOrders, allowedCountryCodes } = formData;

    if (!priceLimit && !maxOrders && allowedCountryCodes.length === 0) {
      throw new Error('Please select at least one setting to update');
    }

    if (isNaN(parseFloat(priceLimit)) || isNaN(parseFloat(maxOrders))) {
      throw new Error('Please enter a valid number for price limit and maximum orders');
    }

    const response = await fetch('/api/update-settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.error);
    }
  };

  const { mutate: handleUpdateSettings, isPending: loading } = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      showSuccessToast('Order settings updated successfully');
    },
    onError: (error) => {
      showErrorToast(error?.message || 'An error occurred while updating the settings');
    },
    onSettled: () => {
      router.refresh();
    },
  });

  if (loading) {
    return (
      <Spinner />
    )
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleUpdateSettings();
  };

  return (
    <div className={style.Accountactivecontent}>
      <form onSubmit={handleSubmit}>
        <div className={style.InputsParent}>
          <div className={style.normalinput}>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priceLimit">
              Price Limit (SAR)
              <FaInfoCircle className="ml-1 text-blue-500 text-xs inline-block" title="How much should be the amount the customer pays in one order to trigger manual order processing?" />
            </label>
            <input type="number" id="priceLimit" value={formData.priceLimit} onChange={(e) => setFormData({ ...formData, priceLimit: e.target.value })} />
          </div>
          <div className={style.normalinput}>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxOrders">
              Maximum Orders in 24 Hours
              <FaInfoCircle className="ml-1 text-blue-500 text-xs inline-block" title="How many orders a customer can place in 24 hours before manual order processing is triggered?" />
            </label>
            <input type="number" id="maxOrders" value={formData.maxOrders} onChange={(e) => setFormData({ ...formData, maxOrders: e.target.value })} />
          </div>
          <div className={style.normalinput}>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="allowedCountryCodes">
              Allowed Country Codes
              <FaInfoCircle className="ml-1 text-blue-500 text-xs inline-block" title="Which countries' customers, based on their phone number country codes, are allowed to trigger automatic order processing?" />
            </label>
            <Select
              id="allowedCountryCodes"
              options={countryCodes}
              isMulti
              value={formData.allowedCountryCodes}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit" className={style.updatebutton}>Update</button>
      </form>
    </div>
  )
};

export default OrderSettings;