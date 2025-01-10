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

export const generateInitalizeVector = () => {
  return crypto.getRandomValues(new Uint8Array(12));
};
