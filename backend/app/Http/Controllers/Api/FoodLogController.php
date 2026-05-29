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

    public function historyWithMeals(Request $request)
    {
        try {
            $userId = $request->user()->id;

            // Получаем все логи с продуктами за последние 30 дней
            $logs = DB::table('food_logs')
                ->join('products', 'food_logs.product_id', '=', 'products.id')
                ->select(
                    'food_logs.*',
                    'products.name as product_name',
                    'products.kcal',
                    'products.protein',
                    'products.fat',
                    'products.carbs'
                )
                ->where('food_logs.user_id', $userId)
                ->orderBy('food_logs.created_at', 'desc')
                ->take(100)
                ->get();

            // Группируем по датам и приемам пищи
            $history = [];

            foreach ($logs as $log) {
                $date = Carbon::parse($log->consumed_at ?? $log->created_at)->format('Y-m-d');
                $mealType = $log->meal_type ?? 'snack'; // если meal_type нет, ставим snack

                // Рассчитываем КБЖУ для этого продукта
                $ratio = $log->grams / 100;
                $itemKcal = $log->kcal * $ratio;
                $itemProtein = $log->protein * $ratio;
                $itemFat = $log->fat * $ratio;
                $itemCarbs = $log->carbs * $ratio;

                if (!isset($history[$date])) {
                    $history[$date] = [
                        'date' => Carbon::parse($date)->format('d/m/Y'),
                        'total_kcal' => 0,
                        'total_protein' => 0,
                        'total_fat' => 0,
                        'total_carbs' => 0,
                        'meals' => []
                    ];
                }

                // Добавляем в соответствующий прием пищи
                if (!isset($history[$date]['meals'][$mealType])) {
                    $history[$date]['meals'][$mealType] = [];
                }

                $history[$date]['meals'][$mealType][] = [
                    'product_name' => $log->product_name,
                    'grams' => $log->grams,
                    'kcal' => round($itemKcal),
                    'protein' => round($itemProtein, 1),
                    'fat' => round($itemFat, 1),
                    'carbs' => round($itemCarbs, 1)
                ];

                // Добавляем в общий итог дня
                $history[$date]['total_kcal'] += $itemKcal;
                $history[$date]['total_protein'] += $itemProtein;
                $history[$date]['total_fat'] += $itemFat;
                $history[$date]['total_carbs'] += $itemCarbs;
            }

            // Округляем итоги и преобразуем в массив
            $result = [];
            foreach ($history as $date => $day) {
                $result[] = [
                    'date' => $day['date'],
                    'total_kcal' => round($day['total_kcal']),
                    'total_protein' => round($day['total_protein'], 1),
                    'total_fat' => round($day['total_fat'], 1),
                    'total_carbs' => round($day['total_carbs'], 1),
                    'meals' => $day['meals']
                ];
            }

            return response()->json($result);
        } catch (\Exception $e) {
            // Возвращаем ошибку для отладки
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }
}
