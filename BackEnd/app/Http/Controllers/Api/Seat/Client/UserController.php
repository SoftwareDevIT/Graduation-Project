<?php
namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User; // Ensure this is your User model
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        $roles = Role::all();
        return view('roles.index', compact('users', 'roles')); // Ensure the view handles users
    }

    public function syncRoles(Request $request, User $user)
    {
        $user->syncRoles($request->roles);
        return redirect()->route('roles.index')->with('success', 'Roles updated successfully.');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}
