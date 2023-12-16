import axios from "axios";
import { axiosJWT } from "./userService";

export const getAllProducts = async (search, limit, brand) => {
  let res = {};
  if (search?.length > 0) {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/all-products?filter=name&filter=${search}&limit=${limit}`
    );
  } else {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/all-products?limit=${limit}`
    );
  }
  return res.data;
};

export const getTypeProducts = async (type, page, limit) => {
  if (type) {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/all-products?filter=type&filter=${type}&limit=${limit}&page=${page}`
    );
    return res.data;
  }
};

export const createProducts = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/product/create`,
    data
  );
  return res.data;
};

export const getDetailsProducts = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/details/${id}`
  );
  return res.data;
};

export const updateProduct = async (id, data, access_token) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/product/update/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteProduct = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/product/delete/${id}`,
    {
      headers: {
        tioken: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteManyProduct = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/product/delete-many`,
    data,
    {
      headers: {
        tioken: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllTypeProduct = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/get-all-types`
  );
  return res.data;
};

export const getAllBrandProduct = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/get-all-brand`
  );
  return res.data;
};

export const getAllProductByBrand = async (brand, limit) => {
  if (brand) {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/all-products?filter=brand&filter=${brand}&limit=${limit}`
    );
    return res.data;
  }
};

export const getProductByBrand = async (brand,limit) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/get-all-product-by-brand?brand=brand&brand=${brand}&limit=${limit}`
  );
  return res.data;
};
