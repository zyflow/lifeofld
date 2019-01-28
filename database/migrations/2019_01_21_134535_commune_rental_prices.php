<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CommuneRentalPrices extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('commune_rental_prices', function (Blueprint $table) {
            $table->increments('id');

			$table->integer('commune_id');
			$table->integer('inventory_id');
			$table->double('price');

            $table->timestamps();
        });

		Schema::table('commune_inventory_names', function (Blueprint $table) {
			$table->dropColumn('key');
		});

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('commune_rental_prices');

		Schema::table('commune_inventory_names', function (Blueprint $table) {
			$table->string('key')->after('inventory_id');
		});
    }
}
