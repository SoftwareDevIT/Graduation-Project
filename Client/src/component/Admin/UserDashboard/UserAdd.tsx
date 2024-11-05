import React from 'react';

const RoleAndUserManagement = () => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '20px',
        
        width: '100%',
        margin: 'auto',
     
      }}
    >
      <h2>Quản lý vai trò và quyền</h2>
      <div style={{ marginBottom: '30px' }}>
        <h3>Tạo vai trò mới</h3>
        <input
          type="text"
          placeholder="Tên vai trò"
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: '#f9f9f9',
            color: '#000'
          }}
        />
        <button
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Tạo vai trò
        </button>

        <h3 style={{ marginTop: '20px' }}>Vai trò hiện có</h3>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px'
          }}
        >
          <thead>
            <tr>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Tên vai trò</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Quyền</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {['admin', 'manager', 'staff', 'user'].map((role) => (
              <tr key={role}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{role}</td>
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
                      resize: 'none'
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
                      marginRight: '10px'
                    }}
                  >
                    Cập nhật quyền
                  </button>
                  <button
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '5px',
                      cursor: 'pointer'
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
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px'
          }}
        >
          <thead>
            <tr>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Tên người dùng</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Vai trò</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {['Admin', 'manager', 'staff', 'User'].map((user) => (
              <tr key={user}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <select
                    multiple
                    style={{
                      width: '100%',
                      backgroundColor: '#f9f9f9',
                      color: '#000',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      padding: '5px'
                    }}
                  >
                    <option>admin</option>
                    <option>manager</option>
                    <option>staff</option>
                    <option>user</option>
                  </select>
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
                      marginRight: '10px'
                    }}
                  >
                    Cập nhật vai trò
                  </button>
                  <button
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '5px',
                      cursor: 'pointer'
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
