<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    //
    public function store(Request $request)
    {
        // Validation
        $request->validate([
            'name' => 'required|string',
            'kcal' => 'required|numeric|min:0',
            'protein' => 'required|numeric|min:0',
            'fat' => 'required|numeric|min:0',
            'carbs' => 'required|numeric|min:0',
        ]);

        // Create product in db
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

    public function index(Request $request)
    {
        return response()->json($request->user()->products, 200);
    }

    public function destroy(Request $request, $id)
    {
        $product = $request->user()->products()->findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Producto eliminado'], 200);
    }

    public function update(Request $request, $id)
    {
        $product = Product::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();

        $request->validate([
            'name' => 'required|string',
            'kcal' => 'required|numeric|min:0',
            'protein' => 'required|numeric|min:0',
            'fat' => 'required|numeric|min:0',
            'carbs' => 'required|numeric|min:0',
        ]);

        $product->update([
            'name' => $request->name,
            'kcal' => $request->kcal,
            'protein' => $request->protein,
            'fat' => $request->fat,
            'carbs' => $request->carbs,
        ]);

        return response()->json($product, 200);
    }
}
