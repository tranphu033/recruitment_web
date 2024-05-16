<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('saved_candidates_detail', function (Blueprint $table) {
            $table->unsignedBigInteger('saved_candidates_id');
            $table->unsignedBigInteger('job_id');
            $table->primary(['saved_candidates_id', 'job_id']);       
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saved_candidates_detail');
    }
};
