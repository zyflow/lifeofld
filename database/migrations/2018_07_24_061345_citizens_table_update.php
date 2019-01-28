<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CitizensTableUpdate extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('citizens', function (Blueprint $table) {
            $table->dropColumn(['kommune', 'project_status', 'project_manager', 'liggetid', 'meeting_days']);
        });

        Schema::table('citizens', function (Blueprint $table) {
            $table->integer('user_id')->after('id');
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
            $table->integer('meeting_days')->default(0);
            $table->integer('liggetid')->default(0)->nullable();
            $table->string('kommune');
            $table->tinyInteger('project_manager');
            $table->tinyInteger('project_status');
        });

        Schema::table('citizens', function (Blueprint $table) {
            $table->dropColumn(['user_id']);
        });
    }
}
