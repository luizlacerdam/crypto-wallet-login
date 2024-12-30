import React, { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

const App = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Função para verificar se Phantom está instalado
  const checkIfPhantomIsInstalled = () => {
    return window.solana && window.solana.isPhantom;
  };

  // Função para conectar à carteira Phantom
  const connectWallet = async () => {
    if (!checkIfPhantomIsInstalled()) {
      alert('Phantom Wallet não está instalada!');
      return;
    }

    try {
      const response = await window.solana.connect(); // Solicita a conexão
      setWalletConnected(true);
      setWalletAddress(response.publicKey.toString());
    } catch (err) {
      console.error('Erro ao conectar à carteira:', err);
    }
  };

  // Função para desconectar da carteira
  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress(null);
  };

  useEffect(() => {
    // Verifica se Phantom já está conectado ao carregar o app
    const checkConnection = async () => {
      if (checkIfPhantomIsInstalled()) {
        const { solana } = window;        
        if (solana.isConnected) {
          setWalletConnected(true);
          setWalletAddress(solana.publicKey.toString());
        }
      }
    };
    checkConnection();
  }, []);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-mono'>
      <div className="w-[550px] mx-auto mt-10 text-center p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Conectar à Carteira Phantom
      </h1>
      {walletConnected ? (
        <>
          <p className="text-gray-600 mb-4">
            <span className="font-medium text-gray-800">Conectado:</span> {walletAddress}
          </p>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Desconectar
          </button>
        </>
      ) : (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Conectar à Phantom Wallet
        </button>
      )}
    </div>
  </div>
  
  );
};

export default App;
