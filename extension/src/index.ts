import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { INotebookTracker, NotebookPanel, INotebookModel } from '@jupyterlab/notebook';
import { ToolbarButton } from '@jupyterlab/apputils';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { IDisposable, DisposableDelegate } from '@lumino/disposable';

// REPLACE THIS with your actual Cloudflare Worker base URL (no trailing slash)
const WORKER_BASE_URL = 'https://jupyterlite-sync.raulcontreraso.workers.dev/';

export class GitHubSyncButtonExtension
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>
{
  createNew(
    panel: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable {
    const button = new ToolbarButton({
      className: 'github-sync-button',
      label: 'Save to GitHub',
      onClick: async () => {
        await context.save();

        const content = context.model.toJSON();
        const filename = context.path.split('/').pop() || 'untitled.ipynb';

        button.node.textContent = 'Syncing...';

        try {
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

    panel.toolbar.insertItem(10, 'githubSync', button);
    
    return new DisposableDelegate(() => {
      button.dispose();
    });
  }
}

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlite-github-sync:plugin',
  autoStart: true,
  requires: [INotebookTracker],
  activate: (app: JupyterFrontEnd, tracker: INotebookTracker) => {
    app.docRegistry.addWidgetExtension('Notebook', new GitHubSyncButtonExtension());
  }
};

export default plugin;
