<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateProjectDatesAddTimestamps extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('project_dates', function (Blueprint $table) {
        	$table->dropColumn(['start']);
            $table->timestamp('startdate')->after('user_id');
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
			$table->date('start')->after('user_id')->change();
			$table->dropColumn(['startdate']);
		});
    }
}
