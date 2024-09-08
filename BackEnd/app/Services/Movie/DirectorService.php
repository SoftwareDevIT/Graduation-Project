<?php

namespace App\Services\Movie;

use App\Models\Director;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Class MovieService.
 */
class DirectorService
{
    public function index(): Collection
    {
        return Director::all();
    }

    public function store(array $data): Director
    {
        try {
            return Director::create($data);
        } catch (\Exception $e) {
            // Xử lý ngoại lệ, ví dụ: ghi log hoặc trả về thông báo lỗi
            throw new \Exception('An error occurred while creating the director.');
        }
    }

    public function update(int $id, array $data): Director
    {
        $director = Director::query()->findOrFail($id);
        $director->update($data);

        return $director;
    }

    public function delete(int $id): ?bool
    {
        $director = Director::query()->findOrFail($id);
        return $director->delete();
    }

    public function get(int $id): Director
    {
        return Director::query()->findOrFail($id);
    }
}
