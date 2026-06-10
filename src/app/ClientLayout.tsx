'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Provider, useDispatch } from "react-redux";
import { store } from "../utils/store";
import { setCurrency, CURRENCY_STORAGE_KEY } from "../features/currency/currencySlice";

interface ClientLayoutProps {
  children: ReactNode;
}

function CurrencyHydrator() {
  const dispatch = useDispatch();
  useEffect(() => {
    const saved = localStorage.getItem(CURRENCY_STORAGE_KEY) || "XOF";
    dispatch(setCurrency(saved));
  }, [dispatch]);
  return null;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <Provider store={store}>
      <CurrencyHydrator />
      {children}
    </Provider>
  );
}