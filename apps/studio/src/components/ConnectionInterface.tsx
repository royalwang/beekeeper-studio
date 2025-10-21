import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ConnectionSidebar from './sidebar/ConnectionSidebar';
import PostgresForm from './connection/PostgresForm';
import MysqlForm from './connection/MysqlForm';
import SqliteForm from './connection/SqliteForm';
import MongoDBForm from './connection/MongoDBForm';
import OracleForm from './connection/OracleForm';
import SqlServerForm from './connection/SqlServerForm';
import BigQueryForm from './connection/BigQueryForm';
import RedisForm from './connection/RedisForm';
import ClickHouseForm from './connection/ClickHouseForm';
import FirebirdForm from './connection/FirebirdForm';
import LibSQLForm from './connection/LibSQLForm';
import TrinoForm from './connection/TrinoForm';
import SurrealDBForm from './connection/SurrealDBForm';
import RedshiftForm from './connection/RedshiftForm';
import SqlAnywhereForm from './connection/SqlAnywhereForm';
import ImportButton from './connection/ImportButton';
import ErrorAlert from './common/ErrorAlert';
import ContentPlaceholderHeading from './common/loading/ContentPlaceholderHeading';
import UpsellContent from './upsell/UpsellContent';

const ConnectionInterface: React.FC = () => {
  const [config, setConfig] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);
  const [sidebarShown, setSidebarShown] = useState(true);
  const [pageTitle, setPageTitle] = useState<string | null>(null);

  const dispatch = useDispatch();
  const isConfigReady = useSelector((state: any) => state.connection?.isConfigReady);
  const isCommunity = useSelector((state: any) => state.settings?.isCommunity);

  const communityConnectionTypes = [
    { value: 'mysql', name: 'MySQL' },
    { value: 'postgresql', name: 'PostgreSQL' },
    { value: 'sqlite', name: 'SQLite' },
    { value: 'mariadb', name: 'MariaDB' },
  ];

  const ultimateConnectionTypes = [
    { value: 'mongodb', name: 'MongoDB' },
    { value: 'oracle', name: 'Oracle' },
    { value: 'sqlserver', name: 'SQL Server' },
    { value: 'bigquery', name: 'BigQuery' },
    { value: 'redis', name: 'Redis' },
    { value: 'clickhouse', name: 'ClickHouse' },
    { value: 'firebird', name: 'Firebird' },
    { value: 'libsql', name: 'LibSQL' },
    { value: 'trino', name: 'Trino' },
    { value: 'surrealdb', name: 'SurrealDB' },
    { value: 'redshift', name: 'Redshift' },
    { value: 'sqlanywhere', name: 'SQL Anywhere' },
  ];

  const shouldUpsell = useCallback(() => {
    if (!config?.connectionType) return false;
    return ultimateConnectionTypes.some(t => t.value === config.connectionType) && isCommunity;
  }, [config?.connectionType, isCommunity]);

  const determineLabelColor = useCallback(() => {
    if (!config?.connectionType) return '';
    if (shouldUpsell()) return 'upsell';
    return '';
  }, [config?.connectionType, shouldUpsell]);

  const handleConnect = useCallback(async (connectionConfig: any) => {
    setTesting(true);
    setErrors([]);

    try {
      // Mock connection test
      console.log('Testing connection:', connectionConfig);
      
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful connection
      dispatch({ type: 'connection/connect', payload: connectionConfig });
    } catch (error) {
      setErrors(['Connection failed: ' + error]);
    } finally {
      setTesting(false);
    }
  }, [dispatch]);

  const handleCreate = useCallback(() => {
    setConfig({
      connectionType: null,
      name: '',
      host: '',
      port: '',
      user: '',
      password: '',
      database: '',
    });
    setPageTitle('New Connection');
  }, []);

  const handleEdit = useCallback((connectionId: string) => {
    // Mock edit connection
    console.log('Editing connection:', connectionId);
    setPageTitle('Edit Connection');
  }, []);

  const handleRemove = useCallback((connectionId: string) => {
    // Mock remove connection
    console.log('Removing connection:', connectionId);
  }, []);

  const handleDuplicate = useCallback((connectionId: string) => {
    // Mock duplicate connection
    console.log('Duplicating connection:', connectionId);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (config) {
      await handleConnect(config);
    }
  }, [config, handleConnect]);

  const handleConnectionTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setConfig(prev => ({
      ...prev,
      connectionType: e.target.value,
    }));
  }, []);

  const renderConnectionForm = () => {
    if (!config?.connectionType) return null;

    const formProps = {
      config,
      testing,
      onChange: setConfig,
    };

    switch (config.connectionType) {
      case 'postgresql':
      case 'cockroachdb':
        return <PostgresForm {...formProps} />;
      case 'mysql':
      case 'mariadb':
      case 'tidb':
        return <MysqlForm {...formProps} />;
      case 'sqlite':
        return <SqliteForm {...formProps} />;
      case 'mongodb':
        return <MongoDBForm {...formProps} />;
      case 'oracle':
        return <OracleForm {...formProps} />;
      case 'sqlserver':
        return <SqlServerForm {...formProps} />;
      case 'bigquery':
        return <BigQueryForm {...formProps} />;
      case 'redis':
        return <RedisForm {...formProps} />;
      case 'clickhouse':
        return <ClickHouseForm {...formProps} />;
      case 'firebird':
        return <FirebirdForm {...formProps} />;
      case 'libsql':
        return <LibSQLForm {...formProps} />;
      case 'trino':
        return <TrinoForm {...formProps} />;
      case 'surrealdb':
        return <SurrealDBForm {...formProps} />;
      case 'redshift':
        return <RedshiftForm {...formProps} />;
      case 'sqlanywhere':
        return <SqlAnywhereForm {...formProps} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    handleCreate();
  }, [handleCreate]);

  return (
    <div className="interface connection-interface">
      <div className="interface-wrap row">
        {sidebarShown && (
          <div className="connection-sidebar">
            <ConnectionSidebar
              selectedConfig={config}
              onRemove={handleRemove}
              onDuplicate={handleDuplicate}
              onEdit={handleEdit}
              onConnect={handleConnect}
              onCreate={handleCreate}
            />
          </div>
        )}
        
        <div className="connection-main page-content flex-col">
          <div className="small-wrap expand">
            {!isConfigReady ? (
              <div className="card-flat padding">
                <ContentPlaceholderHeading />
              </div>
            ) : (
              <div className={`card-flat padding ${determineLabelColor()}`}>
                <div className="flex flex-between">
                  <h3 className="card-title">
                    {pageTitle || 'New Connection'}
                  </h3>
                  <ImportButton config={config}>
                    Import from URL
                  </ImportButton>
                </div>
                
                {errors.length > 0 && (
                  <ErrorAlert error={errors.join(', ')} title="Please fix the following errors" />
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="connection-select">Connection Type</label>
                    <select
                      name="connectionType"
                      className="form-control custom-select"
                      value={config?.connectionType || ''}
                      onChange={handleConnectionTypeChange}
                      id="connection-select"
                    >
                      <option disabled hidden value="">
                        Select a connection type...
                      </option>
                      {communityConnectionTypes.map(t => (
                        <option key={`${t.value}-${t.name}`} value={t.value}>
                          {t.name}
                        </option>
                      ))}
                      {ultimateConnectionTypes.map(t => (
                        <option key={`${t.value}-${t.name}`} value={t.value}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {config?.connectionType && (
                    <>
                      {shouldUpsell() && <UpsellContent />}
                      {!shouldUpsell() && renderConnectionForm()}
                    </>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionInterface;
