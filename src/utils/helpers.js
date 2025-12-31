// Combine les classes CSS
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Formate les prix
export const formatPrice = (price, currency = 'USD') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price);
};

// Formate les dates
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return new Date(date).toLocaleDateString(
    'fr-FR',
    { ...defaultOptions, ...options }
  );
};

// Tronque le texte
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Calcule la commission
export const calculateCommission = (amount, rate) => {
  return (amount * rate) / 100;
};

// Génère un slug
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

// Vérifie le type de fichier
export const isValidFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

// Télécharge un fichier
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Gestion des erreurs API
export const handleApiError = (error) => {
  if (error.response) {
    // Erreur serveur
    const message = error.response.data?.message || 'Erreur serveur';
    const status = error.response.status;
    
    switch (status) {
      case 401:
        return 'Non autorisé. Veuillez vous reconnecter.';
      case 403:
        return 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
      case 404:
        return 'Ressource non trouvée.';
      case 422:
        return 'Données invalides. Veuillez vérifier les informations saisies.';
      case 500:
        return 'Erreur serveur. Veuillez réessayer plus tard.';
      default:
        return message;
    }
  } else if (error.request) {
    // Pas de réponse
    return 'Pas de réponse du serveur. Vérifiez votre connexion.';
  } else {
    // Erreur de configuration
    return 'Erreur de configuration.';
  }
};

// Débounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};