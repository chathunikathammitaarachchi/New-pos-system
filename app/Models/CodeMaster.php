<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CodeMaster extends Model
{
    protected $table = 'code_master';
    protected $fillable = ['conkey', 'concode', 'catkey', 'cname'];
    public $timestamps = true;
}