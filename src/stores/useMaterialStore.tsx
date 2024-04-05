import { Material } from "@/utils/types";
import { create } from "zustand";
import {
  patchMaterial,
  postMaterials,
  putMaterialQuantity,
  deleteMaterials,
} from "@/app/axios/materialsApi";

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
  updateMaterialQuantity: (id: string, quantity: number) => void;
  updateMaterial: (id: string, newMaterial: Material) => void;
  deleteMaterials: (ids: number[]) => void;
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
        material["invoice_line/name"]
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase())
      ),
    }));
  },
  updateMaterialQuantity: (id: string, quantity: number) => {
    set((state: any) => {
      const material = state.materials.find(
        (material: Material) => material.id.toString() === id.toString()
      );
      if (!material) {
        return state;
      }

      material["invoice_line/quantity"] -= quantity;
      material["invoice_line/price_subtotal"] -=
        quantity *
        material["invoice_line/price_unit"] *
        ((material["invoice_line/discount"] || 100) / 100);
      material["invoice_line/price_subtotal"] = parseFloat(
        material["invoice_line/price_subtotal"].toFixed(2)
      );
      material["isModified"] = true;
      const newMaterials = state.materials.map((material: Material) =>
        material.id.toString() === id ? { ...material } : material
      );

      putMaterialQuantity(
        material.id,
        material["invoice_line/quantity"],
        material["invoice_line/price_subtotal"]
      );
      return {
        materials: newMaterials,
      };
    });
  },
  updateMaterial: (id: string, newMaterial: Material) => {
    set((state: any) => {
      const material = state.materials.find(
        (material: Material) => material.id.toString() === id.toString()
      );
      if (!material) {
        return state;
      }
      const newMaterials = state.materials.map((material: Material) =>
        material.id.toString() === id ? { ...newMaterial } : material
      );

      patchMaterial(id, newMaterial);
      return {
        materials: newMaterials,
      };
    });
  },
  deleteMaterials: (ids: number[]) => {
    set((state: any) => {
      const newMaterials = state.materials.filter(
        (material: Material) => !ids.includes(parseInt(material.id))
      );

      deleteMaterials(ids);
      return {
        materials: newMaterials,
      };
    });
  },
}));
