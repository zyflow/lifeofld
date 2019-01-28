<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateProjectDates2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('project_dates', function (Blueprint $table) {
            $table->dropColumn([
            		'startdate',
					'first_contact',
					'meeting',
					'commenced',
//					'material_sent_subject',
					'material_sent_municipality',
					'invoice',
					'return'
							   ]);

            $table->timestamp('status_date')->default(NOW())->after('user_id');
            $table->softDeletes();
            $table->string('status')->after('user_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('project_dates', function (Blueprint $table) {
            $table->date('startdate')->nullable()->after('user_id');
            $table->date('first_contact')->nullable()->after('user_id');
            $table->date('meeting')->nullable()->after('user_id');
            $table->date('commenced')->nullable()->after('user_id');
            $table->date('material_sent_municipality')->nullable()->after('user_id');
            $table->date('invoice')->nullable()->after('user_id');
            $table->date('return')->nullable()->after('user_id');

            $table->dropSoftDeletes();
            $table->dropColumn(['status_date', 'status']);
        });
    }
}
