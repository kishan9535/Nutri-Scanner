import axios from 'axios';

interface ProductDetails {
  product_name: string;
  brands: string;
  image_url: string;
  ingredients_text: string;
  nutriments: {
    [key: string]: number;
  };
  tags?: string[];
}

export async function getProductDetails(barcode: string): Promise<ProductDetails> {
  try {
    const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    if (response.data.status === 1) {
      const product = response.data.product;
      return {
        product_name: product.product_name || 'Unknown Product',
        brands: product.brands || 'Unknown Brand',
        image_url: product.image_url || '',
        ingredients_text: product.ingredients_text || 'No ingredients information available',
        nutriments: product.nutriments || {},
        tags: product.categories_tags || [],
      };
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error(`Failed to fetch product details: ${error.message}`);
    }
    throw new Error('An unexpected error occurred');
  }
}
