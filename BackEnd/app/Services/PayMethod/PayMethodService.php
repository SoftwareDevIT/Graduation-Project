<?php

namespace App\Services\PayMethod;

use App\Models\PayMethod;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Class LocationService.
 */
class PayMethodService
{

    public function index(): Collection
    {

        return PayMethod::all();
    }


    public function store(array $data): PayMethod
    {
        return PayMethod::create($data);
    }

    public function update(int $id, array $data): PayMethod
    {
        $method = PayMethod::findOrFail($id);
        $method->update($data);

        return $method;
    }


    public function delete(int $id): ?bool
    {
        $method = PayMethod::findOrFail($id);
        return $method->delete();
    }
    public function get(int $id): PayMethod
    {
        $method = PayMethod::findOrFail($id);
        return $method;
    }
}