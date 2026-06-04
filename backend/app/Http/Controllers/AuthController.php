<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Registra un nuevo usuario en la base de datos.
     */
    public function register(Request $request) {
        // Validación de campos obligatorios, formato de email y unicidad
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed', // 'confirmed' busca un campo 'password_confirmation'
        ]);

        // Si la validación falla, retorna un error 422 (Unprocessable Entity)
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Crea al usuario con la contraseña cifrada mediante bcrypt
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Genera un token de acceso personal (Sanctum)
        $token = $user->createToken('auth_token')->plainTextToken;

        // Retorna la respuesta con el token para iniciar sesión automáticamente
        return response()->json([
            'message' => 'Usuario registrado con éxito',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    /**
     * Autentica al usuario y genera un token de acceso.
     */
    public function login(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Verifica la existencia del usuario
        $user = User::where('email', $request->email)->first();

        // Valida que el usuario exista y la contraseña sea correcta
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        // Crea un nuevo token de acceso para la sesión actual
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Has entrado',
            'token' => $token,
            'user' => $user
        ]);
    }

    /**
     * Revoca el token de acceso del usuario actual.
     */
    public function logout(Request $request) {
        // Elimina el token que está usando el usuario en la solicitud actual
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ]);
    }
}
