<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Material extends Model
{
    protected $table = 'materials';
    
    // Disable timestamps as our manual SQL migration only includes created_at
    public $timestamps = false; 

    protected $fillable = ['name', 'slug', 'co2_factor', 'tax_rate'];

    /**
     * Get all waste registrations associated with this material.
     */
    public function registrations(): HasMany
    {
        return $this->hasMany(WasteRegistration::class, 'material_id');
    }
}