<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    protected $fillable = [
        "name", "cost_price", "sales_price", "rental_price", "stock_lock", "qty", "supplier_id", 'type'
    ];

    public function inventoryNames(){
    	return $this->hasMany(InventoryNames::class, 'inventory_id', 'id');
	}

	//Combine by relationship query change
	public function inventoryName(){
		return $this->hasOne(InventoryNames::class, 'inventory_id', 'id');
	}

	public function inventoryPrices()
	{
		return $this->hasOne(RentalPrice::class, 'inventory_id', 'id');
	}
}
