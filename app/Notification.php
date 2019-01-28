<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
	protected $table = 'notifications';

    protected $fillable = [
        'message', 'type', 'project_id', 'seen'
    ];
}
