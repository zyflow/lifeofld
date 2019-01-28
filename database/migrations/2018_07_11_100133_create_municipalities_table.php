<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMunicipalitiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('municipalities', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('surname');
            $table->string('cpr');
            $table->string('address');
            $table->string('kommune');
            $table->string('email');
            $table->string('mobile')->nullable();
            $table->string('bank_account')->nullable();
            $table->string('region');
            $table->tinyInteger('project_manager');
            $table->tinyInteger('project_status');
            $table->integer('open_projects')->default(0);
            $table->tinyInteger('group')->nullable();
            $table->integer('last_invoice_id')->nullable();
            $table->date('last_invoice_data')->nullable();
            $table->tinyInteger('payment_terms')->nullable();
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
        Schema::dropIfExists('municipalities');
    }
}
