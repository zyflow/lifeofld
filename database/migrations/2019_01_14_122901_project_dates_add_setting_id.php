<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ProjectDatesAddSettingId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('project_dates', function (Blueprint $table) {
            $table->integer('project_status_settings_id')->after('user_id');
        });

		Schema::table('projects', function (Blueprint $table) {
			$table->integer('hours_left')->after('project_status_settings_id');
			$table->dropColumn(['liggetid', 'meeting_days']);
		});


    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('project_dates', function (Blueprint $table) {
            $table->dropColumn(['project_status_settings_id']);
        });

		Schema::table('projects', function (Blueprint $table) {
			$table->dropColumn(['hours_left']);
			$table->integer('liggetid')->after('project_status_settings_id');
			$table->integer('meeting_days')->after('project_status_settings_id');
		});
    }
}
