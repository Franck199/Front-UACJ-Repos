import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

const SeleccionHorarios = () => {
    const [selectedMaterias, setSelectedMaterias] = useState([]);
    const [franjasHorarias, setFranjasHorarias] = useState([]);
    const [selectedHorarios, setSelectedHorarios] = useState({});
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(true);

    const diasCombinaciones = [
        { id: 1, dias: ['Lunes', 'Miércoles'] },
        { id: 2, dias: ['Martes', 'Jueves'] }
    ];

    const getAuthHeaders = useCallback(() => {
        const token = localStorage.getItem('token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }, []);

    const fetchData = useCallback(async () => {
        try {
            const storedMaterias = JSON.parse(localStorage.getItem('selectedMaterias') || '[]');
            setSelectedMaterias(storedMaterias);

            const franjasResponse = await axios.get(`${API_BASE_URL}/franjas-horarias`, { headers: getAuthHeaders() });
            console.log('Franjas horarias received:', franjasResponse.data);
            setFranjasHorarias(franjasResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load time slots. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [getAuthHeaders]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleHorarioSelection = (materiaId, combinacionId, franjaId) => {
        setSelectedHorarios(prev => ({
            ...prev,
            [materiaId]: { 
                ...prev[materiaId],
                combinacionId: combinacionId || prev[materiaId]?.combinacionId,
                franjaId: franjaId || prev[materiaId]?.franjaId
            }
        }));
    };

    const handleSubmit = async () => {
        if (Object.keys(selectedHorarios).length !== selectedMaterias.length) {
            setError('Please select a time slot for each course.');
            return;
        }

        try {
            const data = selectedMaterias.map(materia => {
                const horario = selectedHorarios[materia.materia_id];
                const diasSeleccionados = diasCombinaciones.find(c => c.id === parseInt(horario.combinacionId)).dias;
                return {
                    materia_id: materia.materia_id,
                    dia_1: diasSeleccionados[0],
                    dia_2: diasSeleccionados[1],
                    franja_id: parseInt(horario.franjaId),
                    semestre: 1
                };
            });

            await axios.post(`${API_BASE_URL}/guardar-horarios`, data, { headers: getAuthHeaders() });
            setSuccess('Horarios guardados exitosamente');
            setError(null);
            localStorage.removeItem('selectedMaterias');
        } catch (error) {
            console.error('Error saving schedules:', error);
            setError('Failed to save schedules. Please try again.');
            setSuccess(null);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

        return (
            <div className="materias-container">
                <h2 className="titulo-materias">Selección de Horarios</h2>
                {error && <p style={{color: 'red'}}>{error}</p>}
                {success && <p style={{color: 'green'}}>{success}</p>}
                {selectedMaterias.map(materia => (
                    <div className="materia-item" key={materia.materia_id}>
                        <h3 className="label-materia">{materia.materia_name}</h3>
                        {diasCombinaciones.length > 0 && (
                            <select
                                className="dropdown-horario"
                                value={selectedHorarios[materia.materia_id]?.combinacionId || ""}
                                onChange={(e) =>
                                    handleHorarioSelection(materia.materia_id, e.target.value, null)
                                }
                            >
                                <option value="" disabled>
                                    Selecciona Días
                                </option>
                                {diasCombinaciones.map((combinacion) => (
                                    <option key={combinacion.id} value={combinacion.id}>
                                        {combinacion.dias.join(' y ')}
                                    </option>
                                ))}
                            </select>
                        )}
                        {franjasHorarias.length > 0 && (
                            <select
                                className="dropdown-horario"
                                value={selectedHorarios[materia.materia_id]?.franjaId || ""}
                                onChange={(e) =>
                                    handleHorarioSelection(materia.materia_id, null, e.target.value)
                                }
                            >
                                <option value="" disabled>
                                    Selecciona Horario
                                </option>
                                {franjasHorarias.map((franja) => (
                                    <option key={franja.franja_id} value={franja.franja_id}>
                                        {franja.hora_inicio} - {franja.hora_fin}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                ))}
                <button className="boton-guardar" onClick={handleSubmit}>Guardar Selección</button>
            </div>
        );
    };

export default SeleccionHorarios;