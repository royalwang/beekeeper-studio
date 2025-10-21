import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

const NotificationManager: React.FC = () => {
  const [notificationInterval, setNotificationInterval] = useState<NodeJS.Timeout | null>(null);
  const [timeoutID, setTimeoutID] = useState<NodeJS.Timeout | null>(null);

  const isCommunity = useSelector((state: any) => state.settings?.isCommunity);

  const upsellNotificationOptions = {
    text: "👋 Beekeeper Studio is run by a small team. Buy the full version of Beekeeper Studio to support development and get more features. Thank you ♥",
    timeout: 1000 * 60 * 5,
    queue: "upsell",
    killer: 'upsell',
    layout: 'bottomRight',
    closeWith: ['button'],
    buttons: [
      { text: 'Close', className: 'btn btn-flat', onClick: () => console.log('Close notification') },
      { text: 'Get Started', className: 'btn btn-primary', onClick: () => window.open('https://docs.beekeeperstudio.io/docs/upgrading-from-the-community-edition', '_blank') }
    ]
  };

  const initNotifyInterval = useCallback(() => {
    const intervalTime = 1000 * 60 * 60 * 3; // 3 hours
    
    if (notificationInterval) {
      clearInterval(notificationInterval);
      setNotificationInterval(null);
    }
    
    if (timeoutID) {
      clearTimeout(timeoutID);
      setTimeoutID(null);
    }
    
    if (!isCommunity) {
      return;
    }

    const showUpsellNotification = () => {
      // Mock notification display
      console.log('Showing upsell notification:', upsellNotificationOptions.text);
    };

    const interval = setInterval(() => {
      showUpsellNotification();
    }, intervalTime);

    setNotificationInterval(interval);

    // Show initial notification after 5 minutes
    const timeout = setTimeout(() => {
      showUpsellNotification();
    }, 1000 * 60 * 5);

    setTimeoutID(timeout);
  }, [isCommunity, notificationInterval, timeoutID]);

  useEffect(() => {
    initNotifyInterval();
  }, [initNotifyInterval]);

  useEffect(() => {
    return () => {
      if (notificationInterval) {
        clearInterval(notificationInterval);
      }
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
    };
  }, [notificationInterval, timeoutID]);

  // This component doesn't render anything visible
  return null;
};

export default NotificationManager;
