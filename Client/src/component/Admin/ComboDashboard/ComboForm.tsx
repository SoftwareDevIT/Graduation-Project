import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useComboContext } from "../../../Context/ComboContext"; // Import the Combo context
import { Combo } from "../../../interface/Combo";
import instance from "../../../server";

// Define the schema for form validation using Zod
const comboSchema = z.object({
  combo_name: z.string().min(1, "Combo Name is required."),
  description: z.string().min(1, "Description is required."), // sửa lỗi tên trường thành "description"
  price: z.number().min(1, "Price must be a positive number."),
  volume: z.number().min(1, "Volume must be a positive number."),
});

const ComboForm = () => {
  const { addCombo, updateCombo } = useComboContext(); // Use the Combo context
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<Combo>({
    resolver: zodResolver(comboSchema),
  });

  useEffect(() => {
    const fetchCombo = async () => {
      if (id) {
        try {
          const { data } = await instance.get(`/combo/${id}`);
          reset(data.data); // Reset form with fetched data
        } catch (error) {
          console.error("Failed to fetch combo:", error);
        }
      }
    };

    fetchCombo(); // Fetch combo if ID is present
  }, [id, reset]);

  const handleFormSubmit = async (data: Combo) => {
    try {
      if (id) {
        await updateCombo(Number(id), data); // Update combo with PUT request
        alert("Combo updated successfully!");
      } else {
        await addCombo(data); // Add combo with POST request
        alert("Combo added successfully!");
      }
      nav('/admin/combo'); // Redirect to the combo list page or desired route
    } catch (error) {
      console.error("Failed to submit combo:", error);
      alert("Failed to submit combo");
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="shadow p-4 rounded bg-light">
        <h1 className="text-center mb-4">{id ? "Update Combo" : "Add Combo"}</h1>

        {/* Combo Name Field */}
        <div className="mb-3">
          <label htmlFor="combo_name" className="form-label">Combo Name</label>
          <input
            type="text"
            className={`form-control ${errors.combo_name ? "is-invalid" : ""}`}
            {...register("combo_name")}
          />
          {errors.combo_name && <span className="text-danger">{errors.combo_name.message}</span>}
        </div>

        {/* Description Field */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input
            type="text"
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            {...register("description")}
          />
          {errors.description && <span className="text-danger">{errors.description.message}</span>}
        </div>

        {/* Price Field */}
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="number"
            className={`form-control ${errors.price ? "is-invalid" : ""}`}
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && <span className="text-danger">{errors.price.message}</span>}
        </div>

        {/* Volume Field */}
        <div className="mb-3">
          <label htmlFor="volume" className="form-label">Volume</label>
          <input
            type="number"
            className={`form-control ${errors.volume ? "is-invalid" : ""}`}
            {...register("volume", { valueAsNumber: true })}
          />
          {errors.volume && <span className="text-danger">{errors.volume.message}</span>}
        </div>

        <div className="mb-3">
          <button className="btn btn-primary w-100">{id ? "Update Combo" : "Add Combo"}</button>
        </div>
      </form>
    </div>
  );
};

export default ComboForm;
