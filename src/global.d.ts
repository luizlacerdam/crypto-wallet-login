interface Solana {
    isPhantom: boolean;
    publicKey: {
      toString: () => string;
    };
    isConnected: boolean;
    connect: (options?: { onlyIfTrusted: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
  }
  
  interface Window {
    solana?: Solana;
  }
  