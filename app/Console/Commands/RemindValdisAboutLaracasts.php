<?php

namespace App\Console\Commands;

use App\Mail\SendValdisReminder;
use Illuminate\Console\Command;
use App\Citizens;
use App\ProjectDates;
use App\Projects;
use App\Settings;

class RemindValdisAboutLaracasts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'remind:valdis';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update liggetid if no the first contact date defined';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
		\Mail::to('vat@adevo.io')->bcc('llo@adevo.io')->send(new SendValdisReminder());
    }
}
