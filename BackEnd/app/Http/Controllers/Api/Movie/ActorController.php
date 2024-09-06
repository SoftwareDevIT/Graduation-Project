<?php

namespace App\Http\Controllers\Api\Movie;

use App\Http\Controllers\Controller;
use App\Http\Requests\Movie\Store\StoreActorRequest;
use App\Http\Requests\Movie\Update\UpdateActorRequest;
use App\Services\Movie\ActorService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ActorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $actorService;

    public function __construct(ActorService $actorService)
    {
        $this->actorService = $actorService;
    }

    public function index()
    {
        $actors = $this->actorService->index();
        return response()->json($actors);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreActorRequest $request)
    {
        $actor = $this->actorService->store($request->validated());
        return $this->success($actor, 'Thêm thành công');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        try {
            $actor = $this->actorService->get($id);

            return $this->success($actor, 'Chi tiết đạo diễn với id = ' . $id);
        } catch (\Throwable $th) {
            if ($th instanceof ModelNotFoundException) {
                return $this->notFound('Actor not found id = ' . $id, 404);
            }

            return $this->error('Actor not found id = ' . $id, 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateActorRequest $request, string $id)
    {
        try {
            $actor = $this->actorService->update($id, $request->validated());
            return $this->success($actor, 'Update thành công');
        } catch (\Throwable $th) {
            if ($th instanceof ModelNotFoundException) {
                return $this->notFound('Actor not found id = ' . $id, 404);
            }

            return $this->error('Actor not found id = ' . $id, 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $this->actorService->delete($id);
            return $this->success(null,'Xóa thành công');
        } catch (\Throwable $th) {
            if ($th instanceof ModelNotFoundException) {
                return $this->notFound('Actor not found id = ' . $id, 404);
            }

            return $this->error('Actor not found id = ' . $id, 500);
        }
    }
}
