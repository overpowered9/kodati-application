export const isValidDecimal = (value: number) => {
  return value >= -99999999.99 && value <= 99999999.99;
}

export const extractCurrency = (totalString: string) => {
  const currencyRegex = /[A-Z]{3}(?=\s|$)/;
  const matches = totalString.match(currencyRegex);
  return matches ? matches[0] : null;
}