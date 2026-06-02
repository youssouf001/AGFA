import type { AxiosError } from 'axios';

type DRFError = Record<string, string | string[]> | { detail: string };

export const parseDRFError = (error: unknown): string[] => {
  if (!error || typeof error !== 'object') return ['Une erreur est survenue.'];

  const axiosError = error as AxiosError<DRFError>;
  const data = axiosError.response?.data;

  if (!data) {
    if (axiosError.code === 'ERR_NETWORK') {
      return ['Impossible de joindre le serveur.'];
    }
    return ['Une erreur inattendue est survenue.'];
  }

  if ('detail' in data && typeof data.detail === 'string') {
    return [data.detail];
  }

  const messages: string[] = [];
  for (const [field, errors] of Object.entries(data)) {
    const msgs = Array.isArray(errors) ? errors : [errors];
    msgs.forEach((msg) => messages.push(`${field} : ${msg}`));
  }

  return messages.length > 0 ? messages : ['Une erreur est survenue.'];
};
