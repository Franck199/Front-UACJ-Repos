import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setErrorMessage('Por favor, rellena todos los campos');
            return;
        }
        const loginData = { email, password };
        setLoading(true);
    
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });
            const data = await response.json();
            console.log('Login response:', data);  // Para depuración

            if (response.ok) {
                setErrorMessage('');
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('userName', data.userName || data.name);
                localStorage.setItem('userRole', data.role);

                // Verificar que se guardó correctamente
                console.log('Stored in localStorage:', {
                    token: localStorage.getItem('token'),
                    userId: localStorage.getItem('userId'),
                    userName: localStorage.getItem('userName'),
                    userRole: localStorage.getItem('userRole')
                });

                navigate('/menu');
            } else {
                setErrorMessage(data.message || 'Correo o contraseña incorrectos');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setErrorMessage('Error al conectar con el servidor. Por favor, inténtalo de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="login-container">
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Iniciando sesión...' : 'Ingresar'}
                    </button>
                </form>
                {errorMessage && <p className="error">{errorMessage}</p>}
            </div>
            <div className="debug-info">
            </div>
        </div>
    );
};

export default Login;