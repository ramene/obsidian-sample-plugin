import React from 'react';
import { App, WorkspaceLeaf } from 'obsidian';

interface ToolbarProps {
  app: App;
}

export const Toolbar: React.FC<ToolbarProps> = ({ app }) => {
  const openRightSidebarWebview = () => {
    const existingLeaf = app.workspace.getLeavesOfType('sidebar-webview')[0];
    if (existingLeaf) {
      app.workspace.revealLeaf(existingLeaf);
    } else {
      const leaf = app.workspace.getRightLeaf(false);
      if (leaf) {
        leaf.setViewState({ type: 'sidebar-webview' });
        app.workspace.revealLeaf(leaf);
      }
    }
  };

  return (
    <div className="custom-toolbar">
      <button onClick={openRightSidebarWebview}>Request Invite</button>
    </div>
  );
};