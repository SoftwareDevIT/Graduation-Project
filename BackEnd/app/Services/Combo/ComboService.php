<?php

namespace App\Services\Combo;

use App\Models\Combo;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Traits\AuthorizesInService;

/**
 * Class LocationService.
 */
class ComboService
{
    use AuthorizesInService;
    public function index(): Collection
    {
       
        return Combo::all();
    }


    public function store(array $data): Combo
    {
        $this->authorizeInService('create', Combo::class);
        return Combo::create($data);
    }

    public function update(int $id, array $data): Combo
    {
        $this->authorizeInService('update', Combo::class);
        $combo = Combo::findOrFail($id);
        $combo->update($data);
        return $combo;
    }


    public function delete(int $id): ?bool
    {
        // $this->authorizeInService('delete', Combo::class);
        $combo = Combo::findOrFail($id);
        return $combo->delete();
    }
    public function get(int $id): Combo
    {
        $combo = Combo::findOrFail($id);
        return $combo;
    }
}
