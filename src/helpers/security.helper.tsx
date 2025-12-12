export const base64EncodeString = (value: string) => {
  // Use browser-native btoa() for base64 encoding
  return btoa(value);
};