import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface LoadViewParams {
  [key: string]: any;
}

interface IsolatedPluginViewProps {
  visible?: boolean;
  pluginId: string;
  command?: string;
  params?: LoadViewParams;
  url: string;
  onRequest?: (request: any) => void;
  reload?: any;
}

const IsolatedPluginView: React.FC<IsolatedPluginViewProps> = ({
  visible = true,
  pluginId,
  command,
  params,
  url,
  onRequest,
  reload,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const unsubscribeOnReadyRef = useRef<(() => void) | null>(null);
  const unsubscribeOnDisposeRef = useRef<(() => void) | null>(null);

  const disabledPlugins = useSelector((state: RootState) => state.settings.disabledPlugins || {});
  const isPluginDisabled = disabledPlugins[pluginId]?.disabled || false;

  const baseUrl = `${url}?timestamp=${timestamp}`;

  useEffect(() => {
    if (visible && !mounted) {
      setMounted(true);
    } else if (!visible && mounted) {
      setMounted(false);
    }
  }, [visible, mounted]);

  useEffect(() => {
    if (reload) {
      setTimestamp(Date.now());
    }
  }, [reload]);

  useEffect(() => {
    // Handle iframe communication
    const handleMessage = (event: MessageEvent) => {
      if (event.source === iframe?.contentWindow) {
        if (onRequest) {
          onRequest(event.data);
        }
      }
    };

    if (iframe) {
      window.addEventListener('message', handleMessage);
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [iframe, onRequest]);

  const handleIframeLoad = () => {
    setLoaded(true);
    
    // Send initial data to iframe
    if (iframe?.contentWindow) {
      const message = {
        type: 'init',
        pluginId,
        command,
        params,
        theme: 'light', // Get from theme state
      };
      
      iframe.contentWindow.postMessage(message, '*');
    }
  };

  const handleIframeRef = (element: HTMLIFrameElement | null) => {
    setIframe(element);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="isolated-plugin-view" ref={containerRef}>
      {isPluginDisabled && (
        <div className="alert">
          <i className="material-icons-outlined">info</i>
          <div>This plugin ({pluginId}) has been disabled via configuration</div>
        </div>
      )}
      
      {!isPluginDisabled && mounted && (
        <div className="plugin-iframe-container">
          <iframe
            ref={handleIframeRef}
            src={baseUrl}
            className="plugin-iframe"
            onLoad={handleIframeLoad}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: loaded ? 'block' : 'none',
            }}
            title={`Plugin: ${pluginId}`}
          />
          
          {!loaded && (
            <div className="plugin-loading">
              <div className="loading-spinner">
                <i className="material-icons spinning">hourglass_empty</i>
              </div>
              <p>Loading plugin...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IsolatedPluginView;
