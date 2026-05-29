<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropUnique(['cpf']);
            $table->dropUnique(['phone']);
        });

        Schema::table('users', function (Blueprint $table): void {
            // Encrypted values are ~200+ chars; cpf was VARCHAR(11) for plaintext digits only.
            $table->string('cpf', 512)->nullable()->change();
            $table->string('phone', 512)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('cpf', 11)->nullable()->change();
            $table->string('phone')->nullable()->change();
        });

        Schema::table('users', function (Blueprint $table): void {
            $table->unique('cpf');
            $table->unique('phone');
        });
    }
};
