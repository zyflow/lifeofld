<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserUpdateRequest;
use App\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct() {
//        $this->middleware('auth');

        $this->fields = [
            'name',
            'email',
            'username',
            'image'
        ];
    }

    public function index() {
		$data = User::all();

		return [
				'status' => 'ok',
				'users' => $data
		];
    }

    public function store(Request $request)
	{
		\Log::info($request->all());
	}

	public function update(Request $request, $id) {
		$user = User::find($id);

		$data = $request->except('password', 'password_confirmation');
		if ($request->get('password') !== null) {
			$data['password'] = bcrypt($request->get('password'));
		}
		$user->fill($data);
		$user->save();


		if ($request->hasFile('image'))
		{
			checkRemoveFile($user->image, "avatars");
		}
		uploadImage($user, "avatars", $request);
	}

}
