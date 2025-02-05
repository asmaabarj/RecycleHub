export interface WasteType {
    type: 'plastique' | 'verre' | 'papier' | 'metal';
    weight: number;
  }
  
  export interface CollectionRequest {
    id: string;
    userId: string;
    wasteTypes: WasteType[];
    totalWeight: number;
    photos?: string[];
    collectionAddress: string;
    collectionDate: Date;
    timeSlot: string;
    notes?: string;
    status: 'en_attente' | 'validé' | 'rejeté' | 'terminé';
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CollectionState {
    requests: CollectionRequest[];
    loading: boolean;
    error: string | null;
  }