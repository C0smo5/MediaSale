<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('users', 'payment_completed')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            $table->boolean('payment_completed')->default(false)->after('plan_billing');
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('users', 'payment_completed')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('payment_completed');
        });
    }
};
