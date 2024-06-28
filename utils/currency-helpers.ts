export const convertToSAR = async (amount: number, sourceCurrency: string): Promise<number | null> => {
  const CC = require('currency-converter-lt');
  let currencyConverter = new CC({ from: sourceCurrency, to: "SAR", amount });
  return await currencyConverter.convert();
};