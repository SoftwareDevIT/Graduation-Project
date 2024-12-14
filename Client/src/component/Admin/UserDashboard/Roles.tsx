import React, { useEffect, useState } from 'react';
import { Roles } from '../../../interface/Roles';
import { User } from '../../../interface/User';
import { Permission } from '../../../interface/Permissions';
import instance from '../../../server';

const RoleAndUserManagement = () => {
  const [roles, setRoles] = useState<Roles[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const fetchRolesAndUsers = async () => {
      try {
        const response = await instance.get('/admin/roles');
        if (response.data.status) {
          setRoles(response.data.data.roles);
          setUsers(response.data.data.users);
          setPermissions(response.data.data.permissions);
        } else {
          console.error('Failed to fetch data:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching roles and users:', error);
      }
    };
    fetchRolesAndUsers();
  }, []);

  const handleCreateRole = async () => {
    if (!newRoleName) {
      alert('Tên vai trò không thể trống!');
      return;
    }
    try {
      const response = await instance.post('/admin/roles', { name: newRoleName });
      if (response.data.status) {
        setRoles((prevRoles) => [...prevRoles, response.data.data.roles]);
        setNewRoleName('');
      } else {
        console.error('Failed to create role:', response.data.message);
      }
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      const response = await instance.delete(`/admin/roles/${roleId}`);
      if (response.data.status) {
        setRoles((prevRoles) => prevRoles.filter((role) => role.id !== roleId));
      } else {
        console.error('Failed to delete role:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };
  const handleAssignRoles = async (userId: number, selectedRoles: string[]) => {
    // Kiểm tra xem vai trò có phải là "manager" hoặc "staff" không
    const selectedRoleNames = selectedRoles.map(role => role.toLowerCase());
    const isManagerOrStaff = selectedRoleNames.includes('manager');
  
    // Nếu người dùng chọn "manager" hoặc "staff", yêu cầu nhập cinema_id
    let cinemaId: string | null = null;
    if (isManagerOrStaff) {
      cinemaId = prompt("Please enter Cinema ID:");
      if (!cinemaId) {
        alert("Cinema ID is required for manager or staff roles!");
        return;  // Dừng lại nếu không có cinema_id
      }
    }
  
    try {
      // Tạo payload yêu cầu
      const requestPayload: { roles: string[], cinema_id?: string } = {
        roles: selectedRoles,
      };
  
      // Nếu có cinemaId, thêm vào payload
      if (cinemaId) {
        requestPayload.cinema_id = cinemaId;
      }
  
      // Gửi yêu cầu API để đồng bộ vai trò
      const response = await instance.post(`/admin/roles/${userId}/users`, requestPayload);
  
      if (response.data.status) {
        alert('Cập nhật quyền thành công!');
        // Cập nhật vai trò của người dùng trong giao diện
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
  
  
  const handleUpdatePermissions = async (roleId: string) => {
    const permissionsToUpdate = selectedPermissions[roleId]?.map((permissionName) => {
      const permission = permissions.find((p) => p.name === permissionName);
      return { id: permission?.id, name: permissionName };
    });
  
    console.log("Permissions to Update:", permissionsToUpdate); // Debugging line
  
    try {
      const response = await instance.post(`/admin/roles/${roleId}/permissions`, {
        permissions: permissionsToUpdate,
      });
      console.log("API Response:", response); // Debugging line
      if (response.data.status) {
        alert('Cập nhật quyền thành công!');
      } else {
        console.error('Failed to update permissions:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };
  

  const handlePermissionChange = (roleId: string, selectedOptions: string[]) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [roleId]: selectedOptions,
    }));
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
                  <select
                    multiple
                    value={selectedPermissions[role.id] || []}
                    onChange={(e) =>
                      handlePermissionChange(
                        role.id,
                        Array.from(e.target.selectedOptions, (option) => option.value)
                      )
                    }
                    style={{
                      width: '100%',
                      backgroundColor: '#f9f9f9',
                      color: '#000',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      padding: '5px',
                    }}
                  >
                    {permissions.map((permission) => (
                      <option key={permission.id} value={permission.name}>
                        {permission.name}
                      </option>
                    ))}
                  </select>
                </td>

                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <button
                    onClick={() => handleUpdatePermissions(role.id)}
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
                    onClick={() => handleDeleteRole(role.id)}
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
    
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default RoleAndUserManagement;
