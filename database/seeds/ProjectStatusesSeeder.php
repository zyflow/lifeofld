<?php

use Illuminate\Database\Seeder;

class ProjectStatusesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    	DB::table('project_statuses')->truncate();

        DB::table('project_statuses')->insert([
            ['name' => 'case_received'],
            ['name' => 'meeting_arranged'],
            ['name' => 'intervention_started'],
            ['name' => 'project_work_commenced'],
            ['name' => 'project_material_sent_to_subject'],
            ['name' => 'project_material_sent_to_customer'],
            ['name' => 'closed_invoiced'],
            ['name' => 'closed_returned_not_invoiced']
        ]);
    }
}
