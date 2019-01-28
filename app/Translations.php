<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\App;

class Translations extends Model
{
	protected  $table = 'ltm_translations';

    public static function getTranslations()
	{
		$preparedData = [];

		$data = Translations::select('group', 'value', 'key')->where('locale', App::getLocale())
				->get();

		foreach($data as $row)
		{
			$preparedData[$row->group][$row->key] = $row->value;
		}

		return $preparedData;
	}
}
