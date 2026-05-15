<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FoodLog extends Model
{
    //
    protected $fillable = [
        'user_id',
        'product_id',
        'grams',
        'meal_type',
        'consumed_at'
    ];

    protected $casts = [
        'consumed_at' => 'datetime:d/m/Y',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
