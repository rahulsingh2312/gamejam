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

const WalletIntegration = () => {
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={HELIUS_RPC}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="flex flex-col items-center gap-4 mt-10">
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
            <TransactionButton />
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
      className={`px-4 ml-14 py-2 rounded-lg font-bold transition-all duration-200 border ${
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
