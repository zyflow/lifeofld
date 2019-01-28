<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateCitizens extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('citizens', function (Blueprint $table) {
            $table->string('mobile')->after('email');
            $table->tinyInteger('project_manager')->after('project_status');
            $table->date('meeting')->after('project_manager');
            $table->date('first_contact')->after('meeting');
            $table->date('start')->after('mobile');
            $table->date('visitation')->after('first_contact');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('citizens', function (Blueprint $table) {
            $table->dropColumn(['mobile', 'project_manager', 'meeting', 'first_contact', 'start', 'visitation']);
        });
    }
}
