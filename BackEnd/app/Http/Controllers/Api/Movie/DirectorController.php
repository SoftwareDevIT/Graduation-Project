<?php

namespace App\Http\Controllers\Api\Movie;

use App\Http\Controllers\Controller;
use App\Http\Requests\Movie\Store\StoreDirectorRequest;
use App\Http\Requests\Movie\Update\UpdateDirectorRequest;
use App\Services\Movie\DirectorService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class DirectorController extends Controller
{
    protected $directorService;

    public function __construct(DirectorService $directorService)
    {
        $this->directorService = $directorService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $directs = $this->directorService->index();
        return response()->json($directs);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDirectorRequest $request)
    {
        try {
            $file = $request->file('photo');
            $imageLink = $this->uploadImage($file);

            $direct = $request->validated();
            $direct['photo'] = $imageLink;

            $direct = $this->directorService->store($direct);

            return $this->success($direct, 'Thêm thành công');
        } catch (Exception $e) {
            return $this->error('Có lỗi xảy ra: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $director = $this->directorService->get($id);

            return $this->success($director, 'Chi tiết diễn viên với id = ' . $id);
        } catch (\Throwable $th) {
            if ($th instanceof ModelNotFoundException) {
                return $this->notFound('Director not found id = ' . $id, 404);
            }

            return $this->error('Director not found id = ' . $id, 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDirectorRequest $request, string $id)
    {

        try {
            $file = $request->file('photo');
            if ($file) {
                $imageLink = $this->uploadImage($file);
            } else {
                $imageLink = null; // Hoặc xử lý khác nếu không có file
            }

            // Lấy dữ liệu đã được xác thực từ request
            $direct = $request->validated();

            if ($imageLink) {
                $direct['photo'] = $imageLink;
            }

            // Cập nhật dữ liệu của direct
            $direct = $this->directorService->update($id, $direct);
            return $this->success($direct, 'Cập nhập thành công');
        } catch (\Throwable $th) {
            if ($th instanceof ModelNotFoundException) {
                return $this->notFound('Direct not found id = ' . $id, 404);
            }

            return $this->error('Direct not found id = ' . $id, 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $this->directorService->delete($id);
            return $this->success(null,'Xóa thành công');
        } catch (\Throwable $th) {
            if ($th instanceof ModelNotFoundException) {
                return $this->notFound('Director not found id = ' . $id, 404);
            }

            return $this->error('Director not found id = ' . $id, 500);
        }
    }
}
