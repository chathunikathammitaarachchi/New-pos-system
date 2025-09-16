<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ControllerMaster extends Model
{
    protected $table = 'controller_master';
    protected $fillable = ['concode', 'conkey', 'conname'];
    public $timestamps = true;
}