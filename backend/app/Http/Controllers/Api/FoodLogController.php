<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FoodLog;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

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

    public function destroy(Request $request, $id)
    {
        $log = $request->user()->foodLogs()->findOrFail($id);
        $log->delete();

        return response()->json(['message' => 'Log deleted successfully'], 200);
    }

    public function history(Request $request)
    {
        $userId = $request->user()->id;

        $history = DB::table('food_logs')
            ->join('products', 'food_logs.product_id', '=', 'products.id')
            ->select(
                DB::raw('DATE(food_logs.created_at) as date'),
                DB::raw('SUM(products.kcal * (food_logs.grams / 100)) as total_kcal'),
                DB::raw('SUM(products.protein * (food_logs.grams / 100)) as total_protein'),
                DB::raw('SUM(products.fat * (food_logs.grams / 100)) as total_fat'),
                DB::raw('SUM(products.carbs * (food_logs.grams / 100)) as total_carbs')
            )
            ->where('food_logs.user_id', $userId)
            ->groupBy(DB::raw('DATE(food_logs.created_at)'))
            ->orderBy('date', 'desc')
            ->take(30)
            ->get();

        $formattedHistory = $history->map(function ($day) {
            return [
                'date' => Carbon::parse($day->date)->format('d/m/Y'),
                'kcal' => round($day->total_kcal),
                'protein' => round($day->total_protein, 1),
                'fat' => round($day->total_fat, 1),
                'carbs' => round($day->total_carbs, 1),
            ];
        });

        return response()->json($formattedHistory);
    }
}
