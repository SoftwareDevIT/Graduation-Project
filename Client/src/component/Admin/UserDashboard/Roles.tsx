import React, { useEffect, useState } from 'react';
import { Roles } from '../../../interface/Roles';
import { User } from '../../../interface/User';
import instance from '../../../server';

const RoleAndUserManagement = () => {
  const [roles, setRoles] = useState<Roles[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newRoleName, setNewRoleName] = useState(''); // State lưu tên vai trò mới
  
  // Fetch roles and users on component mount
  useEffect(() => {
    const fetchRolesAndUsers = async () => {
      try {
        const response = await instance.get('/roles');
        if (response.data.status) {
          setRoles(response.data.data.roles);
          setUsers(response.data.data.users);
        } else {
          console.error('Failed to fetch data:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching roles and users:', error);
      }
    };

    fetchRolesAndUsers();
  }, []);

  // Hàm tạo vai trò mới
  const handleCreateRole = async () => {
    if (!newRoleName) {
      alert('Tên vai trò không thể trống!');
      return;
    }

    try {
      const response = await instance.post('/roles', { name: newRoleName });
      if (response.data.status) {
        // Thêm vai trò mới vào danh sách
        setRoles((prevRoles) => [...prevRoles, response.data.data.roles]);

        // Reset input sau khi tạo thành công
        setNewRoleName('');
      } else {
        console.error('Failed to create role:', response.data.message);
      }
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  // Hàm xóa vai trò
  const handleDeleteRole = async (roleId: string) => {
    try {
      const response = await instance.delete(`/roles/${roleId}`);
      if (response.data.status) {
        // Xóa vai trò khỏi danh sách nếu thành công
        setRoles((prevRoles) => prevRoles.filter((role) => role.id !== roleId));
      } else {
        console.error('Failed to delete role:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  // Hàm xóa người dùng
  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await instance.delete(`/delete-user/${userId}`);
      if (response.data.status) {
        // Xóa người dùng khỏi danh sách nếu thành công
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } else {
        console.error('Failed to delete user:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  const handleAssignRoles = async (userId: number, selectedRoles: string[]) => {
    try {
      // Gửi yêu cầu API để cấp quyền cho người dùng
      const response = await instance.post(`/roles/${userId}/users`, { roles: selectedRoles });
  
      if (response.data.status) {
        alert('Cập nhật quyền thành công!');
        // Cập nhật lại danh sách người dùng hoặc vai trò nếu cần
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, roles: selectedRoles } : user
          )
        );
      } else {
        console.error('Cập nhật quyền thất bại:', response.data.message);
      }
    } catch (error) {
      console.error('Lỗi khi cấp quyền:', error);
    }
  };
  
  
  return (
    <div style={{ backgroundColor: '#ffffff', color: '#000000', padding: '20px', width: '100%', margin: 'auto' }}>
      <h2>Quản lý vai trò và quyền</h2>
      <div style={{ marginBottom: '30px' }}>
        <h3>Tạo vai trò mới</h3>
        <input
          type="text"
          placeholder="Tên vai trò"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: '#f9f9f9',
            color: '#000',
          }}
        />
        <button
          onClick={handleCreateRole}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Tạo vai trò
        </button>

        <h3 style={{ marginTop: '20px' }}>Vai trò hiện có</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Tên vai trò</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Quyền</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{role.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <textarea
                    readOnly
                    value="index\nshow\ncreate\nstore"
                    style={{
                      width: '100%',
                      height: '80px',
                      backgroundColor: '#f9f9f9',
                      color: '#000',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      padding: '5px',
                      resize: 'none',
                    }}
                  ></textarea>
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <button
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginRight: '10px',
                    }}
                  >
                    Cập nhật quyền
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role.id)} // Gọi hàm xóa khi nhấn nút
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Xóa vai trò
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Quản lý người dùng</h2>
      <div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Tên người dùng</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Vai trò</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
  {users.map((user) => (
    <tr key={user.id}>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.user_name}</td>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
        <select
          multiple
          value={user.role_id}  // Giữ trạng thái của các vai trò hiện tại của người dùng
          onChange={(e) => {
            const selectedRoles = Array.from(e.target.selectedOptions, option => option.value);
            handleAssignRoles(user.id, selectedRoles); // Cấp quyền khi chọn vai trò
          }}
          style={{
            width: '100%',
            backgroundColor: '#f9f9f9',
            color: '#000',
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '5px',
          }}
        >
          {roles.map((role) => (
            <option key={role.id} value={role.name}>{role.name}</option>
          ))}
        </select>
      </td>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
       
        <button
          onClick={() => handleDeleteUser(user.id)} // Gọi hàm xóa người dùng
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Xóa người dùng
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default RoleAndUserManagement;
