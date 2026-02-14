<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    protected $table = 'contracts';
    public $timestamps = false;
    protected $fillable = ['registration_id', 'contract_number', 'terms', 'expiry_date'];
}