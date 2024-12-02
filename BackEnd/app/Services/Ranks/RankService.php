<?php

namespace App\Services\Ranks;

use App\Models\PointHistory;
use App\Models\Rank;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Traits\AuthorizesInService;
use Exception;
use Illuminate\Support\Facades\DB;


/**
 * Class LocationService.
 */
class RankService
{
    use AuthorizesInService;

    public function index(): Collection
    {

        return Rank::orderByDesc('created_at')->get();
    }


    public function store(array $data): Rank
    {

        return Rank::create($data);
    }

    public function update(int $id, array $data): Rank
    {

        $method = Rank::findOrFail($id);
        $method->update($data);

        return $method;
    }


    public function delete(int $id): ?bool
    {

        $method = Rank::findOrFail($id);
        return $method->delete();
    }
    public function get(int $id): Rank
    {
        $method = Rank::findOrFail($id);
        return $method;
    }

    public function usePoints($user, $pointsToUse, $totalPrice)
{
    if ($pointsToUse > $user->points) {
        return [
            'success' => false,
            'message' => 'Số điểm nhập vượt quá số điểm hiện có.'
        ];
    }

    // Tính toán giá trị giảm giá
    $discountValue = $pointsToUse;
    $finalPrice = $totalPrice - $discountValue;

    $rank = $user->rank;

    if (!$rank) {
        return [
            'success' => false,
            'message' => 'Cấp bậc không tồn tại.'
        ];
    }

    // Tính số điểm mới nhận được dựa vào phần trăm cấp bậc
    $pointsEarned = $totalPrice * ($rank->percent_discount / 100);

    // Cập nhật điểm người dùng
    $remainingPoints = $user->points - $pointsToUse;

    DB::transaction(function () use ($user, $remainingPoints, $pointsEarned, $pointsToUse, $discountValue, $totalPrice) {
        // Cập nhật điểm của người dùng
        $user->points = $remainingPoints + $pointsEarned;
        $user->save();

        // Lưu lịch sử điểm
        PointHistory::create([
            'user_id' => $user->id,
            'points_used' => $pointsToUse,
            'points_earned' => $pointsEarned,
            'order_amount' => $totalPrice, // Số tiền đơn hàng
        ]);
    });

    return [
        'success' => true,
        'message' => 'Sử dụng điểm thành công.',
        'discount_value' => $discountValue,
        'final_price' => $finalPrice,
        'remaining_points' => $remainingPoints + $pointsEarned,
        'points_earned' => $pointsEarned
    ];
}

   
}
