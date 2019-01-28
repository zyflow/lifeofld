<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CommuneController extends Controller {

	public function update(Request $request)
	{
		return json_encode([
								   'status' => 'updated',
						   ]);
	}

}
