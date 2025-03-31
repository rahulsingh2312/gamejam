import React, { useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Import wallet adapter CSS
require('@solana/wallet-adapter-react-ui/styles.css');

const HELIUS_RPC = 'https://mainnet.helius-rpc.com/?api-key=a95e3765-35c7-459e-808a-9135a21acdf6';

// Initialize wallet adapters
const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

const PaymentModal = ({ isOpen, onClose, onConfirm, carName }) => {
  const { publicKey, sendTransaction } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!publicKey) return;

    try {
      setIsProcessing(true);
      const connection = new Connection(HELIUS_RPC);
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey('ARESgaTi8MtazdJs8bsrVYJ4kQrshoYqswHHg3L4Zfh9'),
          lamports: 0.5 * LAMPORTS_PER_SOL,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      
      onConfirm();
      onClose();
    } catch (error) {
      console.error('Error sending transaction:', error);
      alert('Failed to send transaction. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-black">Unlock Premium Car</h2>
        <p className="text-gray-700 mb-6">
          To unlock the {carName}, you need to pay 0.5 SOL.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing || !publicKey}
            className={`px-4 py-2 rounded-lg ${
              isProcessing || !publicKey
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Pay 0.5 SOL'}
          </button>
        </div>
      </div>
    </div>
  );
};

const EntryScreenContent = ({ startGame, carModels, selectedCar, handleCarSelection }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedLockedCar, setSelectedLockedCar] = useState(null);

  const handleCarClick = (index) => {
    if (index > 5) {
      setSelectedLockedCar(carModels[index]);
      setShowPaymentModal(true);
    } else {
      handleCarSelection(index);
    }
  };

  const handlePaymentSuccess = () => {
    if (selectedLockedCar) {
      const index = carModels.findIndex(car => car.name === selectedLockedCar.name);
      if (index !== -1) {
        handleCarSelection(index);
      }
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "20px",
    responsive: [
      {
        breakpoint: 640, // Mobile view
        settings: {
          slidesToShow: 2,
          centerPadding: "10px",
        }
      }
    ]
  };

  return (
    <div className="md:absolute md:inset-0 flex flex-col items-center justify-center bg-red-700 bg-opacity-90 z-10 text-white p-6 overflow-y-auto h-screen">
      <img src="https://media.formula1.com/image/upload/f_auto,c_limit,w_285,q_auto/f_auto/q_auto/fom-website/etc/designs/fom-website/images/F1_75_Logo.png" alt="F1 Logo" className="w-32 mb-6" />

      {selectedCar !== null && (
        <div onClick={startGame} className="mt-8 flex flex-col items-center cursor-pointer">
          <h3 className="text-2xl font-bold mb-4">Your Selection <span className='text-black'>[tap to start race]</span></h3>
          <img src={`https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/${carModels[selectedCar].image}`} alt={carModels[selectedCar].name} className="w-100" />
        </div>
      )}

      {/* Mobile View - Carousel */}
      {/* <div className="md:hidden w-full px-6">
        <Slider {...settings}>
          {carModels.map((car, index) => (
            <div key={index} className="p-4 flex  flex-col items-center">
              <div
                className={`cursor-pointer mx-10 transition-all rounded-xl flex flex-col items-center border-4 ${
                  selectedCar === index
                    ? 'border-yellow-400 scale-105 shadow-lg shadow-yellow-400'
                    : 'border-gray-500 hover:border-white'
                } bg-white text-black p-6 w-[150px] h-[180px]`}
                onClick={() => handleCarSelection(index)}
              >
                <img
                  src={`https://media.formula1.com/content/dam/fom-website/teams/2025/${car.image}-logo.png`}
                  alt={`${car.name} Logo`}
                  className="h-12 w-12 mb-2"
                />
                <div className="text-base text-center font-bold">{car.name}</div>
                <img
                  src={`https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/${car.image}.png`}
                  alt={car.name}
                  className="h-16 mt-3"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div> */}

      <div className="w-full md:hidden block h-[60%] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 p-4">
          {carModels.map((car, index) => (
            <div
              key={index}
              className={`p-4 cursor-pointer transition-all rounded-lg flex flex-col items-center border-4 ${
                selectedCar === index ? 'border-yellow-400 scale-110 shadow-lg shadow-yellow-400' : 'border-gray-500 hover:border-white'
              } bg-white text-black relative`}
              onClick={() => handleCarClick(index)}
            >
              {index > 5 && (
                <div className="absolute top-2 right-2 text-2xl">
                  🔒
                </div>
              )}
              <img src={`https://media.formula1.com/content/dam/fom-website/teams/2025/${car.image}-logo.png`} alt={`${car.name} Logo`} className="h-12 w-12 mb-2" />
              <div className="h-16 flex items-center justify-center text-center font-bold text-lg">{car.name}</div>
              <img src={`https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/${car.image}.png`} alt={car.name} className="h-12 mt-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop View - Grid */}
      <div className="hidden md:grid grid-cols-2 md:grid-cols-5 gap-6">
        {carModels.map((car, index) => (
          <div
            key={index}
            className={`p-4 cursor-pointer transition-all rounded-lg flex flex-col items-center border-4 ${
              selectedCar === index ? 'border-yellow-400 scale-110 shadow-lg shadow-yellow-400' : 'border-gray-500 hover:border-white'
            } bg-white text-black`}
            onClick={() => handleCarClick(index)}
          >
            {index > 5 && (
              <div className="absolute top-2 right-2 text-2xl">
                🔒
              </div>
            )}
            <img src={`https://media.formula1.com/content/dam/fom-website/teams/2025/${car.image}-logo.png`} alt={`${car.name} Logo`} className="h-12 w-12 mb-2" />
            <div className="h-16 flex items-center justify-center text-center font-bold text-lg">{car.name}</div>
            <img src={`https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/${car.image}.png`} alt={car.name} className="h-12 mt-2" />
          </div>
        ))}
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePaymentSuccess}
        carName={selectedLockedCar?.name}
      />
    </div>
  );
};

// Main EntryScreen component with wallet providers
export default function EntryScreen(props) {
  return (
    <ConnectionProvider endpoint={HELIUS_RPC}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <EntryScreenContent {...props} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
