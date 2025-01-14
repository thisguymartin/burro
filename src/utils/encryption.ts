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

// Convert ArrayBuffer to Base64 string for storage
export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  const binString = String.fromCodePoint(...bytes);
  return btoa(binString);
};

// Convert Base64 string back to ArrayBuffer
export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binString = atob(base64);
  const bytes = Uint8Array.from(binString, (char) => char.codePointAt(0)!);
  return bytes.buffer;
};

// Export encryption key to raw format
export const exportEncryptionKey = async (
  key: CryptoKey,
): Promise<ArrayBuffer> => {
  return await crypto.subtle.exportKey("raw", key);
};

// Serialize encryption key and IV to Base64 for storage
export const serializeEncryptionData = async (
  key: CryptoKey,
  iv: Uint8Array,
): Promise<{ keyBase64: string; ivBase64: string }> => {
  // Export CryptoKey to raw format
  const rawKey = await exportEncryptionKey(key);

  // Convert both key and IV to Base64
  return {
    keyBase64: arrayBufferToBase64(rawKey),
    ivBase64: arrayBufferToBase64(iv.buffer),
  };
};

// Import encryption key from raw data
export const importEncryptionKey = async (
  rawKey: ArrayBuffer,
): Promise<CryptoKey> => {
  return await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
};

// Deserialize encryption key and IV from Base64 storage
export const deserializeEncryptionData = async (
  keyBase64: string,
  ivBase64: string,
): Promise<{ key: CryptoKey; iv: Uint8Array }> => {
  // Convert Base64 back to ArrayBuffer
  const rawKey = base64ToArrayBuffer(keyBase64);

  // Import key and convert IV
  const key = await importEncryptionKey(rawKey);
  const iv = new Uint8Array(base64ToArrayBuffer(ivBase64));

  return { key, iv };
};
