import React, { createContext, useContext, useEffect, useState } from 'react';
import { CompanySettings } from '../types';
import { fetchCompanySettings, saveCompanySettings } from '../lib/api';
import { INITIAL_COMPANY_SETTINGS } from '../lib/initialData';

interface SettingsContextType {
  settings: CompanySettings;
  loading: boolean;
  updateSettings: (newSettings: CompanySettings) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: INITIAL_COMPANY_SETTINGS,
  loading: true,
  updateSettings: async () => false,
  refreshSettings: async () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CompanySettings>(INITIAL_COMPANY_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);

  const load = async () => {
    try {
      const data = await fetchCompanySettings();
      setSettings(data);
    } catch (err) {
      console.warn('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateSettings = async (newSettings: CompanySettings): Promise<boolean> => {
    setSettings(newSettings);
    const res = await saveCompanySettings(newSettings);
    return res.success;
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings, refreshSettings: load }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

