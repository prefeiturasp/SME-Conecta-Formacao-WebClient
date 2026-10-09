import { DefaultOptionType } from 'antd/es/select';

/**
 * Função de filtragem para componentes Select do Ant Design.
 * Permite busca case-insensitive (maiúsculas e minúsculas) e
 * ignora acentos (diacríticos) para uma experiência de busca amigável.
 */
export const filterOptionInsensitive = (
  input: string,
  option?: DefaultOptionType | { label?: unknown; value?: unknown }
): boolean => {
  if (!input) return true;

  const normalizeText = (text: unknown): string => {
    if (typeof text !== 'string' && typeof text !== 'number') {
      return '';
    }

    return String(text)
      .toLowerCase()
      .normalize('NFD')
      .replaceAll(/[\u0300-\u036f]/g, '');
  };

  const search = normalizeText(input);
  const label = normalizeText(option?.label);
  const value = normalizeText(option?.value);

  return label.includes(search) || value.includes(search);
};

