<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FoodLog;
use App\Models\Product;
use Illuminate\Http\Request;

use function Symfony\Component\Clock\now;

class FoodLogController extends Controller
{
    //

    public function index(Request $request) {
        return $request->user()->foodLogs()
        ->whereDate('consumed_at', now()->format('Y-m-d'))
        ->with('product')
        ->get();
    }

    public function store(Request $request) {
        
    $request->validate([
        'product_id' => 'required|exists:products,id',
        'grams' => 'required|numeric|min:1',
        'meal_type' => 'required|string',
    ]);

        $product = Product::findOrFail($request->product_id);
        $grams = $request->grams;

        $kcal = ($product->kcal / 100) * $grams;
        $protein = ($product->protein / 100) * $grams;
        $fat = ($product->fat / 100) * $grams;
        $carbs = ($product->carbs / 100) * $grams;

        return FoodLog::create([
            'user_id' => $request->user()->id,
            'product_id' => $product->id,
            'grams' => $grams,
            'meal_type' => $request->meal_type,
            'consumed_at' => now()->format('Y-m-d'),
        ]);
    }

}
