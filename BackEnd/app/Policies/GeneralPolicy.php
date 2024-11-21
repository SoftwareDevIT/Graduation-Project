<?php

namespace App\Policies;

use App\Models\User;

class GeneralPolicy
{
    /**
     * Kiểm tra xem người dùng có quyền xem bất kỳ model nào không.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'manager']);
    }

    /**
     * Kiểm tra quyền xem một model.
     */
    public function view(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'manager']);
    }

    /**
     * Kiểm tra quyền tạo model.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    /**
     * Kiểm tra quyền cập nhật model.
     */
    public function update(User $user): bool
    {
        return $user->hasRole('admin');
    }

    /**
     * Kiểm tra quyền xóa model.
     */
    public function delete(User $user): bool
    {
        return $user->hasRole('admin');
    }
}
