<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TimelineData extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('TimelineData', function (Blueprint $table) {
			$table->increments('id');
			$table->string('event_id')->nullable();
			$table->string('user_email')->nullable();
			$table->string('creator_name')->nullable();
			$table->string('creator_email')->nullable();
			$table->datetime('start_datetime')->nullable();
			$table->datetime('end_datetime')->nullable();
			$table->date('start_date')->nullable();
			$table->date('end_date')->nullable();
			$table->string('summary')->nullable();
			$table->datetime('created')->nullable();
			$table->string('kind')->nullable();
			$table->string('collection_key')->nullable();
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
		Schema::dropIfExists('TimelineData');
	}
}
