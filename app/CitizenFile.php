<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CitizenFile extends Model
{
    protected $fillable = ['citizen_id', 'file'];
}
