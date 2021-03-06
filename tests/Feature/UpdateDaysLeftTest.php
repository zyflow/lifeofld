<?php

namespace Tests\Feature;

use App\Console\Commands\UpdateDateNotifications;
use App\Console\Commands\UpdateProjectHoursLeft;
use App\Notification;
use App\ProjectDates;
use App\Projects;
use Carbon\Carbon;
use Faker\Factory;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UpdateDaysLeftTest extends TestCase
{
	private $project;

	public function setUp()
	{
		parent::setUp(); // TODO: Change the autogenerated stub
		$this->project = factory(Projects::class)->create();

	}

	public function tearDown()
	{
		parent::tearDown(); // TODO: Change the autogenerated stub
//		$this->deleteProjects();
	}

	public function deleteProjects()
	{
		$projects = Projects::all();

		foreach ($projects as $project)
		{
			$project->delete();
		}
	}

	/**
     * A basic test example.
     *
     * @return void
     */
    public function testGetNotificationModel()
    {
    	$this->project->latestDate->update([
    			'status_date' => Carbon::yesterday()
													  ]);

    	$updateDateNotifications = new UpdateProjectHoursLeft();
		$updateDateNotifications->handle();

    }
}
