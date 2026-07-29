// Placeholder popup script.
// Add UI interactions here when the extension logic is implemented.

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('inspectButton');

  if (button) {
    button.addEventListener('click', () => {
      console.log('Inspect button clicked.');
    });
  }
});
