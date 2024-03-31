import axios from "axios";

export const postMaterials = async (data: any) => {
  console.log(data);
  return await axios.post("/api/materials", data);
};
