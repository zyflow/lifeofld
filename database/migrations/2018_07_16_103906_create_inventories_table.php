<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInventoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inventories', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->float('cost_price');
            $table->float('sales_price')->nullable();
            $table->float('rental_price')->nullable();
            $table->tinyInteger('stock_lock')->default(0);
            $table->integer('qty');
            $table->date('last_purchase_date')->nullable();
            $table->tinyInteger('supplier_id')->default(0);
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
        Schema::dropIfExists('inventories');
    }
}
