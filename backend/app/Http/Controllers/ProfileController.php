<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

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
            'birthday' => $request->birthday,
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

    public function updateAvatar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'required|file|image|max:10240',
        ]);

        if ($validator->fails()) {
            // Write the error to the laravel.log for debugging purposes
            Log::warning('Validation failed for avatar upload:', $validator->errors()->toArray());

            return response()->json([
                'message' => 'Validación fallida',
                'errors' => $validator->errors()->all()
            ], 422);
        }

        try {
            $user = $request->user();

            // Checking if the file has actually been downloaded
            if (!$request->hasFile('avatar')) {
                return response()->json(['message' => 'No se ha subido ningún archivo.'], 400);
            }

            // Delete the old file from the disk
            if ($user->avatar_path) {
                Storage::disk('public')->delete($user->avatar_path);
            }

            $path = $request->file('avatar')->store('avatars', 'public');

            $user->update([
                'avatar_path' => $path,
            ]);

            return response()->json([
                'message' => 'Avatar actualizado con éxito',
                'avatar_path' => $path,
                'avatar_url' => asset('storage/' . $path),
            ]);
        } catch (\Exception $e) {
            Log::error('Error uploading avatar: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
