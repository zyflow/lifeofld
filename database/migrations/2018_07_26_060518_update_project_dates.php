<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateProjectDates extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('project_dates', function (Blueprint $table) {
            $table->integer('project_id')->after('id');
        });

        Schema::table('project_dates', function (Blueprint $table) {
            $table->dropColumn(['citizen_id']);
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
            $table->dropColumn(['project_id']);
        });

        Schema::table('project_dates', function (Blueprint $table) {
            $table->integer('citizen_id')->after('id');
        });
    }
}
