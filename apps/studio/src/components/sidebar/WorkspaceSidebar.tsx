import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import WorkspaceAvatar from '../common/WorkspaceAvatar';
import AccountStatusButton from './connection/AccountStatusButton';
import NewWorkspaceButton from './connection/NewWorkspaceButton';
import ContentPlaceholder from '../common/loading/ContentPlaceholder';
import ContentPlaceholderImg from '../common/loading/ContentPlaceholderImg';

interface Workspace {
  id: number | string;
  name: string;
  level?: string;
  url?: string;
  isOwner?: boolean;
  trialEndsIn?: string;
}

interface WorkspaceBlob {
  workspace: Workspace;
  client: any;
}

interface WorkspaceSidebarProps {
  activeItem?: any;
  onManageWorkspace?: (blob: WorkspaceBlob) => void;
  onRenameWorkspace?: (blob: WorkspaceBlob) => void;
  onInviteUsers?: (blob: WorkspaceBlob) => void;
  onRefresh?: () => void;
}

const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({
  activeItem,
  onManageWorkspace,
  onRenameWorkspace,
  onInviteUsers,
  onRefresh,
}) => {
  const dispatch = useDispatch();
  const { credentials, loading } = useSelector((state: RootState) => state.credentials || { credentials: [], loading: false });
  const workspaceId = useSelector((state: RootState) => state.workspace?.workspaceId);
  const settings = useSelector((state: RootState) => state.settings?.settings || {});
  const availableWorkspaces: WorkspaceBlob[] = useSelector((state: RootState) => state.credentials?.workspaces || []);
  const isCommunity = useSelector((state: RootState) => state.app?.isCommunity);

  useEffect(() => {
    // dispatch credentials load on mount
    // @ts-ignore placeholder action
    dispatch({ type: 'credentials/load' });
  }, [dispatch]);

  const workspaceTitle = (workspace: Workspace) => {
    const bits = [workspace.name, workspace.level ? `(${workspace.level})` : undefined];
    if (workspace.trialEndsIn) bits.push(`[trial ends ${workspace.trialEndsIn}]`);
    return bits.filter(Boolean).join(' ');
  };

  const refresh = () => {
    if (isCommunity) {
      // @ts-ignore placeholder modal
      dispatch({ type: 'ui/upgradeModal' });
      return;
    }
    // @ts-ignore placeholder action
    dispatch({ type: 'credentials/load' });
    onRefresh?.();
  };

  const click = (blob: WorkspaceBlob) => {
    if (isCommunity) {
      // @ts-ignore placeholder modal
      dispatch({ type: 'ui/upgradeModal' });
      return;
    }
    // @ts-ignore placeholder mutation
    dispatch({ type: 'workspace/setId', payload: blob.workspace.id });
    const defaultWorkspace = {
      ...(settings['lastUsedWorkspace'] || {}),
      _userValue: String(blob.workspace.id),
    };
    // @ts-ignore placeholder save
    dispatch({ type: 'settings/saveSetting', payload: defaultWorkspace });
  };

  const contextOptionsFor = (blob: WorkspaceBlob) => {
    const result: Array<{ name: string; slug: string; handler: () => void }> = [
      {
        name: 'Manage Workspace',
        slug: 'manage',
        handler: () => onManageWorkspace?.(blob),
      },
    ];
    if (blob.workspace.isOwner) {
      result.push(
        {
          name: 'Rename Workspace',
          slug: 'rename',
          handler: () => onRenameWorkspace?.(blob),
        },
        {
          name: 'Add Users',
          slug: 'invite',
          handler: () => onInviteUsers?.(blob),
        }
      );
    }
    return result;
  };

  return (
    <div className="workspace-items global-items">
      {!loading && (
        <div>
          {availableWorkspaces.map((blob) => (
            <a
              key={blob.workspace.id}
              className={`workspace-item nav-item selectable ${blob.workspace.id === workspaceId ? 'active' : ''}`}
              title={workspaceTitle(blob.workspace)}
              onClick={(e) => {
                e.preventDefault();
                click(blob);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                // @ts-ignore placeholder context menu event
                dispatch({ type: 'ui/openMenu', payload: { item: blob, options: contextOptionsFor(blob), event: e } });
              }}
              href="#"
            >
              <span className="avatar">
                <WorkspaceAvatar workspace={blob.workspace as any} />
              </span>
            </a>
          ))}
          <NewWorkspaceButton />
        </div>
      )}

      {loading && (
        <div className="global-loading">
          <ContentPlaceholder rounded>
            {[1, 2, 3].map((x) => (
              <ContentPlaceholderImg key={x} circle extra-styles="margin: 5px 0 10px;" />
            ))}
          </ContentPlaceholder>
        </div>
      )}

      <span className="expand" />

      <a
        onClick={(e) => {
          e.preventDefault();
          refresh();
        }}
        className="nav-item refresh"
        title="Refresh Workspaces"
        href="#"
      >
        <span className="avatar">
          <i className="material-icons">refresh</i>
        </span>
      </a>

      <AccountStatusButton />
    </div>
  );
};

export default WorkspaceSidebar;
