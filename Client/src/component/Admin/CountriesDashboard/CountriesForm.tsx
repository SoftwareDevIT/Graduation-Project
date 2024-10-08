import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useCountryContext } from '../../../Context/CountriesContext';
import { Location } from '../../../interface/Location';
import instance from '../../../server';

const countrySchema = z.object({
  location_name: z.string().min(1, "Location Name is required."),
});

const CountriesForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { addCountry, updateCountry } = useCountryContext();
  const nav = useNavigate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Location>({
    resolver: zodResolver(countrySchema),
  });

  useEffect(() => {
    const fetchCountry = async () => {
      if (isEditMode) {
        try {
          const response = await instance.get(`/location/${id}`);
          reset(response.data); // Reset form with fetched data
        } catch (error) {
          console.error("Failed to fetch country:", error);
        }
      }
    };
    
    fetchCountry();
  }, [id, isEditMode, reset]);

  const handleFormSubmit = async (data: Location) => {
    try {
      if (isEditMode) {
        await updateCountry(Number(id), data);
        alert("Country updated successfully!");
      } else {
        await addCountry(data);
        alert("Country added successfully!");
      }
      reset(); // Reset the form after submission
      nav('/admin/countries'); // Redirect after resetting
    } catch (error) {
      console.error("Failed to submit form:", error);
      alert("Failed to submit form");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <h1>{isEditMode ? "Edit Country" : "Add Country"}</h1>
        
        <div className="mb-3">
          <label htmlFor="location_name" className="form-label">Country Name</label>
          <input
            type="text"
            className="form-control"
            {...register("location_name")}
          />
          {errors.location_name && <span className="text-danger">{errors.location_name.message}</span>}
        </div>

        <button type="submit" className="btn btn-primary">
          {isEditMode ? "Update Country" : "Add Country"}
        </button>
      </form>
    </div>
  );
};

export default CountriesForm;
