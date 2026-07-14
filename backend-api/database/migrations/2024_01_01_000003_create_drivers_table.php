<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('license_no');
            $table->enum('license_type', ['B', 'C', 'EC'])->default('B');
            $table->string('cin');
            $table->string('cin_photo')->nullable();
            $table->string('license_photo')->nullable();
            $table->string('truck_photo')->nullable();
            $table->enum('truck_type', ['leger', 'moyen', 'lourd'])->default('leger');
            $table->string('city')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('drivers');
    }
};
