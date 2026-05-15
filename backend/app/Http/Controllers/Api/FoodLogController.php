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

    public function index(Request $request)
    {
        return $request->user()->foodLogs()
            ->whereDate('consumed_at', now()->format('Y-m-d'))
            ->with('product')
            ->get();
    }

    public function store(Request $request)
    {

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

    public function getTotals(Request $request)
    {
        $logs = $request->user()->foodLogs()
            ->whereDate('consumed_at', now()->format('Y-m-d'))
            ->with('product')
            ->get();

        $kcal = 0;
        $p = 0;
        $f = 0;
        $c = 0;

        foreach ($logs as $log) {
            $ratio = $log->grams / 100;
            $kcal += ($log->product->kcal * $ratio);
            $p += ($log->product->protein * $ratio);
            $f += ($log->product->fat * $ratio);
            $c += ($log->product->carbs * $ratio);
        }

        return response()->json([
            'kcal' => round($kcal),
            'protein' => round($p, 1),
            'fat' => round($f, 1),
            'carbs' => round($c, 1)
        ]);
    }
}
