const generateRandomKey = () => {
  return Math.random().toString(36).substring(2, 9);
};

export default generateRandomKey;
