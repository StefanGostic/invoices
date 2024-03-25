import { Material } from "@/utils/types";
import { create } from "zustand";

type MaterialStore = {
  materials: Material[];
  chosenMaterials: Material[];
  filteredMaterials: Material[];
  setChosenMaterials: (materials: Material[]) => void;
  setMaterials: (materials: Material[]) => void;
  removeMaterial: (id: string) => void;
  addChosenMaterial: (id: string) => void;
  removeChosenMaterial: (id: string) => void;
  filterMaterialsByName: (query: string) => void;
};

export const useMaterialStore = create<MaterialStore>((set) => ({
  materials: [],
  chosenMaterials: [],
  filteredMaterials: [],
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
      if (
        state.chosenMaterials.find(
          (material: Material) => material.id.toString() === id
        )
      ) {
        return state;
      }
      if (
        material["invoice_line/quantity"] &&
        material["invoice_line/quantity"] > 0
      ) {
        const newMaterial = { ...material, "invoice_line/quantity": 1 };

        return {
          chosenMaterials: [...state.chosenMaterials, newMaterial],
          materials: state.materials.map((material: Material) =>
            material.id.toString() === id
              ? {
                  ...material,
                  selected: true,
                }
              : material
          ),
        };
      } else {
        console.error("Material quantity is 0 or not defined");
        return state;
      }
    });
  },
  removeChosenMaterial: (id: string) => {
    set((state: any) => ({
      chosenMaterials: state.chosenMaterials.filter(
        (material: Material) => material.id !== id
      ),
    }));
  },
  filterMaterialsByName: (query: string) => {
    if (query === "") {
      set((state: any) => ({
        filteredMaterials: [],
      }));
      return;
    }
    set((state: any) => ({
      filteredMaterials: state.materials.filter((material: Material) =>
        material["invoice_line/name"].includes(query)
      ),
    }));
  },
}));
