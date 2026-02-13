const API_BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

export async function signUp(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error(data.message || 'Invalid data provided. Please check all fields.');
      } else if (response.status === 409) {
        throw new Error('This email is already registered. Please use a different email or try logging in.');
      } else if (response.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(data.message || 'Sign up failed. Please try again.');
      }
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function signIn(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Sign in failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function verifyToken(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verifyToken`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Token verification failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getUserProfile(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verifyToken`, {
      method: 'GET',
      headers: {
        'token': token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get user profile');
    }

    return {
      message: 'success',
      user: {
        id: data.decoded?.id || '',
        name: data.decoded?.name || '',
        email: data.decoded?.email || '',
      },
    };
  } catch (error) {
    throw error;
  }
}

export async function updateUserProfile(token, userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'token': token,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update user profile');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function forgotPassword(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgotPasswords`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send reset code');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function verifyResetCode(email, resetCode) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verifyResetCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, resetCode }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Invalid reset code');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function resetPassword(email, newPassword, resetCode) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/resetPassword`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, newPassword, resetCode }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to reset password');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function changePassword(token, passwords) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/changeMyPassword`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'token': token,
      },
      body: JSON.stringify(passwords),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to change password');
    }

    return data;
  } catch (error) {
    throw error;
  }
}
