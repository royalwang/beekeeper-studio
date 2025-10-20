import React from 'react';

interface CommonIamProps {
  authType: string;
  config: any;
  onConfigChange: (config: any) => void;
}

const CommonIam: React.FC<CommonIamProps> = ({ authType, config, onConfigChange }) => {
  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
    onConfigChange(newConfig);
  };

  const handleOptionsChange = (field: string, value: any) => {
    const newConfig = {
      ...config,
      options: {
        ...config.options,
        [field]: value
      }
    };
    onConfigChange(newConfig);
  };

  return (
    <div className="common-iam">
      <div className="form-group">
        <label htmlFor="iamRole">IAM Role</label>
        <input
          name="iamRole"
          type="text"
          className="form-control"
          value={config.options?.iamRole || ''}
          onChange={(e) => handleOptionsChange('iamRole', e.target.value)}
          placeholder="arn:aws:iam::account:role/role-name"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="region">AWS Region</label>
        <input
          name="region"
          type="text"
          className="form-control"
          value={config.options?.region || ''}
          onChange={(e) => handleOptionsChange('region', e.target.value)}
          placeholder="us-east-1"
        />
      </div>
      
      {authType === 'certificate' && (
        <>
          <div className="form-group">
            <label htmlFor="certificate">Certificate</label>
            <textarea
              name="certificate"
              className="form-control"
              rows={4}
              value={config.options?.certificate || ''}
              onChange={(e) => handleOptionsChange('certificate', e.target.value)}
              placeholder="-----BEGIN CERTIFICATE-----..."
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="privateKey">Private Key</label>
            <textarea
              name="privateKey"
              className="form-control"
              rows={4}
              value={config.options?.privateKey || ''}
              onChange={(e) => handleOptionsChange('privateKey', e.target.value)}
              placeholder="-----BEGIN PRIVATE KEY-----..."
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CommonIam;
