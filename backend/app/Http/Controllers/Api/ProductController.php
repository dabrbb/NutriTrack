<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Almacena un nuevo producto en la base de datos vinculado al usuario actual.
     */
    public function store(Request $request)
    {
        // Validación de los datos nutricionales ingresados
        $request->validate([
            'name' => 'required|string|max:255',
            'kcal' => 'required|numeric|min:0|max:2000',
            'protein' => 'required|numeric|min:0|max:100',
            'fat' => 'required|numeric|min:0|max:100',
            'carbs' => 'required|numeric|min:0|max:100',
        ]);

        // Creación del producto asociada al ID del usuario autenticado
        $product = Product::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'kcal' => $request->kcal,
            'protein' => $request->protein,
            'fat' => $request->fat,
            'carbs' => $request->carbs,
        ]);

        return response()->json($product, 201);
    }

    /**
     * Obtiene la lista de todos los productos creados por el usuario actual.
     */
    public function index(Request $request)
    {
        return response()->json($request->user()->products, 200);
    }

    /**
     * Elimina un producto específico previa verificación de propiedad.
     */
    public function destroy(Request $request, $id)
    {
        // Busca el producto asegurando que pertenece al usuario autenticado
        $product = $request->user()->products()->findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Producto eliminado'], 200);
    }

    /**
     * Actualiza la información de un producto existente.
     */
    public function update(Request $request, $id)
    {
        // Verifica que el producto existe y pertenece al usuario antes de proceder
        $product = Product::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'kcal' => 'required|numeric|min:0|max:2000',
            'protein' => 'required|numeric|min:0|max:100',
            'fat' => 'required|numeric|min:0|max:100',
            'carbs' => 'required|numeric|min:0|max:100',
        ]);

        // Aplica los cambios validados
        $product->update($validatedData);

        return response()->json($product, 200);
    }
}
