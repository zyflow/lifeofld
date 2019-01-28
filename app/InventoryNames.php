<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class InventoryNames extends Model
{
    protected $table = 'commune_inventory_names';

    protected $fillable = ['name', 'kommune_id', 'inventory_id'];

    public function inventory()
	{
		return $this->hasOne(Inventory::class, 'id', 'inventory_id');
	}
}
