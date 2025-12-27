# Password Manager Web

A secure, web-based companion for the Android Password Manager application. This application allows you to view your encrypted vault data directly in the browser with a focus on security and privacy.

## 🔒 Security Architecture
- **Client-Side Decryption**: Your data is decrypted locally in your browser using the **Web Crypto API**. Plaintext credentials never touch a server.
- **AES-GCM Encryption**: Compatible with the Android app's export format, using AES-GCM encryption and PBKDF2 key derivation.
- **Zero-Persistence**: Decrypted data exists only in the volatile memory of the current page session. Reloading the page clears all data.

## ✨ Features

### 1. Encrypted Import
- Import `.enc` files exported from the Android Password Manager.
- Enter your encryption password to securely decrypt and load your vault.

### 2. Vault Security
- **Item Locking**: All items are "LOCKED" by default.
- **Auth-to-Reveal**: You must re-enter your master password to unlock and view the details of any secure item.
- **Auto-Re-Lock**: Simple manual controls to re-lock items after viewing.

### 3. Privacy & Visibility
- **Credential Masking**: Usernames and passwords are masked (`••••••`) even after unlocking an item.
- **Global Toggle**: A master switch in the toolbar to reveal or hide all credentials simultaneously.
- **Individual Toggles**: "Eye" icons for precise visibility control per field.

### 4. User Interface
- **View Modes**: Switch between a card-based **Grid View** and a compact **List View**.
- **Responsive Design**: Optimized for desktops, tablets, and mobile screens using Tailwind CSS.
- **Dark Mode**: Sleek dark interface for reduced eye strain and better readability.

## 🛠️ Tech Stack
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Cryptography**: Native [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/AndroPlus/password-manager-web.git
    cd password-manager-web
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  **Build for Production**
    ```bash
    npm run build
    ```

## ⚠️ Important Note
This is a viewer application. It currently supports **Read-Only** access to your exported vault. Editing or creating new credentials should be done via the primary Android application.
