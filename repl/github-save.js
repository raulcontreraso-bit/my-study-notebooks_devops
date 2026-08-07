async function saveNotebookToGithub(filename, notebook) {

  const response = await fetch(
    "https://jupyterlite-sync.raulcontreraso.workers.dev/save-notebook",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filename,
        content: notebook
      })
    }
  );

  return await response.json();
}

window.saveNotebookToGithub = saveNotebookToGithub;
