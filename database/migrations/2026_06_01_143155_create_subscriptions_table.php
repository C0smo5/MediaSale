<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('mp_preapproval_id')->unique()->nullable();
            $table->string('plan_key');
            $table->string('billing');
            $table->enum('status', ['pending', 'authorized', 'paused', 'cancelled'])->default('pending');
            $table->decimal('amount_due', 10, 2);
            $table->timestamp('next_payment_date')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
