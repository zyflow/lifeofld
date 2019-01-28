<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Communes extends Model
{
	use searchable;

	protected $table = 'communes';

    protected $fillable = [
        'user_id', 'name', 'surname', 'address', 'email',
		'mobile', 'bank_account', 'region', 'contact_person', 'note'
    ];

    public function openProjects()
	{
		return $this->hasMany(Projects::class, 'kommune_id', 'id');
	}


	public function inventoryNames()
	{
		return $this->hasMany(InventoryNames::class, 'kommune_id', 'id');
	}
}
