export enum DataType {
  INT16 = 'int16',
  UINT16 = 'uint16',
  INT32 = 'int32',
  UINT32 = 'uint32',
  FLOAT32 = 'float32',
  BOOLEAN = 'boolean',
  STRING = 'string',
}

export enum RegisterType {
  HOLDING = 'holding',
  INPUT = 'input',
  COIL = 'coil',
  DISCRETE_INPUT = 'discrete_input',
}

export interface Register {
  id: string; // Unique identifier for React key prop and updates
  address: number;
  label: string;
  description?: string;
  dataType: DataType;
  registerType: RegisterType;
  unit?: string;
  writable?: boolean;
  scaleFactor?: number;
  offset?: number;
}

// Type for defining register templates before an ID is assigned
export type RegisterTemplate = Omit<Register, 'id'>;

export interface ConnectionStatusOptions {
  host: string;
  port: number;
  timeout?: number;
  retries?: number;
  deviceId?: string;
  autoReconnect?: boolean;
  retryInterval?: number;
  maxRetries?: number;
  initialStatus?: boolean;
  reconnectDelay?: number;
  showToasts?: boolean;
}

export interface ConnectionStatusResult {
  connected: boolean;
  message: string;
  latency?: number;
  isConnected?: boolean;
  isOnline?: boolean;
  error?: Error | null;
  retryConnection?: () => Promise<void>;
  lastConnected?: Date;
  connect?: () => Promise<void>;
  disconnect?: () => Promise<void>;
  connectionAttempts?: number;
  status?: 'connected' | 'connecting' | 'disconnected' | 'error' | 'ready';
}

export interface ModbusRegister {
  address: number;
  name: string;
  type: 'input' | 'holding' | 'coil' | 'discrete';
  dataType: 'int16' | 'uint16' | 'int32' | 'uint32' | 'float' | 'boolean';
  scale?: number;
  unit?: string;
  description?: string;
}
