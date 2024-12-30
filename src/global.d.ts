interface Solana {
    isPhantom: boolean;
    publicKey: {
      toString: () => string;
    };
    isConnected: boolean;
    signAndSendTransaction: (transaction: any) => Promise<string>;
    connect: (options?: { onlyIfTrusted: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
  }
  
  interface Window {
    solana?: Solana;
  }
  