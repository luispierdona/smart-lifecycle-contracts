<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class WasteRegistration extends Model
{
    protected $table = 'waste_registrations';
    public $timestamps = false; // Avoid the error of the 'updated_at' column missing
    protected $fillable = ['material_id', 'weight', 'calculated_co2', 'calculated_tax', 'status'];

    public function material(): BelongsTo {
        return $this->belongsTo(Material::class);
    }

    public function contract(): HasOne {
        return $this->hasOne(Contract::class, 'registration_id');
    }
}