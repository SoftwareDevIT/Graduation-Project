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
use Illuminate\Support\Facades\Log;

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
        $usedPointsSessionKey = 'used_points_';
        if (session()->has($usedPointsSessionKey)) {
            return [
                'success' => false,
                'message' => 'Bạn đã sử dụng điểm cho đơn hàng này.'
            ];
        }

        if ($pointsToUse > $user->points) {
            return [
                'success' => false,
                'message' => 'Số điểm nhập vượt quá số điểm hiện có.'
            ];
        }

        $maxPointsAllowed = $totalPrice * 0.2;
        if ($pointsToUse > $maxPointsAllowed) {
            return [
                'success' => false,
                'message' => 'Số điểm nhập không được vượt quá 20% tổng tiền.'
            ];
        }

        $discountValue = $pointsToUse;
        $finalPrice = $totalPrice - $discountValue;

        $rank = $user->rank;

        // Tính số điểm mới nhận được dựa vào phần trăm cấp bậc
        $pointsEarned = $totalPrice * ($rank->percent_discount / 100);

        // Cập nhật điểm người dùng
        $remainingPoints = $user->points - $pointsToUse;

        DB::transaction(function () use ($user, $remainingPoints, $pointsEarned, $pointsToUse, $discountValue, $totalPrice) {
            // Cập nhật điểm của người dùng
            $user->points = $remainingPoints + $pointsEarned;
            $user->save();

            PointHistory::create([
                'user_id' => $user->id,
                'points_used' => $pointsToUse,
                'points_earned' => $pointsEarned,
                'order_amount' => $totalPrice,
            ]);
        });

        session()->put($usedPointsSessionKey, [
            'points_used' => $pointsToUse,
            'discount_value' => $discountValue,
            'final_price' => $finalPrice,
            'remaining_points' => $remainingPoints
        ]);

        Log::info(session()->all());

        $this->updateRank($user);

        return [
            'success' => true,
            'message' => 'Sử dụng điểm thành công.',
            'discount_value' => $discountValue,
            'final_price' => $finalPrice,
            'remaining_points' => $remainingPoints,
            'points_earned' => $pointsEarned
        ];
    }

    public function updateRank($user)
    {
        try {
            if (!$user) {
                return response()->json(['error' => 'User  not found'], 404);
            }

            // Tính tổng số tiền từ bảng points_history
            $totalAmount = $user->pointHistories()->sum('order_amount');

            $rank = $this->determineRank($totalAmount);

            if (!$rank) {
                return response()->json(['error' => 'No rank found for this amount'], 404);
            }

            // Cập nhật cấp bậc cho người dùng
            $user->rank_id = $rank->id;
            $user->save();

            return response()->json(['success' => true, 'rank' => $rank->name], 200);
        } catch (Exception $e) {
            return response()->json(['Lỗi' => $e->getMessage()], 500);
        }
    }

    private function determineRank($totalAmount)
    {
        return Rank::where('total_order_amount', '<=', $totalAmount)
            ->orderBy('total_order_amount', 'desc')
            ->first();
    }
}
