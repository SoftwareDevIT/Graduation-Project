import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import instance from "../../../server";
import { Cinema } from "../../../interface/Cinema";
import { Location } from "../../../interface/Location"; // Assuming you have Location interface

const cinemaSchema = z.object({
  cinema_name: z.string().min(1, "Cinema Name is required."),
  phone: z.string().min(10, "Phone number must be at least 10 digits.").regex(/^[0-9]+$/, "Phone number must be numeric."),
  cinema_address: z.string().min(1, "Cinema Address is required."),
  location_id: z.string(),
  status: z.enum(["Show", "Hidden"], { errorMap: () => ({ message: "Status is required." }) }),
});

const CinemasAdd = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<Cinema>({
    resolver: zodResolver(cinemaSchema),
  });

  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data } = await instance.get(`/location`); // Fetch locations
        setLocations(data.data);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const handleFormSubmit = async (data: Cinema) => {
    try {
      await instance.post('/cinema', data); // Add cinema with POST request
      alert("Cinema added successfully!");
      reset(); // Reset form after adding
    } catch (error) {
      console.error("Failed to add cinema:", error);
      alert("Failed to add cinema");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <h1>Add Cinema</h1>

        <div className="mb-3">
          <label htmlFor="cinema_name" className="form-label">Cinema Name</label>
          <input
            type="text"
            className="form-control"
            {...register("cinema_name")}
          />
          {errors.cinema_name && <span className="text-danger">{errors.cinema_name.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            {...register("phone")}
          />
          {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="cinema_address" className="form-label">Cinema Address</label>
          <input
            type="text"
            className="form-control"
            {...register("cinema_address")}
          />
          {errors.cinema_address && <span className="text-danger">{errors.cinema_address.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="location_id" className="form-label">Location ID</label>
          <select {...register("location_id")} className="form-control">
            <option value="">Select Location</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>{location.location_name}</option>
            ))}
          </select>
          {errors.location_id && <span className="text-danger">{errors.location_id.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="form-label">Status</label>
          <select {...register("status")} className="form-control">
            <option value="">Select Status</option>
            <option value="Show">Show</option>
            <option value="Hidden">Hidden</option>
          </select>
          {errors.status && <span className="text-danger">{errors.status.message}</span>}
        </div>

        <div className="mb-3">
          <button className="btn btn-primary w-100">Add Cinema</button>
        </div>
      </form>
    </div>
  );
};

export default CinemasAdd;
