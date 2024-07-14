// MedicoContext.js
import React, { createContext, useState, useContext } from 'react';

const MedicoContext = createContext();

export const MedicoProvider = ({ children }) => {
    const [medicoSeleccionado, setMedicoSeleccionado] = useState(null);

    return (
        <MedicoContext.Provider value={{ medicoSeleccionado, setMedicoSeleccionado }}>
            {children}
        </MedicoContext.Provider>
    );
};

export const useMedico = () => useContext(MedicoContext);
