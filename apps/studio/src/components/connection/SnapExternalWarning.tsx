import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import ExternalLink from '../common/ExternalLink';

interface SnapExternalWarningProps {
  className?: string;
}

const SnapExternalWarning: React.FC<SnapExternalWarningProps> = ({
  className = '',
}) => {
  const isSnap = useSelector((state: RootState) => state.settings.isSnap || false);

  if (!isSnap) {
    return null;
  }

  return (
    <div className={`alert alert-warning ${className}`}>
      <i className="material-icons">error_outline</i>
      <div>
        Hey snap user! If you want to use a sqlite database on an external drive
        you'll need to give Beekeeper some extra permissions{' '}
        <ExternalLink
          href="https://docs.beekeeperstudio.io/support/troubleshooting/#i-get-permission-denied-when-trying-to-access-a-database-on-an-external-drive"
        >
          Read more
        </ExternalLink>
      </div>
    </div>
  );
};

export default SnapExternalWarning;
