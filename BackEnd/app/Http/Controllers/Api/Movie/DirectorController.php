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
        // $director = $this->directorService->store($request->validated());
        // return $this->success($director, 'Thêm thành công', 201);

        try {
            $file = $request->file('photo');
            $filePath = $file->getPathName();
            $imageLink = $this->directorService->uploadImage($filePath);

            $director = $request->validated();
            $director['photo'] = $imageLink;

            $director = $this->directorService->store($director);

            return $this->success($director, 'Thêm thành công');
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
        // try {
        //     $director = $this->directorService->update($id, $request->validated());
        //     return $this->success($director, 'Update thành công');
        // } catch (\Throwable $th) {
        //     if ($th instanceof ModelNotFoundException) {
        //         return $this->notFound('Director not found id = ' . $id, 404);
        //     }

        //     return $this->error('Director not found id = ' . $id, 500);
        // }

        try {
            $file = $request->file('photo');
            if ($file) {
                $filePath = $file->getPathName();
                $imageLink = $this->directorService->uploadImage($filePath);
            } else {
                $imageLink = null; // Hoặc xử lý khác nếu không có file
            }

            // Lấy dữ liệu đã được xác thực từ request
            $director = $request->validated();

            if ($imageLink) {
                $director['photo'] = $imageLink;
            }

            // Cập nhật dữ liệu của director
            $director = $this->directorService->update($id, $director);
            return $this->success($director, 'Cập nhập thành công');
        } catch (\Throwable $th) {
            if ($th instanceof ModelNotFoundException) {
                return $this->notFound('director not found id = ' . $id, 404);
            }

            return $this->error('director not found id = ' . $id, 500);
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
