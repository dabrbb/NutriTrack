<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'height' => 'nullable|integer|min:30|max:300',
            'weight' => 'nullable|numeric|min:1|max:500',
            'birthday' => 'nullable|date',
        ]);

        $user->update([
            'name' => $request->name,
            'height' => $request->height,
            'weight' => $request->weight,
            'birthday' => $request->birth_date,
        ]);

        return response()->json([
            'message' => 'Perfil actualizado con éxito',
            'user' => $user
        ]);
    }

    public function changePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required|string',
            'new_password' => ['required', 'string', 'confirmed', Password::defaults()],
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'La contraseña actual no coincide.'
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json([
            'message' => 'Contraseña actualizada con éxito'
        ]);
    }
}
