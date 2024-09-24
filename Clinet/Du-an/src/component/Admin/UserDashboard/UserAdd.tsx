import React, { useState } from 'react';
import './User.css';

const UserAdd: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form data submission (e.g., API call)
        console.log({ name, email, password, image });
    };

    return (
        <div className="user-add-container">
            <h2>Add New User</h2>
            <div className="product-container">
                <div className="product-photo">
               <img src="path/to/tshirt-image.jpg" alt="T-shirt"/>
        
              </div>

            <div className="upload-section">
             {/* <h3>Add Product Photo</h3> */}
        <div className="upload-box">
            <input type="file" id="file-upload" accept="image/png, image/jpeg, image/gif" hidden/>
            <label htmlFor="file-upload" className="upload-label">
                <span>Drop your images here, or <a href="#">click to browse</a></span>
                <p>1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed</p>
            </label>
        </div>
    </div>
</div>

<div className="box-container">
  
        <h3>User Information</h3>

        <form>
            <div className="form-group">
                <label htmlFor="id">ID</label>
                <input type="text" id="id" placeholder="Enter ID"/>
            </div>

            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" placeholder="Enter Username"/>
            </div>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Enter Email"/>
            </div>

            <div className="form-group">
                <label htmlFor="role">Role ID</label>
                <input type="text" id="role" placeholder="Enter Role ID"/>
            </div>

            <div className="form-group">
                <label htmlFor="sex">Sex</label>
                <select id="sex">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="status">Status</label>
                <input type="text" id="status" placeholder="Enter Status"/>
            </div>

            <div className="form-group actions">
                <button type="submit" className='button1'>Submit</button>
            </div>
        </form>
    </div>
</div>
    );
};

export default UserAdd;
