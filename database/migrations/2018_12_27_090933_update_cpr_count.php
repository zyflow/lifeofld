<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateCprCount extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('citizens', function (Blueprint $table) {
            $table->string('cpr', 249)->change();
        });

		Schema::table('municipalities', function (Blueprint $table) {
			$table->string('cpr', 249)->change();
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
            $table->string('cpr', 191)->change();
        });

		Schema::table('municipalities', function (Blueprint $table) {
			$table->string('cpr', 191)->change();
		});    }
}
