<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket Information</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }
        .ticket {
            background: #fff;
            width: 400px;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .ticket .header {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
        }
        .ticket .header a {
            text-decoration: none; /* Remove underline from the link */
            color: inherit; /* Inherit text color from the element */
        }
        .ticket .header img {
            width: 50px;
            margin-right: 10px;
        }
        .ticket .header h1 {
            font-size: 20px;
            font-weight: bold;
            color: red;
            margin: 0;
        }
        .ticket .barcode {
            text-align: center;
            margin-bottom: 20px;
        }
        .ticket .barcode img {
            width: 100%;
            max-width: 200px;
        }
        .ticket .barcode h2 {
            font-size: 12px;
            text-align: center;
            color: red;
            font-style: italic;
            margin-bottom: 10px;
        }
        .ticket .info {
            margin-bottom: 20px;
        }
        .ticket .info p, .ticket .combo p {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
            font-size: 14px;
            color: #555;
        }
        .ticket .info p span, .ticket .combo p span {
            font-weight: bold;
            color: #333;
        }
        .ticket .combo {
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
        .ticket .combo p {
            display: flex; /* Keep the items in a row */
            justify-content: space-between; /* Align label and value to opposite ends */
            margin: 5px 0;
        }
        .ticket .combo span {
            display: inline;
        }
        .ticket .total {
            font-size: 16px;
            font-weight: bold;
            text-align: right;
            margin-top: 10px;
        }
        .ticket .cinema-info {
            margin-top: 20px; /* Add space at the bottom */
            font-size: 14px;
            color: #555;
            text-align: center;
        }
        .ticket .cinema-info p {
            margin: 5px 0;
        }
        /* Style for the <hr> */
        hr {
            border: 0;
            height: 3px;
background-color: #333; /* Darker color */
            margin: 15px 0; /* Space above and below the hr */
        }
    </style>
</head>
<body>
    <div class="ticket">
        <div class="header">
            <a href="http://localhost:5173" target="_blank">
                <img src="https://imgur.com/Pd2gDuC.png" alt="logo">
            </a>
            <a href="http://localhost:5173" target="_blank">
                <h1>FlickHive</h1>
            </a>
        </div>
        <div class="barcode">
            <img src="{{$booking->qrcode}}" alt="Barcode">
            <h2>Vui lòng đưa mã số này đến quầy vé FlickHive để nhận vé!</h2>
        </div>
        <div class="info">
            <p><span>Mã vé:</span><span>{{$booking->booking_code}}</span></p>
            <p><span>Tên phim:</span><span>{{$booking->showtime->movie->movie_name}}</span></p>
            <p><span>Rạp:</span><span>{{$booking->showtime->room->cinema->cinema_name}}</span></p>
            <p><span>Phòng chiếu:</span><span>{{$booking->showtime->room->room_name}}</span></p>
            <p><span>Suất chiếu:</span><span>{{ \Carbon\Carbon::parse($booking->showtime['showtime_start'])->format('H:i A') }} đến
                    {{ \Carbon\Carbon::parse($booking->showtime['showtime_end'])->format('H:i A') }}</span></p>
            <p><span>Ghế:</span><span>
            @foreach ($booking->seats as $item)
                {{ $item->seat_name }}{{ !$loop->last ? ',' : '' }}
            @endforeach
        </span></p>
        </div>
        
        <!-- Thicker hr -->
        <hr>

        <div class="combo">
            <p><span>Combo:</span></p>
            @foreach ($booking->combos as $combo)
                <p><span></span><span>{{ $combo->combo_name }} x {{ $combo->pivot->quantity }}</span></p>
            @endforeach
            
        </div>
        
        <!-- Thicker hr -->
        <hr>

        <div class="total">
            Tổng cộng: {{ number_format($booking->amount) }}đ
        </div>

        <!-- Cinema Info Section -->
        <div class="cinema-info">
            <p><strong>Thông tin rạp</strong></p>
            <p>FlickHive</p>
            <p>Địa Chỉ: {{$booking->showtime->room->cinema->cinema_address}}</p>
            <p>Phone: {{$booking->showtime->room->cinema->phone}}</p>
        </div>
    </div>
</body>
</html>