<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RentalPrice extends Model
{
	protected $table = 'commune_rental_prices';

	protected $guarded = ['created_at', 'id'];

	public function inventoryByCommuneID()
	{
		return $this->hasOne(Inventory::class, 'id', 'inventory_id');
	}
}
