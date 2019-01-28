<?php

namespace App\Http\Controllers;

use App\ContactPerson;
use Illuminate\Http\Request;

class ContactPersonController extends Controller
{


	public function index()
	{
		$data = ContactPerson::all();

		return [
				'status' => 'ok',
				'contact_persons' => $data
		];
	}
}
