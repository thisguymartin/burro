export const encrypt = async (rawText: string, secret: string) => {
    const key = await crypto.subtle.importKey(
      "raw", 
      new TextEncoder().encode(secret),
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );
    
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM" },
      key,
      new TextEncoder().encode(rawText)
    );
   
    return {
      encrypted: Array.from(new Uint8Array(encrypted)),
    };
   };
   
   export const decrypt = async (encrypted: number[], secret: string) => {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "AES-GCM" },
      false, 
      ["encrypt", "decrypt"]
    );
   
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM" },
      key,
      new Uint8Array(encrypted)
    );
   
    return new TextDecoder().decode(decrypted);
   };