export const maskPhone = (value: string | undefined) => {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4,5})(\d{4})/, '$1-$2')
    .slice(0, 15);
};

export const maskCpfCnpj = (value: string | undefined) => {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    return digits
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
      .slice(0, 18);
  }
};

export const maskCurrency = (value: string | number | undefined) => {
  if (value === undefined || value === null) return '';
  const digits = typeof value === 'string' ? value.replace(/\D/g, '') : Math.round(value * 100).toString();
  const numberValue = Number(digits) / 100;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numberValue);
};

export const parseCurrency = (value: string | number) => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const digits = value.replace(/\D/g, '');
  return Number(digits) / 100;
};
