export const login = async (email, password) => {
  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('name', data.name);
      return data;
    }
    throw new Error(data.error);
  } catch (error) {
    throw error;
  }
};

export const isAdmin = () => localStorage.getItem('role') === 'admin';
