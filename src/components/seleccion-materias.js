import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

const SeleccionMaterias = () => {
    const [materias, setMaterias] = useState([]);
    const [selectedMaterias, setSelectedMaterias] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(true);

    const getAuthHeaders = useCallback(() => {
        const token = localStorage.getItem('token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }, []);

    const fetchData = useCallback(async (url, errorMessage) => {
        try {
            const response = await axios.get(url, { headers: getAuthHeaders() });
            console.log(`Datos de ${url}:`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            throw new Error(`${errorMessage} ${error.response ? `(${error.response.status}: ${error.response.statusText})` : ''}`);
        }
    }, [getAuthHeaders]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                const [materiasData, historialData] = await Promise.all([
                    fetchData(`${API_BASE_URL}/materias`, 'Error al cargar materias.'),
                    fetchData(`${API_BASE_URL}/check-historial`, 'Error al cargar el historial academico.')
                ]);

                setMaterias(materiasData);
                if (historialData && historialData.historial) {
                    setSelectedMaterias(historialData.historial);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [fetchData]);

    const handleSelect = useCallback((materia) => {
        if (!materia || !materia.materia_id) {
            setError('Ocurrio un error mienstras seleccionaba las materias. ID invalido');
            return;
        }

        setSelectedMaterias(prevSelected => {
            const isAlreadySelected = prevSelected.some(item => item.materia_id === materia.materia_id);
            if (isAlreadySelected) {
                return prevSelected.filter(item => item.materia_id !== materia.materia_id);
            } else {
                return [...prevSelected, { 
                    materia_id: materia.materia_id, 
                    status: 'Aprobado', 
                    semestre: 1 
                }];
            }
        });
    }, []);

    const handleSubmit = async () => {
        if (selectedMaterias.length === 0) {
            setError('No se ha podido procesar correctamente');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${API_BASE_URL}/guardar-historial`, 
                { materias: selectedMaterias },
                { headers: getAuthHeaders() }
            );
            console.log('Materias guardadas:', response.data);
            setSuccess('Sus materias se han guardado correctamente.');
            setError(null);
        } catch (error) {
            let errorMessage = 'Error al guardar sus materias. ';
            if (error.response) {
                if (error.response.status === 500) {
                    errorMessage += 'Tenemos problemas con el servidor :(';
                } else {
                    errorMessage += `(${error.response.status}: ${error.response.statusText})`;
                }
                if (error.response.data && error.response.data.message) {
                    errorMessage += ` Detalles: ${error.response.data.message}`;
                }
            } else if (error.request) {
                errorMessage += 'Tenemos problemas con el servidor.';
            } else {
                errorMessage += error.message;
            }
            setError(errorMessage);
            setSuccess(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="materias-container">
    <h2>Selecciona tus materias</h2>
    {error && <p className="error-msg">{error}</p>}
    {success && <p className="success-msg">{success}</p>}
    {materias.length > 0 ? (
        <div className="materias-grid">
            {materias.map(materia => (
                <div key={materia.materia_id} className="materia-item">
                    <input
                        className="checkbox-materia"
                        type="checkbox"
                        id={`materia-${materia.materia_id}`}
                        checked={selectedMaterias.some(item => item.materia_id === materia.materia_id)}
                        onChange={() => handleSelect(materia)}
                    />
                    <label className="label-materia" htmlFor={`materia-${materia.materia_id}`}>
                        {materia.materia_name}
                    </label>
                </div>
            ))}
        </div>
    ) : (
        <p className="no-materias-msg">Materias no disponibles</p>
    )}
    <button 
        className="boton-guardar" 
        onClick={handleSubmit} 
        disabled={selectedMaterias.length === 0 || loading}
    >
        {loading ? 'Guardando...' : 'Guardar materias'}
    </button>
</div>

    );
};

export default SeleccionMaterias;