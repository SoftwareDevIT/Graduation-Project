<?php
namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\User as ModelsUser; // Ensure this is your User model
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        // Fetch all roles and users
        $roles = Role::all(); // Use Role model to get roles
        $users = ModelsUser::all(); // Ensure this is your User model
        $permissions = Permission::all(); // Get all permissions

        return view('roles.index', compact('roles', 'users', 'permissions'));
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);
        Role::create(['name' => $request->name]); // Create role instead of user
        return redirect()->route('roles.index')->with('success', 'Role created successfully.');
    }

    public function syncPermissions(Request $request, Role $role)
    {
        $role->syncPermissions($request->permissions);
        return redirect()->route('roles.index')->with('success', 'Permissions updated successfully.');
    }

    public function destroy(Role $role) // Inject the Role model directly
    {
        $role->delete();
        return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
    }
}
