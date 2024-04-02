import axios from "axios";

export const postMaterials = async (data: any) => {
  return await axios.post("/api/materials", data);
};

export const putMaterialQuantity = async (id: string, quantity: number) => {
  return await axios.put(`/api/materials?id=${id}&quantity=${quantity}`);
};

export const patchMaterial = async (id: string, data: any) => {
  return await axios.patch(`/api/materials?id=${id}`, data);
};

export const deleteMaterials = async (ids: number[]) => {
  return await axios.delete("/api/materials", { data: ids });
};
