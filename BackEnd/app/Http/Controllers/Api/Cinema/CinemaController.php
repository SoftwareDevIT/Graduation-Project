<?php

namespace App\Http\Controllers\Api\Cinema;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreCinemaRequest;
use App\Http\Requests\Update\UpdateCinemaRequest;
use App\Models\Cinema;
use App\Models\Movie;
use App\Models\MovieInCinema;
use Illuminate\Http\Request;
use App\Services\Cinema\CinemaService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CinemaController extends Controller
{
    protected $cinemaService;

    public function __construct(CinemaService $cinemaService)
    {
        $this->cinemaService = $cinemaService;
    }

    public function index()
    {
        $cinemas = $this->cinemaService->index();
        return $this->success($cinemas);
    }
    public function show($id)
    {
        try {
            $cinema = $this->cinemaService->get($id);

            if (!$cinema) {
                return response()->json(['error' => 'Cinema not found'], 404);
            }

            return $this->success($cinema);
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }


    public function store(StoreCinemaRequest $request)
    {
        $cinema = $this->cinemaService->store($request->validated());
        return $this->success($cinema);
    }
    public function synCinemaHasMovie(Request $request, $cinema_id)
    {
        // Xác thực dữ liệu đến để đảm bảo nó chứa một mảng các đối tượng Movie_in_cinema
        $validatedData = $request->validate([
            'movie_in_cinema' => 'required|array',
            'movie_in_cinema.*.movie_id' => 'required|integer',
        ]);

        try {
            $alreadyExists = [];
            $addedMovies = [];

            // lặp qua mảng phim_in_cinema và thêm cinema_id cho mỗi bộ phim
            foreach ($validatedData['movie_in_cinema'] as $movie) {
                $movie_id = $movie['movie_id'];

                // Kiểm tra xem bộ phim có tồn tại trong rạp chiếu phim không
                $existing = MovieInCinema::where('movie_id', $movie_id)
                    ->where('cinema_id', $cinema_id)
                    ->first();

                if ($existing) {
                    // Nếu bộ phim đã tồn tại trong rạp chiếu phim, hãy thêm vào mảng
                    $alreadyExists[] = $movie_id;
                } else {
                    // Nếu nó không tồn tại, hãy lưu trữ và thêm vào mảng
                    $data = [
                        'movie_id' => $movie_id,
                        'cinema_id' => $cinema_id
                    ];
                    $this->cinemaService->storeMovie($data);
                    $addedMovies[] = $movie_id;
                }
            }
            $message = 'Movies synchronized successfully.';
            if (!empty($alreadyExists)) {
                $message .= ' Movies already in cinema: ' . implode(', ', $alreadyExists);
            }
            if (!empty($addedMovies)) {
                $message .= ' Movies added: ' . implode(', ', $addedMovies);
            }
            return $this->success($message);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function showCinemaHasMovie($cinema_id)
    {
        try {
            // Truy xuất tất cả các bộ phim liên quan đến Cinema_id đã cho
            $movies = MovieInCinema::where('cinema_id', $cinema_id)
                ->with('movie')// Giả sử bạn có mối quan hệ giữa phim và phim
                ->get();

            // Kiểm tra xem rạp chiếu phim có phim nào không
            if ($movies->isEmpty()) {
                return response()->json(['message' => 'No movies found for this cinema.'], 404);
            }

            return $this->success($movies);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function destroyCinemaHasMovie($cinema_id, $movie_id)
    {
        try {
            // Tìm bộ phim trong rạp chiếu phim của Cinema_id và Movie_id
            $movieInCinema = MovieInCinema::where('cinema_id', $cinema_id)
                ->where('movie_id', $movie_id)
                ->first();

            // Nếu không tìm thấy mục nhập, hãy trả lại lỗi 404
            if (!$movieInCinema) {
                return response()->json([
                    'status' => false,
                    'message' => 'Movie not found in this cinema.',
                ], 404);
            }

            // Delete the entry from the database
            $movieInCinema->delete();

            // Return success message
            return response()->json([
                'status' => true,
                'message' => 'Movie removed from the cinema successfully.',
            ], 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function status(int $id)
    {
        $movie = Cinema::findOrFail($id);
        $movie->status = $movie->status == 1 ? 0 : 1;
        $movie->save();
        return $this->success('', 'Cập nhật trạng thái thành công.', 200);
    }




    public function update(UpdateCinemaRequest $request, $id)
    {
        try {
            $cinema = $this->cinemaService->update($id, $request->validated());
            return $this->success($cinema);
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function destroy($id)
    {
        try {
            return $this->success($this->cinemaService->delete($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }


    public function filterMovie($id)
    {
        try {
            $movies = MovieInCinema::where('cinema_id', $id)->with('showtimes')->get();
            if ($movies->isEmpty()) {
                return $this->error('Không có phim trong rạp này .');
            }
            return $this->success($movies, 'Lấy phim thành công');
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'fail',
                'data' => $th->getMessage()
            ]);
        }

    }
    public function showCinemaByLocation($id)
    {
        try {
            $cinema = $this->cinemaService->showCinemaByLocation($id);
            if ($cinema) {
                return $this->success($cinema);
            }
            return $this->error('');

        } catch (\Throwable $th) {
            return $th->getMessage();
        }
    }
}
