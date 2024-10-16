import axios from "axios";

const telegramId = 2030741211; //this is for local development

const apiUrl = process.env.REACT_APP_API_URL;


export const httpClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'telegram_id': telegramId,
    "app": "courier"
  }
});

export const fetchCities = async () => {
  try {
    const response = await httpClient.get(`${apiUrl}/cities`);
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
    const response = await httpClient.get(`${apiUrl}/cities/${cityId}/districts`);
    console.log('Fetched districts:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch districts:', error);
    return [];
  }
};

export const fetchCouriers = async () => {
  try {
    const response = await httpClient.get(`${apiUrl}/couriers`);
    console.log('Fetched couriers:', response.data);
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
    return {
      success: false,
      error: e.message
    }
  }
}

export const getUser = async() => {
  const user = await httpClient.get(apiUrl + `/user`)
  return user.data;
}

export const getDrops = async({userId, offset=0, limit=10}) => {
  const params = new URLSearchParams();
  params.append('limit', limit);
  params.append('offset', offset);
  const queryString = params.toString();

  const response = await httpClient.get(apiUrl + `/courier/${userId}/drops?${queryString}`)
  return response.data;
}

export const getDropById = async(dropId) => {
  const response = await httpClient.get(apiUrl + `/drop?drop_id=${dropId}`)
  return response.data
}

export const deleteDrop = async(dropId) => {
  const response = await httpClient.delete(apiUrl + `/drop/${dropId}`)
  return response.data
}
