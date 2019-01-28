<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCitizenDatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('citizen_dates', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('citizen_id');
            $table->date('start')->nullable();
            $table->date('first_contact')->nullable();
            $table->date('meeting')->nullable();
            $table->date('commenced')->nullable();
            $table->date('material_sent_subject')->nullable();
            $table->date('material_sent_municipality')->nullable();
            $table->date('invoice')->nullable();
            $table->date('return')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('citizen_dates');
    }
}
