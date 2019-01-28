<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateProjectTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->renameColumn('kommune', 'kommune_id');
            $table->renameColumn('project_manager', 'project_manager_id');
            $table->string('project_activity')->nullable()->change();
            $table->string('liggetid')->nullable()->change();
            $table->string('meeting_days')->nullable()->change();
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
			$table->renameColumn('kommune_id', 'kommune');
			$table->renameColumn('project_manager_id', 'project_manager');
			$table->string('project_activity')->change();
			$table->string('liggetid')->change();
			$table->string('meeting_days')->change();
		});
    }
}
