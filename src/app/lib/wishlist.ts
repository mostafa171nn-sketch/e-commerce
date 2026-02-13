const API_BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

export interface WishlistItem {
  id: number;
  title: string;
  price: number;
  imageCover: string;
}


export const getWishlist = async (token: string): Promise<WishlistItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: 'GET',
      headers: {
        'token': token,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch wishlist: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.message === 'success') {
      return data.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        imageCover: item.imageCover,
      }));
    } else {
      throw new Error(data.message || 'Failed to fetch wishlist');
    }
  } catch (error) {
    throw error;
  }
};

export const addToWishlist = async (productId: number, token: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: 'POST',
      headers: {
        'token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add to wishlist: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.message !== 'success') {
      throw new Error(data.message || 'Failed to add to wishlist');
    }
  } catch (error) {
    throw error;
  }
};

export const removeFromWishlist = async (productId: number, token: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
      method: 'DELETE',
      headers: {
        'token': token,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to remove from wishlist: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.message && data.message.toLowerCase().includes('success')) {
      // Success
    } else {
      throw new Error(data.message || 'Failed to remove from wishlist');
    }
  } catch (error) {
    throw error;
  }
};
