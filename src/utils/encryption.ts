export const encrypt = async (
  rawText: string,
  encryptionKey: CryptoKey,
  secret: Uint8Array,
): Promise<Uint8Array> => {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(rawText);

  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: secret, // Initialization vector must be unique for each encryption
    },
    encryptionKey, // The generated key
    encodedData, // The text data to encrypt
  );

  const uniArray = new Uint8Array(encryptedData);
  return uniArray;
};

export const decrypt = async (
  encryptedData: ArrayBuffer,
  encryptionKey: CryptoKey,
  secret: Uint8Array,
) => {
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: secret, // Same IV used for encryption
    },
    encryptionKey, // The same key used for encryption
    encryptedData, // The encrypted data to decrypt
  );

  const decryptedText = new TextDecoder().decode(decryptedData);
  console.log("Decrypted Text:", decryptedText);

  return decryptedText;
};

export const generateEncryptionKey = async () => {
  return await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256, // 256-bit encryption key for strong security
    },
    true, // The key is extractable for encryption and decryption
    ["encrypt", "decrypt"], // Key usages: encryption and decryption
  );
};

export const exportRawKey = async (key: CryptoKey) => {
  const exportedKey = await crypto.subtle.exportKey("raw", key);
  return exportedKey;
};

export const generateInitalizeVector = () => {
  return crypto.getRandomValues(new Uint8Array(12));
};

export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const uint8Array = new Uint8Array(buffer);
  let binary = "";
  uint8Array.forEach((byte) => binary += String.fromCharCode(byte));
  return btoa(binary);
};

export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};
