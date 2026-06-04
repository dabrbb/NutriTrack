<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FoodLog extends Model
{
    /**
     * Los atributos que se pueden asignar masivamente.
     * Esto protege contra la asignación masiva de campos no deseados.
     */
    protected $fillable = [
        'user_id',
        'product_id',
        'grams',
        'meal_type',
        'consumed_at'
    ];

    /**
     * Conversión de atributos.
     * 'consumed_at' se convierte automáticamente a una instancia de Carbon 
     * y se formatea al recuperar el valor.
     */
    protected $casts = [
        'consumed_at' => 'datetime:d/m/Y',
    ];

    /**
     * Define la relación: Un registro de comida pertenece a un producto.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Define la relación: Un registro de comida pertenece a un usuario.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
