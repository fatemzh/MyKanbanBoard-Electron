// Ce script est exécuté dans le contexte de rendu avant le chargement de la page web
window.addEventListener('DOMContentLoaded', () => {
  // Fonction pour remplacer le texte d'un élément HTML par une valeur spécifique
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text; 
  };

  // Boucle sur les dépendances pour afficher leurs versions dans l'interface utilisateur
  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});
