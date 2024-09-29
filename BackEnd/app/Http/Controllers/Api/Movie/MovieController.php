<?php

namespace App\Http\Controllers\Api\Movie;

use App\Http\Controllers\Controller;
use App\Http\Requests\Movie\Store\StoreMovieRequest;
use App\Http\Requests\Movie\Update\UpdateMovieRequest;
use App\Models\Movie;
use App\Models\MovieCategory;
use App\Models\Showtime;
use App\Services\Movie\MovieService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use League\Flysystem\WhitespacePathNormalizer;
use Throwable;

class MovieController extends Controller
{
    protected $movieService;
    public function __construct(MovieService $movieService)
    {
        $this->movieService = $movieService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $movie = $this->movieService->index();
        return $this->success($movie, 'success');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMovieRequest $request)
    {
        try {
            $file = $request->file('poster');
            $movie = $request->validated();
            $movie['poster'] = $file ? $this->uploadImage($file) : null;

            $movie = $this->movieService->store($movie);
            return $this->success($movie, 'Thêm thành công Movie');
        } catch (Exception $e) {
            return $this->error('Có lỗi xảy ra: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try{
            $movie = $this->movieService->show($id);
            return $this->success($movie, 'Chi tiết phim ');
        }catch(Throwable $th){
            return $this->error('Movie not found id = ' . $id, 500);
        }
      
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMovieRequest $request, string $id)
    {
        try {
            $file = $request->file('photo');
            $oldImgageActor  = $this->movieService->get($id);

            $imageLink =  $file ? $this->uploadImage($file) :  $oldImgageActor->poster;

            // Lấy dữ liệu đã được xác thực từ request
            $movie = $request->validated();
            $movie['photo'] = $imageLink;
          
            $movie = $this->movieService->update($id, $movie);

            return $this->success($movie, 'Cập nhập thành công');
        } catch (\Throwable $th) {
            return $this->error('Movie not found id = ' . $id, 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $showtimes = Showtime::where('movie_id', $id)->exists();

        if ($showtimes) {
            return $this->error( 'Phim đang công chiếu, không thể xóa', 400);
        }
        
        $this->movieService->delete($id);
        return $this->success('Xoá Thành Công', 'success');
    }

    public function search($movie_name)
    {
        try {
            $movie = $this->movieService->getMovieByMovieName($movie_name);

            if ($movie->isEmpty()) {
                return $this->notFound('Không tìm thấy phim', 404);
            }
            return $this->success($movie, 'Phim theo tên tìm kiếm là:');
        } catch (ModelNotFoundException $e) {
            return $e->getMessage();
        }
    }

    public function movieByCategory($id)
    {
        try {
            $movies = Movie::where('movie_category_id', $id)->get();

            if ($movies->isEmpty()) {
                return $this->error('Không có phim nào thuộc Category này', 404);
            }

            return $this->success($movies, 'Danh sách phim tho Category ', 200);
        } catch (\Throwable $th) {
            return $this->error('Fail', 500);
        }
    }
}
