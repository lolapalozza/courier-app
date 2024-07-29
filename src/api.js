import axios from "axios";

const apiToken = '1c4c00c76bd2d59902a983d304481a2a';
const telegramId = 1054413208; // for debug API telegramId = 123456
// const apiUrl = "http://localhost:8080"
const apiUrl = "https://debug.soda4d.com";

const httpClient = axios.create({
  baseURL: apiUrl,
  headers: {
    // 'api_token': apiToken,
    // 'telegram_id': telegramId,
    tg_query: 'query_id=AAGYEdk-AAAAAJgR2T7stF57&user=%7B%22id%22%3A1054413208%2C%22first_name%22%3A%22Fyodor%22%2C%22last_name%22%3A%22Khruschov%22%2C%22username%22%3A%22elevenmins%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1721316039&hash=69bf3ee5020e663b85db82e3d321956a28e334929781977249aa46d5eb4df934'
  }
});

export const fetchCities = async () => {
  try {
    const response = await httpClient.get(`${apiUrl}/cities`, {
      headers: {
        'Content-Security-Policy': 'upgrade-insecure-requests'
      },
    });
    console.log('Fetched cities:', response.data);
    return response.data;
  } catch (error) {
    console.error('fetch cities:', error);
    return [];
  }
};

export const fetchProducts = async () => {
  try {
    const response = await httpClient.get(`${apiUrl}/products/all`);
    console.log('Fetched products:', response.data);
    return response.data;
  } catch (error) {
    console.error('fetch products:', error);
    return {};
  }
};

export const fetchDistricts = async (cityId) => {
  try {
    const response = await httpClient.get(`${apiUrl}/cities/${cityId}/districts`, {
      headers: {
        'Content-Security-Policy': 'upgrade-insecure-requests'
      },
    });
    console.log('Fetched districts:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch districts:', error);
    return [];
  }
};

export const fetchPackages = async (productId) => {
  try {
    const response = await httpClient.get(`${apiUrl}/products/${productId}/packages`);
    console.log('Fetched packages:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch packages:', error);
    return [];
  }
};

export const submitDrop = async (formData) => {

  try {
    const response = await httpClient.post(apiUrl + '/drop', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
    });
    return response.data
  } catch(e){
    throw(e)
  }
}
