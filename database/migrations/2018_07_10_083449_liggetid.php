<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Liggetid extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('citizens', function (Blueprint $table) {
            $table->dropColumn(['liggetid_start', 'liggetid_end']);
            $table->integer('liggetid')->after('visitation');
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
            $table->date('liggetid_start')->after('visitation');
            $table->date('liggetid_end')->after('liggetid_start');
            $table->dropColumn(['liggetid']);
        });
    }
}
