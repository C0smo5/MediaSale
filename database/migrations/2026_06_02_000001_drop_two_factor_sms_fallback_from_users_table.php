<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('users', 'two_factor_sms_fallback')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('two_factor_sms_fallback');
            });
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'two_factor_sms_fallback')) {
                $table->boolean('two_factor_sms_fallback')->default(false)->after('two_factor_recovery_codes');
            }
        });
    }
};
