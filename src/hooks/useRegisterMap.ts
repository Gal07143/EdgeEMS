import { useState, useCallback } from 'react';
import { Register, DataType, RegisterType } from '../types/modbus';

// Define the shape of the hook's return value
export interface UseRegisterMapResult {
    registerList: Register[];
    addRegister: (newRegister: Register) => void;
    updateRegister: (index: number, field: keyof Register, value: any) => void;
    deleteRegister: (id: string) => void; // Changed to accept id (string)
    loadRegisters: (registers: Register[]) => void;
}

export const useRegisterMap = (initialRegisters: Register[] = []): UseRegisterMapResult => {
    const [registerList, setRegisterList] = useState<Register[]>(initialRegisters);

    const addRegister = useCallback((newRegister: Register) => {
        // Ensure the new register has a unique ID if not provided
        const registerWithId = {
            ...newRegister,
            id: newRegister.id || `reg-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
        };
        setRegisterList(currentList => [...currentList, registerWithId]);
    }, []);

    const updateRegister = useCallback((index: number, field: keyof Register, value: any) => {
        setRegisterList(currentList => {
            const newList = [...currentList];
            if (index >= 0 && index < newList.length) {
                // Create a new object for the updated register to ensure immutability
                newList[index] = { ...newList[index], [field]: value };
            } else {
                console.error(`Invalid index provided to updateRegister: ${index}`);
            }
            return newList;
        });
    }, []);

    const deleteRegister = useCallback((id: string) => {
        setRegisterList(currentList => currentList.filter(register => register.id !== id));
    }, []);

    const loadRegisters = useCallback((registers: Register[]) => {
        // Ensure all loaded registers have unique IDs
        const registersWithIds = registers.map((reg, index) => ({
            ...reg,
            id: reg.id || `loaded-${index}-${Date.now()}`
        }));
        setRegisterList(registersWithIds);
    }, []);

    return { registerList, addRegister, updateRegister, deleteRegister, loadRegisters };
}; 