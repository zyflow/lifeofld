<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Citizens extends Model
{
	use Searchable;

    protected $fillable = [
        'user_id', 'name', 'surname', 'cpr', 'address', 'email', 'mobile', 'project_status',
		'zip', 'address2', 'post_code', 'city'
    ];

    public function getCprAttribute()
	{
		return "*****";
	}

	/**
	 * The "booting" method of the model.
	 *
	 * @return void
	 */
	protected static function boot()
	{
		parent::boot();

		static::created(function(Citizens $citizen){
			\Log::info(':o');
			\Log::info($citizen);
		});
	}



	public function kommune()
	{
		return $this->hasOne(Communes::class, 'id', 'kommune_id');
	}

	public function files()
	{
		return $this->hasMany(CitizenFile::class, 'citizen_id', 'id');
	}

	public function project()
	{
		return $this->hasMany(Projects::class, 'citizen_id', 'id');
	}
}
