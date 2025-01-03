import React, { useCallback, useEffect, useState } from 'react';
import { Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { log } from 'node:console';

const App: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  const PROGRAM_ID = new PublicKey('2Cm4u7GLtAKWefMqsxanEfGBVySZiUEdPcwT8H7Rfgpx');
  const URL = 'https://api.devnet.solana.com';
  const RECEIVER = new PublicKey('7v55QdzPkK3ihtKD1mbRNRKiiJhjGo2Pg9ZPn2p8qtCd');

  // Function to check if Phantom Wallet is installed
  const checkIfPhantomIsInstalled = useCallback((): boolean => {
    return !!(window?.solana?.isPhantom);
  }, []);
  

  // Function to check if the wallet is connected
  const checkIfWalletIsConnected = useCallback(async () => {
    if (checkIfPhantomIsInstalled()) {
      const { solana } = window;
      try {
        // Check if the wallet is connected and retrieve the address
        const walletAddress = solana?.isConnected
          ? solana.publicKey.toString()
          : null;

        if (!walletAddress) {
          const response = await solana?.connect({ onlyIfTrusted: true });
          if (!response) {
            console.warn('Connection to Phantom Wallet failed!');
            return;
          }
          setWalletAddress(response.publicKey.toString());
        } else {
          setWalletAddress(walletAddress);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      } finally {
        setLoading(false);
      }
    } else {
      console.warn('Phantom Wallet is not installed.');
      setLoading(false);
    }
  }, [checkIfPhantomIsInstalled]);

  // Function to connect to Phantom Wallet
  const connectWallet = useCallback(async () => {
    if (!checkIfPhantomIsInstalled()) {
      alert('Phantom Wallet is not installed!');
      return;
    }

    try {
      const { solana } = window;
      const response = await solana?.connect();
      if (!response) {
        alert('Connection to Phantom Wallet failed!');
        return;
      }
      setWalletAddress(response.publicKey.toString());
    } catch (err) {
      console.error('Error connecting to the wallet:', err);
    }
  }, [checkIfPhantomIsInstalled]);

  // Function to disconnect from the wallet
  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
  }, []);

  // Check connection when the page loads
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [checkIfWalletIsConnected]);

  const interactWithContract = useCallback( async () => {
    if (!walletAddress) {
      alert('Please connect to Phantom Wallet first!');
      return;
    }

    try {
      const connection = new Connection(URL, 'confirmed');
      const { solana } = window;

      const blockhash = await connection.getLatestBlockhash('finalized');

      const instruction = new TransactionInstruction({
        keys: [
          {
            pubkey: new PublicKey(walletAddress),
            isSigner: true,
            isWritable: true,
          },
          {
            pubkey: RECEIVER,
            isSigner: false,
            isWritable: true,
          },
        ],
        programId: PROGRAM_ID,
      });

      const transaction = new Transaction().add(instruction);

      transaction.recentBlockhash = blockhash.blockhash;
      transaction.feePayer = new PublicKey(walletAddress);

      const signedTransaction = await solana?.signTransaction(transaction);

      const signature = await connection.sendRawTransaction(signedTransaction.serialize());


      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      console.log('Transaction confirmed:', confirmation);
      alert('Transaction confirmed!');
    } catch (error) {
      console.log('Error interacting with the contract:', error);
    }
  }, [walletAddress]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-mono">
      <div className="w-[550px] h-[200px] mx-auto mt-10 text-center p-6 bg-white shadow-lg rounded-lg">
        {loading ? (
          // Skeleton Loader
          <div className="animate-pulse flex flex-col items-center gap-4 mt-5">
            <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto"></div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
              Connect to Phantom Wallet
            </h1>
            {walletAddress ? (
              <>
                <p className="text-gray-600 mb-4">
                  <span className="font-medium text-gray-800">Connected:</span> {walletAddress}
                </p>
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Disconnect
                </button>
                <button
                onClick={interactWithContract}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition ml-4"
                >
                  Sign Contract
                </button>
              </>
            ) : (
              <button
                onClick={connectWallet}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mt-6"
              >
                Connect to Phantom Wallet
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
