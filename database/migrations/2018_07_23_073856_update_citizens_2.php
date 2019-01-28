<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateCitizens2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('citizens', function (Blueprint $table) {
            $table->dropColumn(['meeting', 'first_contact', 'start', 'visitation']);
            $table->integer('meeting_days')->default(0)->after('liggetid');
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
            $table->date('meeting')->after('project_manager');
            $table->date('first_contact')->after('meeting');
            $table->date('start')->after('mobile');
            $table->date('visitation')->after('first_contact');
            $table->dropColumn(['meeting_days']);
        });
    }
}
