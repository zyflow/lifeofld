<?php

use Faker\Generator as Faker;

$factory->define(\App\Projects::class, function (Faker $faker) {
    return [
			'citizen_id' => \App\Citizens::first()->id,
			'user_id' => 666,
			'kommune_id' => \App\Communes::first()->id,
			'manager_id' => \App\User::first()->id,
			'project_status_settings_id' => \App\ProjectStatusSetting::first()->id,
			'hours_left' => 666,
			'warnings' => 0,
    ];
});
