<?php

namespace App\Http\Controllers;

use App\ProjectManagers;
use Illuminate\Http\Request;

class ManagerController extends Controller
{

	public function index()
	{
		$data = ProjectManagers::all();

		return [
				'status' => 'ok',
				'managers' => $data
		];
	}
}
