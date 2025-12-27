// Replicates Android's EncryptDecrypt.java logic
// Algo: AES/GCM/NoPadding
// Key Derivation: PBKDF2WithHmacSHA256, 65536 iterations, 256 key size

export class CryptoService {
    private static readonly SALT_LENGTH = 16;
    private static readonly IV_LENGTH = 12;
    // private static readonly TAG_LENGTH = 128; // bits
    private static readonly ITERATIONS = 65536;

    // Convert Base64 to Uint8Array
    private static base64ToArrayBuffer(base64: string): Uint8Array {
        const binary_string = window.atob(base64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes;
    }

    // Derive AES Key from Password and Salt
    private static async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
        const enc = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey(
            "raw",
            enc.encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveKey"]
        );

        return window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: salt as any,
                iterations: this.ITERATIONS,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt", "decrypt"]
        );
    }

    // Decrypt Function
    // Input: Base64 String (IV + Salt + Ciphertext)
    // Output: Decrypted String
    public static async decrypt(encryptedBase64: string, password: string): Promise<string | null> {
        try {
            const data = this.base64ToArrayBuffer(encryptedBase64);

            // Extract IV and Salt
            // Pattern: [IV (12)] [Salt (16)] [Ciphertext...]

            if (data.length < this.IV_LENGTH + this.SALT_LENGTH) {
                throw new Error("Invalid data length");
            }

            const iv = data.slice(0, this.IV_LENGTH);
            const salt = data.slice(this.IV_LENGTH, this.IV_LENGTH + this.SALT_LENGTH);
            const ciphertext = data.slice(this.IV_LENGTH + this.SALT_LENGTH);

            const key = await this.deriveKey(password, salt);

            const decryptedBuffer = await window.crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: iv
                },
                key,
                ciphertext
            );

            return new TextDecoder().decode(decryptedBuffer);
        } catch (e) {
            console.error("Decryption failed:", e);
            return null;
        }
    }

    // Encrypt Function (For verification)
    public static async encrypt(plaintext: string, password: string): Promise<string> {
        const salt = window.crypto.getRandomValues(new Uint8Array(this.SALT_LENGTH));
        const iv = window.crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));

        const key = await this.deriveKey(password, salt);

        const ciphertextBuffer = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            new TextEncoder().encode(plaintext)
        );

        // Concatenate IV + Salt + Ciphertext
        const combined = new Uint8Array(iv.length + salt.length + ciphertextBuffer.byteLength);
        combined.set(iv);
        combined.set(salt, iv.length);
        combined.set(new Uint8Array(ciphertextBuffer), iv.length + salt.length);

        // Convert to Base64
        let binary = '';
        const len = combined.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(combined[i]);
        }
        return window.btoa(binary);
    }
}
