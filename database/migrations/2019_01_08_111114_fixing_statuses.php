<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class FixingStatuses extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('project_status')->change();
        });

		Schema::table('citizens', function (Blueprint $table) {
			$table->dropColumn(['status']);
		});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->integer('project_status')->change();
        });

		Schema::table('citizens', function (Blueprint $table) {
			$table->string('status');
		});
    }
}
