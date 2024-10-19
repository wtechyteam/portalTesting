import Cookies from 'js-cookie';

// Helper function to decode Base64 JWT payload
const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1]; // Get the payload part of the JWT
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const auth = {
  saveToken: (token: string) => {
    Cookies.set('auth-token', token, {
      expires: 1, // 1 day
      secure: true, // Adjust based on your environment
      sameSite: 'strict',
    });
  },

  getToken: (): string | undefined => {
    return Cookies.get('auth-token');
  },

  // Fetch userId from the decoded token
  getUserId: (): string | null => {
    const token = auth.getToken();
    if (token) {
      const decoded = decodeJWT(token);
      return decoded ? decoded.id : null; // Extract 'id' from the decoded token
    }
    return null;
  },

  logout: async () => {
    Cookies.remove('auth-token');
  },

  isAuthenticated: (): boolean => {
    return !!Cookies.get('auth-token');
  },
};

export default auth;
