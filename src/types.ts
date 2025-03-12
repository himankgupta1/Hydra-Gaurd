export interface SensorData {
    id: string;
    location: string;
    type: 'pressure' | 'flow' | 'quality';
    value: number;
    timestamp: string;
    status: 'normal' | 'warning' | 'critical';
    prediction?: {
      failureProbability: number;
      estimatedTimeToFailure: number;
      recommendedAction: string;
    };
  }
  
  export interface MaintenanceRecord {
    id: string;
    assetId: string;
    date: string;
    type: 'scheduled' | 'emergency';
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    technician: string;
  }