import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRecovering, setIsRecovering] = useState(false);
    const navigate = useNavigate();
    const API_URL = 'https://aplicacionbackweb-d5bxb7bvhefjgcd0.canadacentral-01.azurewebsites.net';

    useEffect(() => {
        // Verificar si el usuario ya está autenticado
        const checkAuthStatus = async () => {
            try {
                const response = await fetch('/.auth/me');
                const data = await response.json();
                if (data.clientPrincipal) {
                    // Usuario ya autenticado, redirigir al menú
                    navigate('/menu');
                }
            } catch (error) {
                console.error('Error al verificar estado de autenticación:', error);
            }
        };

        checkAuthStatus();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setErrorMessage('Por favor, rellena todos los campos');
            return;
        }
        setLoading(true);
    
        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Login response:', data);

            if (data.token) {
                setErrorMessage('');
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('userName', data.userName || data.name);
                localStorage.setItem('userRole', data.role);

                // Redirigir al usuario
                navigate('/menu');
            } else {
                setErrorMessage('Error en la respuesta del servidor');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setErrorMessage('Error al conectar con el servidor. Por favor, inténtalo de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    };

    const handleRecoverPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            setErrorMessage('Por favor, ingresa tu correo electrónico');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/recover-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSuccessMessage('Se ha enviado un correo con instrucciones para recuperar tu contraseña.');
            setErrorMessage('');
        } catch (error) {
            console.error('Error al recuperar contraseña:', error);
            setErrorMessage('Error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    };

    // ... (resto del código del componente, incluyendo el JSX para el formulario)

};

export default Login;
