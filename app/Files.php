<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Files extends Model
{
    protected $table = 'files';

    protected $fillable = ['type', 'name'];

	public static function saveFile($model, $file)
	{
		$type = class_basename($model);
		$fileName = $file->getClientOriginalName();
		$randStr = str_random(5);
		$name = "{$fileName}";

		Storage::putFileAs('public/files/' , $file, $name);

		$fileModel = new CitizenFile();
		$fileModel->fill([
								 'citizen_id' => $model->id,
								 'file' => $name
						 ]);

		$fileModel->save();
	}


    public static function saveFiles($model, $files)
	{
		if ($files == null)
		{
			return false;
		}

		foreach($files as $file)
		{
			self::saveFile($model, $file);
		}
	}

}
