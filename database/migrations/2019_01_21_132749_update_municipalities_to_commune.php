<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateMunicipalitiesToCommune extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::rename('municipalities', 'communes');
		Schema::rename('inventory_names', 'commune_inventory_names');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
		Schema::rename('communes', 'municipalities');
		Schema::rename('commune_inventory_names', 'inventory_names');
	}
}
