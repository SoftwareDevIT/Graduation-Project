<?php

namespace App\Http\Controllers\Api\Movie;

use App\Http\Controllers\Controller;
use App\Http\Requests\Movie\Store\StoreActorRequest;
use App\Http\Requests\Movie\Update\UpdateActorRequest;
use App\Models\Actor;
use App\Services\Movie\ActorService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use GuzzleHttp\Client;

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
        try {
            $file = $request->file('photo');
            $imageLink = $this->uploadImage($file);

            $actor = $request->validated();
            $actor['photo'] = $imageLink;

            $actor = $this->actorService->store($actor);

            return $this->success($actor, 'Thêm thành công');
        } catch (Exception $e) {
            return $this->error('Có lỗi xảy ra: ' . $e->getMessage(), 500);
        }
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
            $file = $request->file('photo');
            if ($file) {
                $imageLink = $this->uploadImage($file);
            } else {
                $imageLink = null; // Hoặc xử lý khác nếu không có file
            }

            // Lấy dữ liệu đã được xác thực từ request
            $actor = $request->validated();

            if ($imageLink) {
                $actor['photo'] = $imageLink;
            }

            // Cập nhật dữ liệu của actor
            $actor = $this->actorService->update($id, $actor);
            return $this->success($actor, 'Cập nhập thành công');
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
            return $this->success(null, 'Xóa thành công');
        } catch (\Throwable $th) {
            if ($th instanceof ModelNotFoundException) {
                return $this->notFound('Actor not found id = ' . $id, 404);
            }

            return $this->error('Actor not found id = ' . $id, 500);
        }
    }
}
