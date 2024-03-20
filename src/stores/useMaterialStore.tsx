import { Material } from "@/utils/types";
import { create } from "zustand";

type MaterialStore = {
  materials: Material[];
  chosenMaterials: Material[];
  setChosenMaterials: (materials: Material[]) => void;
  setMaterials: (materials: Material[]) => void;
  removeMaterial: (id: string) => void;
  addChosenMaterial: (id: string) => void;
  removeChosenMaterial: (id: string) => void;
};

export const useMaterialStore = create<MaterialStore>((set) => ({
  materials: [],
  chosenMaterials: [],
  setChosenMaterials: (materials) => set({ chosenMaterials: materials }),
  setMaterials: (materials) => set({ materials }),
  removeMaterial: (id: string) => {
    set((state: any) => ({
      materials: state.materials.filter(
        (material: Material) => material.id !== id
      ),
    }));
  },
  addChosenMaterial: (id: string) => {
    set((state: any) => {
      const material = state.materials.find(
        (material: Material) => material.id.toString() === id
      );
      const newMaterial = { ...material, "invoice_line/quantity": 1 };

      return {
        chosenMaterials: [...state.chosenMaterials, newMaterial],
      };
    });
  },
  removeChosenMaterial: (id: string) => {
    set((state: any) => ({
      chosenMaterials: state.chosenMaterials.filter(
        (material: Material) => material.id !== id
      ),
    }));
  },
}));
