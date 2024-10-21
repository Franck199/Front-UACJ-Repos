import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchUserInfo = () => {
            const userRole = localStorage.getItem('userRole');
            const storedUserName = localStorage.getItem('userName');
            const token = localStorage.getItem('token');

            console.log('Retrieved from localStorage:', { userRole, storedUserName, token });

            setIsAdmin(userRole === 'admin');
            setUserName(storedUserName || '');
        };

        fetchUserInfo();

        // Configurar un intervalo para verificar periódicamente
        const intervalId = setInterval(fetchUserInfo, 1000);

        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(intervalId);
    }, []);

    const handleUpdateSubjects = () => {
        navigate('/seleccion-materias');
    };

    const handleChooseSubjects = () => {
        navigate('/SeleccionMateriashorarios');
    };

    const handleDownloadData = () => {
        navigate('/Descarga');
    };

    return (
        <div className="container">
            <h1>Hola, {userName || 'Usuario'}!</h1>
            <h2>Menú Principal</h2>
            <div>
                <button onClick={handleUpdateSubjects}>Generar Historial</button>
            </div>
            <div>
                <button onClick={handleChooseSubjects}>Selección de Horarios</button>
            </div>
            {isAdmin && (
                <div>
                    <button onClick={handleDownloadData}>Descargar Información</button>
                </div>
            )}
        </div>
    );
};

export default Menu;