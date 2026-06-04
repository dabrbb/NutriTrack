<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\UserResource;

class ProfileController extends Controller
{
    /**
     * Muestra el perfil del usuario utilizando un Resource para filtrar campos.
     */
    public function show(Request $request)
    {
        return new UserResource($request->user());
    }

    /**
     * Actualiza la información básica del perfil.
     */
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

        return new UserResource($user);
    }

    /**
     * Cambia la contraseña del usuario tras verificar la actual.
     */
    public function changePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required|string',
            // Usa 'confirmed' para validar contra 'new_password_confirmation'
            'new_password' => ['required', 'string', 'confirmed', Password::defaults()],
        ]);

        // Verifica que la contraseña actual sea correcta antes de permitir el cambio
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

    /**
     * Maneja la subida y sustitución de la foto de perfil (avatar).
     */
    public function updateAvatar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'required|file|image|max:10240', // Máximo 10MB
        ]);

        if ($validator->fails()) {
            // Registra errores de validación en los logs para auditoría
            Log::warning('Validation failed for avatar upload:', $validator->errors()->toArray());

            return response()->json([
                'message' => 'Validación fallida',
                'errors' => $validator->errors()->all()
            ], 422);
        }

        try {
            $user = $request->user();

            if (!$request->hasFile('avatar')) {
                return response()->json(['message' => 'No se ha subido ningún archivo.'], 400);
            }

            // Elimina la imagen anterior del almacenamiento antes de guardar la nueva
            if ($user->avatar_path) {
                Storage::disk('public')->delete($user->avatar_path);
            }

            // Almacena el nuevo archivo en la carpeta 'avatars' dentro del disco público
            $path = $request->file('avatar')->store('avatars', 'public');

            $user->update([
                'avatar_path' => $path,
            ]);

            return new UserResource($user);
        } catch (\Exception $e) {
            Log::error('Error uploading avatar: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
