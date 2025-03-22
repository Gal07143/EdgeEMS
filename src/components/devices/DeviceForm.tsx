import React from 'react';
import { DeviceType, DeviceStatus } from '@/types/energy';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormLabel } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DeviceFormProps {
  device: {
    name: string;
    location?: string;
    type: DeviceType;
    status: DeviceStatus;
    capacity: number;
    firmware?: string;
    description?: string;
    site_id?: string;
    integration_type?: string;
    connection_info?: {
      host?: string;
      port?: string;
      slave_id?: string;
      topic?: string;
      unit_id?: string;
    };
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (field: string, value: string) => void;
  validationErrors: Record<string, any>;
  isLoading?: boolean;
}

const DeviceForm: React.FC<DeviceFormProps> = ({
  device,
  handleInputChange,
  handleSelectChange,
  validationErrors,
  isLoading
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <FormLabel htmlFor="name">Name <span className="text-red-500">*</span></FormLabel>
            <Input
              id="name"
              name="name"
              value={device.name}
              onChange={handleInputChange}
              placeholder="Enter device name"
              className={validationErrors.name ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {validationErrors.name && (
              <p className="text-sm text-red-500">{validationErrors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <FormLabel htmlFor="location">Location</FormLabel>
            <Input
              id="location"
              name="location"
              value={device.location || ''}
              onChange={handleInputChange}
              placeholder="Enter device location"
              className={validationErrors.location ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {validationErrors.location && (
              <p className="text-sm text-red-500">{validationErrors.location.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <FormLabel htmlFor="type">Type <span className="text-red-500">*</span></FormLabel>
            <Select
              value={device.type}
              onValueChange={(value) => handleSelectChange('type', value)}
              disabled={isLoading}
            >
              <SelectTrigger id="type" className={validationErrors.type ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solar">Solar</SelectItem>
                <SelectItem value="wind">Wind</SelectItem>
                <SelectItem value="battery">Battery</SelectItem>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="load">Load</SelectItem>
                <SelectItem value="ev_charger">EV Charger</SelectItem>
                <SelectItem value="inverter">Inverter</SelectItem>
                <SelectItem value="meter">Meter</SelectItem>
                <SelectItem value="light">Light/Illumination</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.type && (
              <p className="text-sm text-red-500">{validationErrors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <FormLabel htmlFor="status">Status <span className="text-red-500">*</span></FormLabel>
            <Select
              value={device.status}
              onValueChange={(value) => handleSelectChange('status', value)}
              disabled={isLoading}
            >
              <SelectTrigger id="status" className={validationErrors.status ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select device status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.status && (
              <p className="text-sm text-red-500">{validationErrors.status.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <FormLabel htmlFor="capacity">
              Capacity {device.type === 'battery' ? '(kWh)' : '(kW)'} <span className="text-red-500">*</span>
            </FormLabel>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              step="0.01"
              value={device.capacity || ''}
              onChange={handleInputChange}
              placeholder="Enter device capacity"
              className={validationErrors.capacity ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {validationErrors.capacity && (
              <p className="text-sm text-red-500">{validationErrors.capacity.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <FormLabel htmlFor="firmware">Firmware Version</FormLabel>
            <Input
              id="firmware"
              name="firmware"
              value={device.firmware || ''}
              onChange={handleInputChange}
              placeholder="Enter firmware version"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <FormLabel htmlFor="site_id">Site ID</FormLabel>
            <Input
              id="site_id"
              name="site_id"
              value={device.site_id || ''}
              onChange={handleInputChange}
              placeholder="Enter site ID"
              disabled={isLoading}
            />
          </div>

          {/* Integration Protocol */}
          <div className="space-y-2">
            <FormLabel htmlFor="integration_type">Integration Type</FormLabel>
            <Select
              value={device.integration_type || ''}
              onValueChange={(value) => handleSelectChange('integration_type', value)}
              disabled={isLoading}
            >
              <SelectTrigger id="integration_type" className={validationErrors.integration_type ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select integration protocol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modbus">Modbus</SelectItem>
                <SelectItem value="mqtt">MQTT</SelectItem>
                <SelectItem value="opcua">OPC UA</SelectItem>
                <SelectItem value="bacnet">BACnet</SelectItem>
                <SelectItem value="ethernet_ip">EtherNet/IP</SelectItem>
                <SelectItem value="bms">BMS</SelectItem>
                <SelectItem value="manual">Manual Input</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Optional: Connection Info */}
        {device.integration_type && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6 mt-6">
            <FormLabel className="col-span-2">Connection Info</FormLabel>

            <Input
              name="connection_info.host"
              placeholder="Host (e.g. 192.168.1.100)"
              value={device.connection_info?.host || ''}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <Input
              name="connection_info.port"
              placeholder="Port (e.g. 502)"
              value={device.connection_info?.port || ''}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <Input
              name="connection_info.slave_id"
              placeholder="Slave ID / Unit ID"
              value={device.connection_info?.slave_id || ''}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <Input
              name="connection_info.topic"
              placeholder="MQTT Topic (if applicable)"
              value={device.connection_info?.topic || ''}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Description */}
        <div className="space-y-2">
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea
            id="description"
            name="description"
            value={device.description || ''}
            onChange={handleInputChange}
            placeholder="Enter device description"
            rows={4}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceForm;
