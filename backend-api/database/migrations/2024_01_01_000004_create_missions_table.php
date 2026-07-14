<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('missions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('driver_id')->nullable()->constrained('drivers')->nullOnDelete();
            $table->string('title');
            $table->string('start_address');
            $table->string('end_address');
            $table->string('start_city')->nullable();
            $table->string('end_city')->nullable();
            $table->string('goods_type');
            $table->enum('truck_type', ['leger', 'moyen', 'lourd'])->default('leger');
            $table->decimal('max_weight', 8, 2)->comment('en tonnes');
            $table->enum('required_license', ['B', 'C', 'EC'])->default('B');
            $table->decimal('distance_km', 8, 2);
            $table->decimal('price', 10, 2)->comment('calcule automatiquement: distance x tarif camion');
            $table->enum('status', ['available', 'applied', 'in_progress', 'completed'])->default('available');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('missions');
    }
};
