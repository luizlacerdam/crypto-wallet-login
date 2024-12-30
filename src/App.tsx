import React, { useCallback, useEffect, useState } from 'react';

const App: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Função para verificar se Phantom Wallet está instalada
  const checkIfPhantomIsInstalled = useCallback((): boolean => {
    return typeof window !== 'undefined' && window.solana && window.solana.isPhantom;
  }, []);

  // Função para verificar se a carteira está conectada
  const checkIfWalletIsConnected = useCallback(async () => {
    if (checkIfPhantomIsInstalled()) {
      const { solana } = window;
      try {
        // Verifica se a carteira está conectada e pega o endereço
        const walletAddress = solana.isConnected
          ? solana.publicKey.toString()
          : null;

        if (!walletAddress) {
          const response = await solana.connect({ onlyIfTrusted: true });
          setWalletAddress(response.publicKey.toString());
        } else {
          setWalletAddress(walletAddress);
        }
      } catch (error) {
        console.error('Erro ao verificar conexão da carteira:', error);
      } finally {
        setLoading(false);
      }
    } else {
      console.warn('Phantom Wallet não está instalada.');
      setLoading(false);
    }
  }, [checkIfPhantomIsInstalled]);

  // Função para conectar à Phantom Wallet
  const connectWallet = useCallback(async () => {
    if (!checkIfPhantomIsInstalled()) {
      alert('Phantom Wallet não está instalada!');
      return;
    }

    try {
      const { solana } = window;
      const response = await solana.connect();
      setWalletAddress(response.publicKey.toString());
    } catch (err) {
      console.error('Erro ao conectar à carteira:', err);
    }
  }, [checkIfPhantomIsInstalled]);

  // Função para desconectar da carteira
  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
  }, []);

  // Verifica a conexão ao carregar a página
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [checkIfWalletIsConnected]);

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
              Conectar à Carteira Phantom
            </h1>
            {walletAddress ? (
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
          </>
        )}
      </div>
    </div>
  );
};

export default App;
