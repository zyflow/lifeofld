<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DateNotifications extends Model
{
    protected $fillable = [
        'citizen_id', 'name', 'days_left', 'visible'
    ];
}
