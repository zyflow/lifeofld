<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveProjectAttributesMuni extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('municipalities', function (Blueprint $table) {
            $table->dropColumn(['project_manager', 'project_status']);
        });

        Schema::table('municipalities', function (Blueprint $table) {
            $table->integer('contact_person')->after('region');
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
        Schema::table('municipalities', function (Blueprint $table) {
            $table->tinyInteger('project_manager');
            $table->tinyInteger('project_status');
        });

        Schema::table('municipalities', function (Blueprint $table) {
            $table->dropColumn(['contact_person', 'user_id']);
        });
    }
}
