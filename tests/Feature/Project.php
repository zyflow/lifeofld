<?php

namespace Tests\Feature;

use App\Http\Controllers\ProjectController;
use App\Http\Requests\ProjectDatesRequest;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class Project extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testProject()
    {
    	$request = new ProjectDatesRequest();

		$pc = new ProjectController();
//		$pc->update([]);
		$this->assertTrue(true);
    }
}
