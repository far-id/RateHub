'use client';

import { useCallback, useState } from "react";

export type RatesMap = Record<string, number>;

export function useCurrencyValue(rates: RatesMap, initial?: Record<string, string>) {
  // initialize values as strings to bind directly to input.value
  const initialValues: Record<string, string> = {};

  for (const code of Object.keys(rates)) {
    initialValues[code] = initial?.[code] ?? "";
  }

  const [values, setValues] = useState<Record<string, string>>(initialValues);

  const updateCurrency = useCallback(
    (changedCode: string, newValueStr: string) => {
      // Convert input string to number (handle empty string)
      const newValueNum = newValueStr === "" ? 0 : Math.abs(Number(newValueStr));
      if (Number.isNaN(newValueNum)) {
        // ignore invalid input
        setValues((prev) => ({ ...prev, [changedCode]: newValueStr }));
        return;
      }

      // If rate missing, just update that input
      const changedRate = rates[changedCode];
      if (!changedRate) {
        setValues((prev) => ({ ...prev, [changedCode]: newValueStr }));
        return;
      }

      // compute base value (value in base currency of rates)
      // Assume rates map returns amount of target currency per 1 base (USD)
      // So to convert number (in changed currency) -> baseValue = newValue / rate_of_changed
      const baseValue = newValueNum / changedRate;

      // compute new values for all currencies (as string)
      const newValues: Record<string, string> = {};
      for (const [code, rate] of Object.entries(rates)) {
        // multiply baseValue by rate gives amount in that currency
        const computed = baseValue * rate;
        // keep reasonable precision, avoid long floats
        newValues[code] = computed % 1 === 0 ? String(computed) : String(Number(computed.toFixed(6)));
      }

      // If user cleared input (""), we want to reflect empty for changedCode but compute others as 0
      if (newValueStr === "") {
        for (const code of Object.keys(newValues)) newValues[code] = "";
      } else {
        // ensure changedCode shows exactly what user typed (not the rounded computed)
        newValues[changedCode] = newValueStr;
      }

      setValues(newValues);
    },
    [rates]
  );

  // helper to set values programmatically (e.g. add new currency)
  const setAll = useCallback((next: Record<string, string>) => {
    setValues(next);
  }, []);

  return { values, updateCurrency, setAll };
}
