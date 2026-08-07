import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { INotebookTracker } from '@jupyterlab/notebook';
import { ToolbarButton } from '@jupyterlab/apputils';
import { DocumentRegistry } from '@jupyterlab/docregistry';

// REPLACE THIS with your actual Cloudflare Worker base URL (no trailing slash)
const WORKER_BASE_URL = 'https://jupyterlite-sync.raulcontreraso.workers.dev';

/**
 * A notebook widget extension that adds a button to the toolbar.
 */
export class GitHubSyncButtonExtension
  implements DocumentRegistry.IWidgetExtension<any, any>
{
  createNew(
    panel: any,
    context: DocumentRegistry.IContext<any>
  ): import('@lumino/disposable').IDisposable {
    // Create the toolbar button
    const button = new ToolbarButton({
      className: 'github-sync-button',
      label: 'Save to GitHub',
      onClick: async () => {
        // 1. Ensure the notebook is fully saved locally to the browser first
        await context.save();

        // 2. Extract the JSON object of the notebook to match the Worker's expectation
        const content = context.model.toJSON();
        const filename = context.path.split('/').pop() || 'untitled.ipynb';

        button.node.textContent = 'Syncing...';

        try {
          // 3. Send payload to the specific '/save-notebook' endpoint
          const response = await fetch(`${WORKER_BASE_URL}/save-notebook`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              filename: filename,
              content: content
            })
          });

          const result = await response.json();

          if (response.ok && result.success) {
            alert(`Successfully synced ${filename} to GitHub branch feature/github-sync!`);
            button.node.textContent = 'Save to GitHub';
          } else {
            throw new Error(result.error || 'Unknown error from worker');
          }
        } catch (error: any) {
          console.error('GitHub Sync Error:', error);
          alert(`Failed to sync: ${error.message}`);
          button.node.textContent = 'Save to GitHub';
        }
      },
      tooltip: 'Commit this notebook directly to your GitHub repository'
    });

    // Add the button to the notebook toolbar
    panel.toolbar.insertItem(10, 'githubSync', button);
    return button;
  }
}

/**
 * Initialization data for the jupyterlite-github-sync extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlite-github-sync:plugin',
  autoStart: true,
  requires: [INotebookTracker],
  activate: (app: JupyterFrontEnd, tracker: INotebookTracker) => {
    // Register the button extension to the notebook document registry
    app.docRegistry.addWidgetExtension('Notebook', new GitHubSyncButtonExtension());
  }
};

export default plugin;
