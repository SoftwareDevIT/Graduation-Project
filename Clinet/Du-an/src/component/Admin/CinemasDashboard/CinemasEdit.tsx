import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams } from "react-router-dom"; // Import useParams to get the cinema ID
import instance from "../../../server";
import { Cinema } from "../../../interface/Cinema";
import { Location } from "../../../interface/Location"; // Assuming you have a Location interface

const cinemaSchema = z.object({
  cinema_name: z.string().min(1, "Cinema Name is required."),
  phone: z.string().min(10, "Phone number must be at least 10 digits.").regex(/^[0-9]+$/, "Phone number must be numeric."),
  cinema_address: z.string().min(1, "Cinema Address is required."),
  location_id: z.string().nonempty("Location ID is required."),
  status: z.enum(["Show", "Hidden"], { errorMap: () => ({ message: "Status is required." }) }),
});

const CinemasEdit = () => {
  const { id } = useParams<{ id: string }>(); // Get cinema ID from URL parameters
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<Cinema>({
    resolver: zodResolver(cinemaSchema),
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [cinema, setCinema] = useState<Cinema | null>(null); // State to hold the existing cinema data

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data } = await instance.get(`/location`); // Fetch locations
        setLocations(data.data);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    const fetchCinema = async () => {
      try {
        const { data } = await instance.get(`/cinema/${id}`); // Fetch cinema by ID
        setCinema(data.data);
        reset(data.data); // Reset the form with existing cinema data
      } catch (error) {
        console.error("Failed to fetch cinema:", error);
      }
    };

    fetchLocations();
    fetchCinema();
  }, [id, reset]);

  const handleFormSubmit = async (data: Cinema) => {
    try {
      await instance.patch(`/cinema/${id}`, data); // Update cinema with PUT request
      alert("Cinema updated successfully!");
      reset(); // Reset form after updating
    } catch (error) {
      console.error("Failed to update cinema:", error);
      alert("Failed to update cinema");
    }
  };

  if (!cinema) return <div>Loading...</div>; // Loading state while fetching cinema data

  return (
    <div>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <h1>Edit Cinema</h1>

        <div className="mb-3">
          <label htmlFor="cinema_name" className="form-label">Cinema Name</label>
          <input
            type="text"
            className="form-control"
            {...register("cinema_name")}
            defaultValue={cinema.cinema_name} // Set default value from fetched cinema
          />
          {errors.cinema_name && <span className="text-danger">{errors.cinema_name.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            {...register("phone")}
            defaultValue={cinema.phone} // Set default value from fetched cinema
          />
          {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="cinema_address" className="form-label">Cinema Address</label>
          <input
            type="text"
            className="form-control"
            {...register("cinema_address")}
            defaultValue={cinema.cinema_address} // Set default value from fetched cinema
          />
          {errors.cinema_address && <span className="text-danger">{errors.cinema_address.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="location_id" className="form-label">Location ID</label>
          <select {...register("location_id")} className="form-control" defaultValue={cinema.location_id}>
            <option value="">Select Location</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>{location.location_name}</option>
            ))}
          </select>
          {errors.location_id && <span className="text-danger">{errors.location_id.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="form-label">Status</label>
          <select {...register("status")} className="form-control" defaultValue={cinema.status}>
            <option value="">Select Status</option>
            <option value="Show">Show</option>
            <option value="Hidden">Hidden</option>
          </select>
          {errors.status && <span className="text-danger">{errors.status.message}</span>}
        </div>

        <div className="mb-3">
          <button className="btn btn-primary w-100">Update Cinema</button>
        </div>
      </form>
    </div>
  );
};

export default CinemasEdit;
