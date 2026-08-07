import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import {
  INotebookTracker,
  NotebookPanel
} from '@jupyterlab/notebook';
import { ToolbarButton } from '@jupyterlab/apputils';
import { DisposableDelegate, IDisposable } from '@lumino/disposable';

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlite-github-sync:plugin',
  autoStart: true,
  requires: [INotebookTracker],
  activate: (app: JupyterFrontEnd, tracker: INotebookTracker) => {
    const workerEndpoint = 'https://jupyterlite-sync.raulcontreraso.workers.dev/save-notebook';

    const createSaveButton = (panel: NotebookPanel): IDisposable => {
      const button = new ToolbarButton({
        className: 'github-sync-button',
        label: 'Save to GitHub',
        tooltip: 'Save current notebook to GitHub repository',
        onClick: async () => {
          const current = tracker.currentWidget;
          if (!current) {
            alert('No active notebook found.');
            return;
          }

          const context = current.context;
          const pathParts = context.path.split('/');
          const filename = pathParts[pathParts.length - 1];
          const content = context.model.toJSON();

          try {
            const response = await fetch(workerEndpoint, {
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
              alert(`Successfully saved ${filename} to GitHub! Commit: ${result.commit}`);
            } else {
              alert(`Failed to save notebook: ${result.error || 'Unknown error'}`);
            }
          } catch (err: any) {
            alert(`Error connecting to sync worker: ${err.message}`);
          }
        }
      });

      panel.toolbar.insertItem(10, 'githubSync', button);

      return new DisposableDelegate(() => {
        button.dispose();
      });
    };

    tracker.widgetAdded.connect((sender, panel) => {
      createSaveButton(panel);
    });
  }
};

export default plugin;
