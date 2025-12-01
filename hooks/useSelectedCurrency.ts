import { metaCurrency } from '@/constants/currency';
import { useEffect, useState } from 'react';

type CurrencySelection = typeof metaCurrency[number]['regionCode'][];

const LOCAL_KEY = 'ratehub:selectedCurrencies:v1';

export function useSelectedCurrency(defaultSelectedCurrencies: CurrencySelection = ['IDR', 'JPY', 'USD']) {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencySelection>([]);

  function readStoredCurrencies(): CurrencySelection | null {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as CurrencySelection;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    // Load selected currencies from localStorage on mount
    const storedCurrencies = readStoredCurrencies();
    if (storedCurrencies) {
      setSelectedCurrency(storedCurrencies);
    } else {
      setSelectedCurrency(defaultSelectedCurrencies);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(defaultSelectedCurrencies));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  function addSelectedCurrency(newCurrency: string) {
    setSelectedCurrency((prev) => {
      if (prev.includes(newCurrency)) return prev;
      const updated = [...prev, newCurrency];
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  function removeSelectedCurrency(currencyToRemove: string) {
    if (!selectedCurrency.includes(currencyToRemove)) return;
    if (currencyToRemove === 'USD') return; // do not remove base currency
    setSelectedCurrency((prev) => {
      const updated = prev.filter((cur) => cur !== currencyToRemove);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  return { selectedCurrency, readStoredCurrencies, addSelectedCurrency, removeSelectedCurrency };
}
