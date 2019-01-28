<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectDates extends Model
{
	use SoftDeletes; // in case of something, prevent accedental deletion of project dates :) they are important

    public $fillable = [
        'project_id', 'user_id', 'status',
		'start', 'first_contact', 'meeting',
		'commenced', 'material_sent_subject',
		'material_sent_municipality', 'invoice',
		'return', 'project_status_settings_id', 'status_date'
    ];

    public function settings()
	{
		return $this->hasOne(ProjectStatusSetting::class, 'id', 'project_status_settings_id');
	}

}
