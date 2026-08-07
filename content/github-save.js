
window.saveNotebookToGithub = async function(filename, notebook) {

  const result = await fetch(
    "https://jupyterlite-sync.raulcontreraso.workers.dev/save-notebook",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filename: filename,
        content: notebook
      })
    }
  );

  return await result.json();
};
