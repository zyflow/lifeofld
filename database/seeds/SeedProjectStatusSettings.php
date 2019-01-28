<?php

use Illuminate\Database\Seeder;

class SeedProjectStatusSettings extends Seeder {
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		$data = [
				1 => [
						'name'                 => 'case_received',
						'hours'                => 72,
						'manual_status_change' => false,
				],
				2 => [
						'name'                 => 'meeting_arranged',
						'hours'                => 72,
						'manual_status_change' => false,
				],
				3 => [
						'name'                 => 'intervention_started',
						'hours'                => 72,
						'manual_status_change' => false,
				],
				4 => [
						'name'                 => 'project_work_commenced',
						'hours'                => 72,
						'manual_status_change' => true,
				],
				5 => [
						'name'                 => 'project_material_sent_to_subject',
						'hours'                => 72,
						'manual_status_change' => true,
				],
				6 => [
						'name'                 => 'project_material_sent_to_customer',
						'hours'                => 72,
						'manual_status_change' => true,
				],
				7 => [
						'name'                 => 'closed_invoiced',
						'hours'                => 72,
						'manual_status_change' => false,
				],
				8 => [
						'name'                 => 'closed_returned_not_invoiced',
						'hours'                => 72,
						'manual_status_change' => false,
				],
		];

		foreach($data as $key => $row)
		{
			$row['order_no'] = $key;
			\App\ProjectStatusSetting::create($row);
		}
	}
}
