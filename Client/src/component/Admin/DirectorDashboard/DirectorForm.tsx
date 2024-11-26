import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../../server";
import { notification } from "antd"; // Import Ant Design's notification component
import { Director } from "../../../interface/Director";

// Define schema for form validation using Zod
const directorSchema = z.object({
  director_name: z.string().min(1, "Tên đạo diễn là bắt buộc."),
  country: z.string().min(1, "Quốc gia là bắt buộc."),
  photo: z.any().optional(),
  link_wiki: z.string().url("Link Wiki phải là URL hợp lệ."),
  descripcion: z
    .string()
    .min(1, "Mô tả là bắt buộc.")
    .max(500, "Mô tả không được vượt quá 500 ký tự."),
});

const DirectorForm = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingPhoto, setExistingPhoto] = useState<string | null>(null); // Store old photo if available
  const [countries, setCountries] = useState<string[]>([]); // To store the list of countries
  const [loadingCountries, setLoadingCountries] = useState<boolean>(true); // Loading state for countries

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<Director>({
    resolver: zodResolver(directorSchema),
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name");
        const data = await response.json();
        setCountries(data.map((country: { name: { common: string } }) => country.name.common));
      } catch (error) {
        console.error("Error fetching countries:", error);
        notification.error({
          message: "Lỗi khi tải danh sách quốc gia",
          description: "Không thể tải danh sách quốc gia từ API.",
        });
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchDirector = async () => {
      if (id) {
        try {
          const { data } = await instance.get(`/director/${id}`);
          reset(data.data); // Reset the form with the fetched data
          setExistingPhoto(data.data.photo);
        } catch (error) {
          console.error("Error fetching director data:", error);
        }
      }
    };

    fetchDirector(); // Fetch director data if an ID is provided
  }, [id, reset]);

  const handleFormSubmit = async (data: Director) => {
    if (!selectedFile) {
      notification.error({
        message: "Lỗi xác thực",
        description: "Ảnh đại diện là bắt buộc!",
        placement: "topRight",
      });
      return;
    }

    const formData = new FormData();
    formData.append("director_name", data.director_name);
    formData.append("country", data.country);
    formData.append("link_wiki", data.link_wiki);
    formData.append("descripcion", data.descripcion || "");

    // Add _method to FormData if it's an update
    if (id) {
      formData.append("_method", "PUT");
    }

    if (selectedFile) {
      formData.append("photo", selectedFile); // Append the selected file to FormData
    }

    try {
      if (id) {
        await instance.post(`/director/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        notification.success({
          message: "Cập nhật đạo diễn thành công!",
        });
      } else {
        await instance.post("/director", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        notification.success({
          message: "Thêm đạo diễn thành công!",
        });
      }
      nav("/admin/director"); // Redirect to director list page
    } catch (error) {
      console.error("Error sending director data:", error);
      notification.error({
        message: "Lỗi khi gửi dữ liệu đạo diễn",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <div className="container mt-5">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="shadow p-4 rounded bg-light"
        encType="multipart/form-data"
      >
        <h1 className="text-center mb-4">
          {id ? "Cập nhật Đạo diễn" : "Thêm Đạo diễn"}
        </h1>

        {/* Director Name */}
        <div className="mb-3">
          <label htmlFor="director_name" className="form-label">
            Tên Đạo diễn
          </label>
          <input
            type="text"
            className={`form-control ${errors.director_name ? "is-invalid" : ""}`}
            {...register("director_name")}
          />
          {errors.director_name && (
            <span className="text-danger">{errors.director_name.message}</span>
          )}
        </div>

        {/* Country */}
        <div className="mb-3">
          <label htmlFor="country" className="form-label">
            Quốc gia
          </label>
          {loadingCountries ? (
            <div>Loading countries...</div>
          ) : (
            <select
              className={`form-control ${errors.country ? "is-invalid" : ""}`}
              {...register("country")}
            >
              <option value="">Chọn quốc gia</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
          )}
          {errors.country && (
            <span className="text-danger">{errors.country.message}</span>
          )}
        </div>

        {/* Photo */}
        <div className="mb-3">
          <label htmlFor="photo" className="form-label">
            Ảnh
          </label>
          {existingPhoto && !selectedFile && (
            <div>
              <img
                src={existingPhoto}
                alt="Đạo diễn"
                style={{ width: "150px", height: "auto" }}
              />
            </div>
          )}
          <input
            type="file"
            className={`form-control ${errors.photo ? "is-invalid" : ""}`}
            accept="image/*"
            onChange={handleFileChange}
          />
          {errors.photo && (
            <span className="text-danger">{errors.photo.message}</span>
          )}
        </div>

        {/* Link Wiki */}
        <div className="mb-3">
          <label htmlFor="link_wiki" className="form-label">
            Link Wiki (URL)
          </label>
          <input
            type="text"
            className={`form-control ${errors.link_wiki ? "is-invalid" : ""}`}
            {...register("link_wiki")}
          />
          {errors.link_wiki && (
            <span className="text-danger">{errors.link_wiki.message}</span>
          )}
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">
            Mô tả
          </label>
          <textarea
            className={`form-control ${errors.descripcion ? "is-invalid" : ""}`}
            {...register("descripcion")}
          ></textarea>
          {errors.descripcion && (
            <span className="text-danger">{errors.descripcion.message}</span>
          )}
        </div>

        <div className="mb-3">
          <button className="btn btn-primary w-100">
            {id ? "Cập nhật Đạo diễn" : "Thêm Đạo diễn"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DirectorForm;
