const generateAccountNumber = () => {
  const min = 1_000_000_000;
  const max = 9_999_999_999;
  const accountNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return accountNumber.toString();
};

export default generateAccountNumber;
