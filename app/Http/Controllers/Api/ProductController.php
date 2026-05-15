<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    //
     public function store(Request $request) {
        // Validation
        $request->validate([
            'name' => 'required|string',
            'kcal' => 'required|numeric',
            'protein' => 'required|numeric',
            'fat' => 'required|numeric',
            'carbs' => 'required|numeric',
        ]);

        // Create user in db
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
}
