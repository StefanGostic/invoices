import axios from "axios";

export const postMaterials = async (data: any) => {
  console.log(data);
  return await axios.post("/api/materials", data);
};

export const putMaterialQuantity = async (id: string, quantity: number) => {
  return await axios.put(`/api/materials?id=${id}&quantity=${quantity}`);
};
