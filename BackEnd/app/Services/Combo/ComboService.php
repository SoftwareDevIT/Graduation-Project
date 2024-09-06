<?php

namespace App\Services\Combo;

use App\Models\Combo;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Class LocationService.
 */
class ComboService
{

    public function index(): Collection
    {

        return Combo::all();
    }


    public function store(array $data): Combo
    {
        return Combo::create($data);
    }

    public function update(int $id, array $data): Combo
    {
        $combo = Combo::findOrFail($id);
        $combo->update($data);
        return $combo;
    }


    public function delete(int $id): ?bool
    {
        $combo = Combo::findOrFail($id);
        return $combo->delete();
    }
    public function get(int $id): Combo
    {
        $combo = Combo::findOrFail($id);
        return $combo;
    }
}
