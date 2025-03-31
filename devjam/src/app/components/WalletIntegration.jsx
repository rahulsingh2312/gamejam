'use client'
import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

// Import wallet adapter CSS
require('@solana/wallet-adapter-react-ui/styles.css');

const HELIUS_RPC = 'https://mainnet.helius-rpc.com/?api-key=a95e3765-35c7-459e-808a-9135a21acdf6';

const WalletIntegration = () => {
  // Set up network and wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={HELIUS_RPC}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="flex  items-center gap-4 ">
            <WalletMultiButton style={{ backgroundColor: '#C10008', color: '#ffffff' , borderRadius: '10px' , border: 'white 1px solid' }} className="!bg-red-700 hover:!bg-red-800" />
            <TransactionButton endpoint={HELIUS_RPC} />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const TransactionButton = ({ endpoint }) => {
  const { publicKey, sendTransaction } = useWallet();
  const connection = useMemo(() => new Connection(endpoint), [endpoint]);

  const handleTransaction = async () => {
    if (!publicKey) return;

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey('ARESgaTi8MtazdJs8bsrVYJ4kQrshoYqswHHg3L4Zfh9'),
          lamports: 1 * LAMPORTS_PER_SOL,
        })
      );

      // Get the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      console.log('Transaction sent:', signature);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature);
      console.log('Transaction confirmed:', confirmation);
      
      alert('Transaction sent successfully!');
    } catch (error) {
      console.error('Error sending transaction:', error);
      alert('Failed to send transaction. Please try again.');
    }
  };

  return (
    <button
      onClick={handleTransaction}
      disabled={!publicKey}
      className={`px-4 py-2 rounded-lg font-bold ${
        publicKey
          ? 'bg-green-600 hover:bg-green-700 text-white'
          : 'bg-gray-400 cursor-not-allowed text-gray-600'
      }`}
    >
      Tip 1 SOL
    </button>
  );
};

export default WalletIntegration; 