import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../../server";
import { Cinema } from "../../../interface/Cinema";
import { Location } from "../../../interface/Location"; 
import { useCinemaContext } from "../../../Context/CinemasContext";

// Define the schema for form validation using Zod
const cinemaSchema = z.object({
  cinema_name: z.string().min(1, "Cinema Name is required."),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits.")
    .regex(/^[0-9]+$/, "Phone number must be numeric."),
  cinema_address: z.string().min(1, "Cinema Address is required."),
  location_id: z.string().nonempty("Location ID is required."),
});

const CinemaForm = () => {
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>(); 
  const isEditMode = Boolean(id);
  const { addCinema, updateCinema } = useCinemaContext();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<Cinema>({
    resolver: zodResolver(cinemaSchema),
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [cinema, setCinema] = useState<Cinema | null>(null); 

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data } = await instance.get(`/location`);
        setLocations(data.data);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    const fetchCinema = async () => {
      if (isEditMode) {
        try {
          const { data } = await instance.get(`/cinema/${id}`);
          setCinema(data.data);
          reset(data.data); 
        } catch (error) {
          console.error("Failed to fetch cinema:", error);
        }
      }
    };

    fetchLocations();
    fetchCinema();
  }, [id, isEditMode, reset]);

  const handleFormSubmit = async (data: Cinema) => {
    try {
      if (isEditMode) {
        await updateCinema(Number(id), data);
        alert("Cinema updated successfully!");
      } else {
        await addCinema(data);
        alert("Cinema added successfully!");
      }
      nav('/admin/cinemas');
      reset(); 
    } catch (error) {
      console.error("Failed to submit form:", error);
      alert("Failed to submit form");
    }
  };

  if (isEditMode && !cinema) return <div>Loading...</div>;

  return (
    <div>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <h1>{isEditMode ? "Edit Cinema" : "Add Cinema"}</h1>

        <div className="mb-3">
          <label htmlFor="cinema_name" className="form-label">Cinema Name</label>
          <input
            type="text"
            className="form-control"
            {...register("cinema_name")}
            defaultValue={cinema?.cinema_name || ""}
          />
          {errors.cinema_name && <span className="text-danger">{errors.cinema_name.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            {...register("phone")}
            defaultValue={cinema?.phone || ""}
          />
          {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="cinema_address" className="form-label">Cinema Address</label>
          <input
            type="text"
            className="form-control"
            {...register("cinema_address")}
            defaultValue={cinema?.cinema_address || ""}
          />
          {errors.cinema_address && <span className="text-danger">{errors.cinema_address.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="location_id" className="form-label">Location ID</label>
          <select
            {...register("location_id")}
            className="form-control"
            defaultValue={cinema?.location_id || ""}
          >
            <option value="">Select Location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.location_name}
              </option>
            ))}
          </select>
          {errors.location_id && <span className="text-danger">{errors.location_id.message}</span>}
        </div>

        <button type="submit" className="btn btn-primary">
          {isEditMode ? "Update Cinema" : "Add Cinema"}
        </button>
      </form>
    </div>
  );
};

export default CinemaForm;
