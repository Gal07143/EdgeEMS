import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRegisterMap } from '../hooks/useRegisterMap';
import { Register, RegisterTemplate, RegisterType, DataType } from '../types/modbus';
import { defaultTemplates, loadTemplate } from '../config/deviceTemplates'; // Import templates for dropdown

// Basic styling (replace with your preferred styling solution)
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    border: '1px solid #ccc',
    borderRadius: '8px',
    maxWidth: '800px',
    margin: '20px auto',
  },
  header: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  select: {
    padding: '8px',
    marginRight: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    borderBottom: '2px solid #ddd',
    padding: '10px',
    textAlign: 'left',
    backgroundColor: '#f8f8f8',
  },
  td: {
    borderBottom: '1px solid #eee',
    padding: '10px',
  },
  input: {
    padding: '6px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: 'calc(100% - 14px)', // Adjust for padding
  },
  button: {
    padding: '8px 15px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '4px',
    marginLeft: '5px',
  },
  addButton: {
    backgroundColor: '#28a745',
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
  },
  checkbox: {
    padding: '6px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
};

export const DeviceMapEditor: React.FC = () => {
  const { registerList, addRegister, updateRegister, deleteRegister, loadRegisters } = useRegisterMap([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(Object.keys(defaultTemplates)[0] || '');

  const handleLoadTemplate = () => {
    const template = loadTemplate(selectedTemplate);
    if (template) {
      // Assuming loadRegisters replaces the current map
      // Convert RegisterTemplate[] to Register[] by adding a unique ID
      const registersWithIds: Register[] = template.registers.map((regTemp, index) => ({
        ...regTemp,
        id: `${selectedTemplate}-${index}-${Date.now()}` // Example unique ID generation
      }));
      loadRegisters(registersWithIds);
    } else {
      console.error("Template not found:", selectedTemplate);
      // Handle error display to the user
    }
  };

  const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    let processedValue: string | number | boolean = value;

    // Handle checkbox specifically for the 'writable' field
    if (name === 'writable' && type === 'checkbox' && event.target instanceof HTMLInputElement) {
      processedValue = event.target.checked;
    }
    // Handle number inputs
    else if (name === 'address' || name === 'scaleFactor' || name === 'offset') { // Use correct field names from Register interface
      processedValue = value === '' ? 0 : parseFloat(value); // Default to 0 if empty
      if (isNaN(processedValue)) {
        console.error("Invalid number input for", name);
        processedValue = 0; // Or handle as needed
      }
    }

    // Type assertion for name to be a key of Register
    const fieldName = name as keyof Register;

    // Handle enum types
    if (fieldName === 'dataType') {
      if (Object.values(DataType).includes(value as DataType)) {
        processedValue = value as DataType;
      } else {
        console.error("Invalid DataType:", value);
        return; // Prevent update
      }
    } else if (fieldName === 'registerType') {
      if (Object.values(RegisterType).includes(value as RegisterType)) {
        processedValue = value as RegisterType;
      } else {
        console.error("Invalid RegisterType:", value);
        return; // Prevent update
      }
    }
    // For other string types like label, description, unit, no special handling needed unless validation is added
    else if (typeof registerList[index][fieldName] === 'string') {
      processedValue = value; // Already a string
    }

    // Ensure the fieldName is a valid key before updating
    if (fieldName in registerList[index]) {
      updateRegister(index, fieldName, processedValue);
    } else {
      console.error(`Attempted to update invalid field: ${fieldName}`);
    }
  };

  const handleAddRegister = () => {
    // Create a new register template with default/empty values
    // Generate a unique ID for the new register
    const newRegister: Register = {
      id: `new-${Date.now()}`,
      label: 'New Register',
      address: 0,
      registerType: RegisterType.HOLDING, // Default type
      dataType: DataType.INT16, // Default type
      // Other fields can be undefined or set to defaults
      length: 1,
      scaleFactor: 1,
      unit: '',
      writable: false,
      description: '',
    };
    addRegister(newRegister);
  };

  const handleDeleteRegister = (index: number) => {
    deleteRegister(index); // Pass index
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Device Register Map Editor</h2>
        <div>
          <label htmlFor="template-select">Load Template: </label>
          <select
            id="template-select"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Select Template --</option>
            {Object.keys(defaultTemplates).map(key => (
              <option key={key} value={key}>
                {key} ({defaultTemplates[key].description})
              </option>
            ))}
          </select>
          <button onClick={handleLoadTemplate} style={{...styles.button, ...styles.addButton}}>
            Load Template
          </button>
          <button onClick={handleAddRegister} style={{...styles.button, ...styles.addButton}}>
            Add Register
          </button>
        </div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Address</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Data Type</th>
            <th style={styles.th}>Scale</th>
            <th style={styles.th}>Unit</th>
            <th style={styles.th}>Writable</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {registerList.map((register, index) => (
            <tr key={register.id}>
              <td style={styles.td}>
                <input
                  type="text"
                  name="label"
                  value={register.label || ''}
                  onChange={(e) => handleInputChange(index, e)}
                  style={styles.input}
                />
              </td>
              <td style={styles.td}>
                <input
                  type="number"
                  name="address"
                  value={register.address}
                  onChange={(e) => handleInputChange(index, e)}
                  style={styles.input}
                />
              </td>
              <td style={styles.td}>
                <select
                  name="registerType"
                  value={register.registerType}
                  onChange={(e) => handleInputChange(index, e)}
                  style={styles.input}
                >
                  {Object.values(RegisterType).map(rt => <option key={rt} value={rt}>{rt}</option>)}
                </select>
              </td>
              <td style={styles.td}>
                <select
                  name="dataType"
                  value={register.dataType}
                  onChange={(e) => handleInputChange(index, e)}
                  style={styles.input}
                >
                  {Object.values(DataType).map(dt => <option key={dt} value={dt}>{dt}</option>)}
                </select>
              </td>
              <td style={styles.td}>
                <input
                  type="number"
                  name="scaleFactor"
                  value={register.scaleFactor ?? 1}
                  onChange={(e) => handleInputChange(index, e)}
                  style={styles.input}
                />
              </td>
              <td style={styles.td}>
                <input
                  type="text"
                  name="unit"
                  value={register.unit || ''}
                  onChange={(e) => handleInputChange(index, e)}
                  style={styles.input}
                />
              </td>
              <td style={styles.td}>
                <input
                  type="checkbox"
                  name="writable"
                  checked={register.writable || false}
                  onChange={(e) => handleInputChange(index, e)}
                  style={styles.checkbox}
                />
              </td>
              <td style={styles.td}>
                <input
                  type="text"
                  name="description"
                  value={register.description || ''}
                  onChange={(e) => handleInputChange(index, e)}
                  style={styles.input}
                />
              </td>
              <td style={styles.td}>
                <button
                  onClick={() => handleDeleteRegister(index)}
                  style={{...styles.button, ...styles.deleteButton}}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 