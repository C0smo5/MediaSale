<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('verify_account')->default(false)->after('payment_completed');
            $table->timestamp('registration_last_activity_at')->nullable()->after('verify_account');
        });

        User::query()->each(function (User $user): void {
            if ($user->hasCompletedRegistrationRequirements()) {
                $user->forceFill(['verify_account' => true])->saveQuietly();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['verify_account', 'registration_last_activity_at']);
        });
    }
};
