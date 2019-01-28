<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'surname', 'username', 'email', 'password', 'image'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];


	public function roles()
	{
		\Log::info('roles ... ');
		return $this->belongsToMany(Role::class, 'role_users');
	}

	/**
	 * Checks if User has access to $permissions.
	 */
	public function hasAccess(array $permissions) : bool
	{
		// check if the permission is available in any role
		foreach ($this->roles as $role) {
			if($role->hasAccess($permissions)) {
				return true;
			}
		}
		return false;
	}


	/**
	 * Checks if the user belongs to role.
	 *
	 * @param string $roleSlug
	 *
	 * @return bool
	 */
	public function inRole(string $roleSlug)
	{
		if ($this->role === $roleSlug)
		{
			return true;
		}

		return false;
	}
}
