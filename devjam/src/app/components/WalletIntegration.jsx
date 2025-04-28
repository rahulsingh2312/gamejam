'use client';
import React, { useMemo, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import toast, { Toaster } from 'react-hot-toast';

// Import wallet adapter CSS
require('@solana/wallet-adapter-react-ui/styles.css');

const HELIUS_RPC = 'https://mainnet.helius-rpc.com/?api-key=a95e3765-35c7-459e-808a-9135a21acdf6';

const InfoPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-4 left-4 bg-[#f0f0f0] border-4 border-[#808080] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] z-[9999] p-4 max-w-sm transform transition-all duration-300 ease-in-out md:block hidden">
      <div className="flex justify-between items-start mb-4 border-b-2 border-[#808080] pb-2">
        <h3 className="text-lg font-bold text-[#000080] font-['MS_Sans_Serif']">Contact Information</h3>
        <button 
          onClick={onClose}
          className="text-[#800000] hover:text-[#ff0000] text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#e0e0e0]"
        >
          ×
        </button>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-[#000080] mb-1 font-['MS_Sans_Serif']">X (Twitter) ID:</p>
          <p className="text-sm font-mono bg-[#e0e0e0] p-2 rounded border border-[#808080]">@ares_racing</p>
        </div>
        <div>
          <p className="text-sm text-[#000080] mb-1 font-['MS_Sans_Serif']">Contract Address:</p>
          <p className="text-sm font-mono bg-[#e0e0e0] p-2 rounded border border-[#808080] break-all">3mSyvNaJrV7912we42p2Pq6EzvojtczULPPfqekSpump</p>
        </div>
      </div>
    </div>
  );
};

const MobileInfoButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="md:hidden fixed top-4 left-4 bg-[#f0f0f0] border-4 border-[#808080] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] p-2 rounded-lg z-[9999]"
    >
      <div className="flex items-center space-x-2">
        <span className="text-[#000080] font-['MS_Sans_Serif']">ℹ️</span>
        <span className="text-[#000080] font-['MS_Sans_Serif']">Info</span>
      </div>
    </button>
  );
};

const MobileInfoPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-[#f0f0f0] border-4 border-[#808080] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] p-4 w-full max-w-xs">
        <div className="flex justify-between items-start mb-4 border-b-2 border-[#808080] pb-2">
          <h3 className="text-lg font-bold text-[#000080] font-['MS_Sans_Serif']">Contact Information</h3>
          <button 
            onClick={onClose}
            className="text-[#800000] hover:text-[#ff0000] text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#e0e0e0]"
          >
            ×
          </button>
        </div>
        <div className="space-y-3">
          <div>
          <a target='_blank' href='https://x.com/F1racedotfun'>    <p className="text-sm text-[#000080] mb-1 font-['MS_Sans_Serif']">X (Twitter) ID:</p>
            <p className="text-sm font-mono bg-[#e0e0e0] p-2 rounded border border-[#808080]">@f1racedotfun</p>
          </a>
          </div>
          <div>
            <p className="text-sm text-[#000080] mb-1 font-['MS_Sans_Serif']">Contract Address:</p>
            <p className="text-sm font-mono bg-[#e0e0e0] p-2 rounded border border-[#808080] break-all">comingsoononpump</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const WalletIntegration = () => {
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );
  const [showInfoPopup, setShowInfoPopup] = useState(true);
  const [showMobileInfo, setShowMobileInfo] = useState(false);

  return (
    <ConnectionProvider endpoint={HELIUS_RPC}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="flex md:flex-col items-center md:gap-4 md:mt-10">
            <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
            <WalletMultiButton
              style={{
                backgroundColor: 'transparent',
                color: '#ffffff',
                borderRadius: '10px',
                border: 'white 1px solid',
              }}
              className="!bg-red-700 hover:!bg-red-800"
            />
            {/* <a target='_blank' className='text-white' href='https://x.com/F1racedotfun'>X : @f1racedotfun</a> */}
            <TransactionButton />
            <InfoPopup isOpen={showInfoPopup} onClose={() => setShowInfoPopup(false)} />
            <MobileInfoButton onClick={() => setShowMobileInfo(true)} />
            <MobileInfoPopup isOpen={showMobileInfo} onClose={() => setShowMobileInfo(false)} />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const TransactionButton = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('ARESgaTi8MtazdJs8bsrVYJ4kQrshoYqswHHg3L4Zfh9');
      setCopied(true);
      toast.success('Wallet address copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy address');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-4 md:ml-14 ml-4 py-2 rounded-lg font-bold transition-all duration-200 border ${
        !copied
          ? 'bg-transparent hover:bg-green-700 border-white text-white'
          : 'bg-transparent border-white cursor-crosshair text-green-600'
      }`}
    >
      {copied ? 'Copied Wallet Address!' : 'Tip SOL'}
    </button>
  );
};

export default WalletIntegration;
