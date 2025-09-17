// src/api/picsumApi.js
export const fetchPicsumList = async (page = 1, limit = 30) => {
  const response = await fetch(
    `https://picsum.photos/v2/list?page=${page}&limit=${limit}`
  );
  return await response.json();
};
