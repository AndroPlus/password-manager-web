import { useState } from 'react';
import { VaultItem, type VisibilitySignal } from './components/VaultItem';
import { CryptoService } from './services/CryptoService';
import type { UserApplication } from './types';

function App() {
  const [data, setData] = useState<UserApplication[]>([]);
  const [cryptoToolOpen, setCryptoToolOpen] = useState(false);
  const [testPassword, setTestPassword] = useState('');
  const [testPlaintext, setTestPlaintext] = useState('');
  const [testCiphertext, setTestCiphertext] = useState('');
  const [decryptionResult, setDecryptionResult] = useState<string | null>(null);

  const [importPassword, setImportPassword] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [globalRevealSignal, setGlobalRevealSignal] = useState<VisibilitySignal | undefined>(undefined);
  // Track conceptual "are all shown" state for the button icon
  const [areAllShown, setAreAllShown] = useState(false);

  const toggleGlobalVisibility = () => {
    const newState = !areAllShown;
    setAreAllShown(newState);
    setGlobalRevealSignal({ show: newState, id: Date.now() });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!importPassword) {
      alert("Please enter the export password first.");
      event.target.value = ''; // Reset file input
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const encryptedContent = e.target?.result as string;
        const decryptedJson = await CryptoService.decrypt(encryptedContent, importPassword);

        if (!decryptedJson) {
          alert("Decryption failed. Please check your password.");
          return;
        }

        const json = JSON.parse(decryptedJson);
        // JSON structure matches UserApplication[] with fields being objects now
        setData(json);
      } catch (err) {
        console.error(err);
        alert("Failed to parse or decrypt file");
      }
    };
    reader.readAsText(file);
  };


  const runEncrypt = async () => {
    try {
      const cipher = await CryptoService.encrypt(testPlaintext, testPassword);
      setTestCiphertext(cipher);
    } catch (e) {
      alert("Encryption failed");
    }
  };

  const runDecrypt = async () => {
    const plain = await CryptoService.decrypt(testCiphertext, testPassword);
    setDecryptionResult(plain || "Decryption Failed (Wrong Password?)");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      <header className="max-w-4xl mx-auto mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Password Manager
          </h1>
          <p className="text-slate-400 mt-2">Secure. Local. Premium.</p>
        </div>
        <button
          onClick={() => setCryptoToolOpen(!cryptoToolOpen)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors border border-slate-700"
        >
          {cryptoToolOpen ? "Close Crypto Tool" : "Open Crypto Tool"}
        </button>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">

        {/* Crypto Tool Section */}
        {cryptoToolOpen && (
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-emerald-400">Crypto Verification Tool (AES-GCM)</h2>
            <div className="grid gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Password</label>
                <input
                  type="text"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Plaintext</label>
                  <textarea
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white h-24"
                    value={testPlaintext}
                    onChange={(e) => setTestPlaintext(e.target.value)}
                  />
                  <button onClick={runEncrypt} className="mt-2 bg-blue-600 hover:bg-blue-500 px-4 py-1 rounded text-sm w-full">Encrypt</button>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Ciphertext (Base64)</label>
                  <textarea
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white h-24 font-mono text-xs"
                    value={testCiphertext}
                    onChange={(e) => setTestCiphertext(e.target.value)}
                  />
                  <button onClick={runDecrypt} className="mt-2 bg-emerald-600 hover:bg-emerald-500 px-4 py-1 rounded text-sm w-full">Decrypt</button>
                </div>
              </div>

              {decryptionResult && (
                <div className="mt-4 p-4 bg-slate-900 rounded border border-slate-700">
                  <span className="text-slate-400 text-xs uppercase">Result: </span>
                  <span className="font-mono text-emerald-400">{decryptionResult}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* File Import */}
        {data.length === 0 && (
          <div className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-slate-500 transition-colors bg-slate-800/20">
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Import Data</h3>
            <p className="text-slate-400 mb-6">Upload your "my_data_encrypted.enc" from Android</p>

            <div className="max-w-xs mx-auto mb-6">
              <input
                type="password"
                placeholder="Enter Export Password"
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-center"
                value={importPassword}
                onChange={(e) => setImportPassword(e.target.value)}
              />
            </div>

            <input
              type="file"
              onChange={handleFileUpload}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer text-slate-300"
              accept=".enc,.json"
            />
          </div>
        )}

        {/* Data Display */}
        {data.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-2xl font-bold text-white">Your Vault ({data.length})</h3>

              <div className="flex gap-2">
                {/* Global Visibility Toggle */}
                <button
                  onClick={toggleGlobalVisibility}
                  className={`p-2 rounded-lg border border-slate-700 transition-colors ${areAllShown ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  title={areAllShown ? "Hide All Credentials" : "Show All Credentials"}
                >
                  {areAllShown ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>

                <div className="bg-slate-800 p-1 rounded-lg flex border border-slate-700">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-slate-700 text-emerald-400 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    title="Grid View"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-slate-700 text-emerald-400 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    title="List View"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className={viewMode === 'grid' ? "grid gap-6 md:grid-cols-2" : "flex flex-col gap-3"}>
              {data.map((app, idx) => (
                <VaultItem key={idx} app={app} viewMode={viewMode} globalSignal={globalRevealSignal} masterPassword={importPassword} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
