<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\UserRequest;
use App\Http\Requests\UserUpdateRequest;
use App\User;
use App\Citizens;
use Storage;
use Auth;

class UserController extends Controller
{
    public function __construct() {
        $this->middleware('auth');

        $this->fields = [
            'name',
            'email',
            'username',
            'image'
        ];
    }

    public function index() {
        return view('dashboard/users');
    }

    public function saveUser(UserRequest $request) {
        $user = new User;

        validateAndSave($user, $request, $this->fields);
        uploadImage($user, "avatars", $request);
    }


    public function removeUser($id) {
        $user = User::find($id);

        checkRemoveFile($user->image, "avatars");
        User::findOrFail($id)->delete();
    }
}
