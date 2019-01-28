<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProjectStatusSetting extends Model
{
    protected $table = 'project_status_settings';

    protected $fillable=[
    		'name', 'order_no', 'hours', 'manual_status_change', 'project_status_settings_order_no',
			'project_status_settings_id'
			];
}
