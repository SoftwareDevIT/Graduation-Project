<?php
namespace App\Http\Controllers\Api\Role;

use App\Http\Controllers\Controller;
use App\Models\User as ModelsUser; // Ensure this is your User model
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
// use App\Models\Role;
use App\Models\User;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::all();
        $users = ModelsUser::all();
        $permissions = Permission::all();
        return $this->success([
            'roles' => $roles,
            'users' => $users,
            'permissions' => $permissions
        ]);
    }
    public function show($id)
    {
        $userWithRoles = User::with('roles')->findOrFail($id);
        return $this->success([
            'user' => $userWithRoles,
            'roles' => $userWithRoles->roles
        ], 'success', 200);

    }


    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);
        return Role::create(['name' => $request->name]);

    }

    public function syncPermissions(Request $request, Role $role)
    {
        return $role->syncPermissions($request->permissions);

    }

    public function syncRoles(Request $request, User $user)
    {
        return $user->syncRoles($request->roles);
    }

    public function destroy(Role $role)
    {
        $role->delete();
        return $this->success([], 'delete succuess', 200);
    }

    public function destroyUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return $this->success([], 'delete succuess', 200);
    }
}
