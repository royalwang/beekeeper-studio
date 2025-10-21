import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { AppEvent } from '../../common/AppEvent';
import { PluginNotificationData } from '@beekeeperstudio/plugin';

// Mock plugin system - in a real implementation, this would be injected via context or props
interface PluginSystem {
  pluginStore: {
    getTheme(): any;
  };
  notifyAll(data: PluginNotificationData): void;
}

// This would typically be provided via a context or dependency injection
const usePluginSystem = (): PluginSystem | null => {
  // In a real implementation, this would come from a plugin context provider
  // For now, we'll return null and handle the case where plugin system is not available
  return null;
};

const PluginController: React.FC = (): React.ReactElement | null => {
  const pluginSystem = usePluginSystem();
  
  // Get theme value from Redux store
  const themeValue = useSelector((state: any) => state.settings?.themeValue);

  const handleChangedTheme = useCallback((newThemeValue: string) => {
    if (!pluginSystem) {
      console.warn('Plugin system not available');
      return;
    }

    const data: PluginNotificationData = {
      name: "themeChanged",
      args: pluginSystem.pluginStore.getTheme(),
    };
    pluginSystem.notifyAll(data);
    console.log('Theme changed to:', newThemeValue);
  }, [pluginSystem]);

  useEffect(() => {
    // Register event listener for theme changes
    const handleThemeChange = (event: CustomEvent) => {
      handleChangedTheme(event.detail);
    };

    // Listen for theme change events
    window.addEventListener(AppEvent.changedTheme, handleThemeChange as EventListener);

    return () => {
      window.removeEventListener(AppEvent.changedTheme, handleThemeChange as EventListener);
    };
  }, [handleChangedTheme]);

  // Trigger theme change when themeValue changes
  useEffect(() => {
    if (themeValue) {
      handleChangedTheme(themeValue);
    }
  }, [themeValue, handleChangedTheme]);

  // This component doesn't render anything, it just handles plugin events
  return null;
};

export default PluginController;
