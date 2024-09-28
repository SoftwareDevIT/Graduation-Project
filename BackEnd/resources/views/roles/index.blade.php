{{-- resources/views/roles/index.blade.php --}}
@extends('layouts.app')

@section('content')
    <div class="container">
        <h1>Quản lý vai trò và quyền</h1>

        <div class="card mb-4">
            <div class="card-header">Tạo vai trò mới</div>
            <div class="card-body">
                <form action="{{ route('roles.store') }}" method="POST">
                    @csrf
                    <div class="form-group">
                        <label for="role_name">Tên vai trò</label>
                        <input type="text" class="form-control" id="role_name" name="name" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Tạo vai trò</button>
                </form>
            </div>
        </div>

        <h2>Vai trò hiện có</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>Tên vai trò</th>
                    <th>Quyền</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($roles as $role)
                    <tr>
                        <td>{{ $role->name }}</td>
                        <td>
                            <form action="{{ route('roles.permissions.sync', $role) }}" method="POST">
                                @csrf
                                <select multiple class="form-control" name="permissions[]" id="permissions">
                                    @foreach ($permissions as $permission)
                                        <option value="{{ $permission->id }}"
                                            {{ $role->hasPermissionTo($permission->name) ? 'selected' : '' }}>
                                            {{ $permission->name }}
                                        </option>
                                    @endforeach
                                </select>
                                <button type="submit" class="btn btn-success mt-2">Cập nhật quyền</button>
                            </form>
                        </td>
                        <td>
                            <form action="{{ route('roles.destroy', $role->id) }}" method="POST">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger">Xóa vai trò</button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <h2>Quản lý người dùng</h2>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th>Tên người dùng</th>
                    <th>Vai trò</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($users as $user)
                    <tr>
                        <td>{{ $user->fullname }}</td>
                        <td>
                            <form action="{{ route('users.roles.sync', $user) }}" method="POST">
                                @csrf
                                <select multiple class="form-control" name="roles[]" id="user_roles">
                                    @foreach ($roles as $role)
                                        <option value="{{ $role->id }}"
                                            {{ $user->hasRole($role->name) ? 'selected' : '' }}>
                                            {{ $role->name }}
                                        </option>
                                    @endforeach
                                </select>
                                <button type="submit" class="btn btn-success mt-2">Cập nhật vai trò</button>
                            </form>
                        </td>
                        <td>
                            <form action="{{ route('users.destroy', $user->id) }}" method="POST">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger">Xóa người dùng</button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection
