//parent interface

export interface TokenData extends HolderInterface {
  name: string;
  symbol: string;
  price: number;
  liquidity: number;
  volume: VolumeData;
  transaction: TransactionData;
}

export interface HolderInterface {
   marketCap: string;
   holders_count: string;
   launchDate: string;
}

// Transaction Data
interface TransactionData {
  "6h": number;
  "12h": number;
  "24h": number;
  "48h": number;
  "7d": number;
  "30d": number;
}

interface VolumeData {
  "6h": number;
  "12h": number;
  "24h": number;
  "48h": number;
  "7d": number;
  "30d": number;
}

export interface HistoricalDataInterface {
    
}