import React, { createContext, useState, useContext } from 'react';

// إنشاء سياق التحميل
const LoadingContext = createContext({
  isGlobalLoading: false,
  setGlobalLoading: () => {},
});

// مزود سياق التحميل
export const LoadingProvider = ({ children }) => {
  const [isGlobalLoading, setGlobalLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isGlobalLoading, setGlobalLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// خطاف مخصص لاستخدام سياق التحميل
export const useLoading = () => useContext(LoadingContext); 