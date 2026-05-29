<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            // User preferences (notifications, chat, monitoring, privacy)
            $table->json('settings')->nullable()->after('verify_account');

            // 2FA — TOTP
            $table->text('two_factor_secret')->nullable()->after('settings');
            $table->timestamp('two_factor_confirmed_at')->nullable()->after('two_factor_secret');
            $table->text('two_factor_recovery_codes')->nullable()->after('two_factor_confirmed_at');
            $table->boolean('two_factor_sms_fallback')->default(false)->after('two_factor_recovery_codes');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn([
                'settings',
                'two_factor_secret',
                'two_factor_confirmed_at',
                'two_factor_recovery_codes',
                'two_factor_sms_fallback',
            ]);
        });
    }
};
