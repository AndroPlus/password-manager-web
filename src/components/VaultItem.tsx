
import { useState, useEffect } from 'react';
import type { AppField, UserApplication } from '../types';

export interface VisibilitySignal {
    show: boolean;
    id: number;
}

interface VaultItemProps {
    app: UserApplication;
    viewMode: 'grid' | 'list';
    globalSignal?: VisibilitySignal;
    masterPassword?: string;
}

const FieldRow = ({ field, globalSignal }: { field: AppField; globalSignal?: VisibilitySignal }) => {
    const [showUser, setShowUser] = useState(false);
    const [showPass, setShowPass] = useState(false);

    useEffect(() => {
        if (globalSignal) {
            setShowUser(globalSignal.show);
            setShowPass(globalSignal.show);
        }
    }, [globalSignal]);

    return (
        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {field.source_user_title || "Credential"}
                </span>
            </div>
            <div className="flex flex-col gap-2">
                {/* Username Field */}
                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-xs text-slate-500 w-8">USER</span>
                        <span className={`text - slate - 300 text - sm select - all ${!showUser ? 'font-mono tracking-widest' : ''} `}>
                            {showUser ? field.source_app_login_id : '••••••'}
                        </span>
                    </div>
                    <button
                        onClick={() => setShowUser(!showUser)}
                        className="p-1 text-slate-500 hover:text-blue-400 transition-colors"
                        title={showUser ? "Hide Username" : "Show Username"}
                    >
                        {showUser ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Password Field */}
                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-xs text-slate-500 w-8">PASS</span>
                        <span className={`font - mono text - sm select - all ${showPass ? 'text-emerald-400' : 'text-slate-400 tracking-widest'} `}>
                            {showPass ? field.source_app_password : '••••••'}
                        </span>
                    </div>
                    <button
                        onClick={() => setShowPass(!showPass)}
                        className="p-1 text-slate-500 hover:text-emerald-400 transition-colors"
                        title={showPass ? "Hide Password" : "Show Password"}
                    >
                        {showPass ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const VaultItem = ({ app, viewMode, globalSignal, masterPassword }: VaultItemProps) => {
    const [isLocked, setIsLocked] = useState(true);
    const [unlockInput, setUnlockInput] = useState('');
    const [error, setError] = useState(false);

    const [showUnlockPass, setShowUnlockPass] = useState(false);

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        const inputClean = unlockInput.trim();
        const masterClean = masterPassword?.trim();

        if (inputClean === masterClean) {
            setIsLocked(false);
            setError(false);
            // Clear input on successful unlock for security
            setUnlockInput('');
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    const handleLock = () => {
        setIsLocked(true);
        setShowUnlockPass(false); // Reset visibility toggle
    };

    const lockedContent = (
        <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[120px]">
            <svg className="w-8 h-8 text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <form onSubmit={handleUnlock} className="w-full max-w-[200px] relative">
                <div className="relative">
                    <input
                        type={showUnlockPass ? "text" : "password"}
                        placeholder="Unlock Password"
                        className={`w-full bg-slate-900 border ${error ? 'border-red-500' : 'border-slate-700'} rounded p-2 pr-8 text-white text-xs text-center mb-2 focus:outline-none focus:border-blue-500 transition-colors`}
                        value={unlockInput}
                        onChange={(e) => setUnlockInput(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowUnlockPass(!showUnlockPass)}
                        className="absolute right-2 top-2 text-slate-500 hover:text-white"
                    >
                        {showUnlockPass ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                </div>
                <button
                    type="submit"
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-1 px-2 rounded transition-colors"
                >
                    Unlock
                </button>
            </form>
        </div>
    );

    if (viewMode === 'list') {
        return (
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm hover:border-slate-600 transition-all flex flex-col sm:flex-row gap-4">
                <div className="flex items-center min-w-[200px]">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {app.app_name?.charAt(0).toUpperCase()}
                    </div>
                    <h4 className="ml-3 text-lg font-bold text-white truncate">{app.app_name}</h4>
                </div>

                {isLocked ? (
                    lockedContent // Using variable to preserve focus
                ) : (
                    <div className="flex-1 flex gap-4">
                        <div className="flex-1 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {app.fields?.map((field, fIdx) => (
                                <FieldRow key={fIdx} field={field} globalSignal={globalSignal} />
                            ))}
                        </div>
                        <button
                            onClick={handleLock}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-colors self-start"
                            title="Lock Item"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // Grid View (Default)
    return (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all h-full relative group">
            <div className="flex items-center mb-4 justify-between">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-lg font-bold">
                        {app.app_name?.charAt(0).toUpperCase()}
                    </div>
                    <h4 className="ml-4 text-xl font-bold text-white">{app.app_name}</h4>
                </div>
                {!isLocked && (
                    <button
                        onClick={handleLock}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Lock Item"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </button>
                )}
            </div>

            {isLocked ? (
                lockedContent // Using variable to preserve focus
            ) : (
                <div className="space-y-3">
                    {app.fields?.map((field, fIdx) => (
                        <FieldRow key={fIdx} field={field} globalSignal={globalSignal} />
                    ))}
                </div>
            )}
        </div>
    );
};

