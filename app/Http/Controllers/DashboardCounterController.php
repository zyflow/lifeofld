<?php

namespace App\Http\Controllers;

use App\Http\Requests\CitizenRequest;
use App\Citizens;
use App\Projects;
use Auth;
use Tests\Feature\Project;
use Validator;
use Storage;
use DB;

class DashboardCounterController extends Controller {

	public function index()
	{
		$projectCount = Projects::count();
		$liggetid = $this->getLiggetid($projectCount );

		return response([
								'status' => 'OK',
								'opened' => $projectCount,
								'liggetid' => $liggetid,
								'meeting_days' => -3
						]);
	}

	public function getLiggetid($projectCount)
	{
		$hoursSum = Projects::sum('hours_left');
		$hoursPerProjectAv = 0;
		if ($projectCount > 0)
		{
			$hoursPerProjectAv = $hoursSum / $projectCount;
		}

		$averageDaysPerProject = $hoursPerProjectAv / 24;

		return sprintf('%.0f', $averageDaysPerProject);
	}
}
