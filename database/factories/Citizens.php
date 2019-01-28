<?php

use Faker\Generator as Faker;

$factory->define(\App\Citizens::class, function (Faker $faker) {
    return [
        'user_id' => \App\User::first()->id,
		'name' => $faker->name,
		'surname' => $faker->lastName,
		'cpr' => $faker->randomNumber(5),
		'address' => $faker->address,
		'mobile' => $faker->phoneNumber,
		'group' => $faker->randomNumber(),
		'kommune' => $faker->city,
		'email' => $faker->email
    ];
});
